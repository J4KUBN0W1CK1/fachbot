// api/webhook.js — Stripe webhook → Supabase
// Zpracovává: platba úspěšná, předplatné zrušeno/expirováno
export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Supabase REST helper
async function supabase(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'resolution=merge-duplicates' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

// Stripe signature verification (Edge-compatible)
async function verifyStripeSignature(payload, sigHeader, secret) {
  const parts = sigHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1];
  const signature = parts.find(p => p.startsWith('v1=')).split('=')[1];

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === signature;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const payload = await req.text();
  const sigHeader = req.headers.get('stripe-signature');

  // Ověření signatury (přeskočit v testu pokud není nastaven webhook secret)
  if (STRIPE_WEBHOOK_SECRET && sigHeader) {
    const valid = await verifyStripeSignature(payload, sigHeader, STRIPE_WEBHOOK_SECRET);
    if (!valid) {
      return new Response('Invalid signature', { status: 400 });
    }
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const type = event.type;
  const obj  = event.data?.object;

  // Platba úspěšná — aktivovat Pro
  if (type === 'checkout.session.completed') {
    const email      = obj.customer_email || obj.customer_details?.email;
    const customerId = obj.customer;
    const subId      = obj.subscription;
    const lang       = obj.metadata?.lang || 'cs';

    if (email) {
      await supabase('POST', 'users', {
        email,
        plan: 'pro',
        stripe_customer_id: customerId,
        stripe_subscription_id: subId,
        subscription_status: 'active',
        lang,
        updated_at: new Date().toISOString(),
      });
    }
  }

  // Předplatné obnoveno
  if (type === 'customer.subscription.updated') {
    const status   = obj.status;
    const subId    = obj.id;
    const endDate  = new Date(obj.current_period_end * 1000).toISOString();
    const plan     = status === 'active' ? 'pro' : 'free';

    await supabase(
      'PATCH',
      `users?stripe_subscription_id=eq.${subId}`,
      {
        subscription_status: status,
        subscription_end: endDate,
        plan,
        updated_at: new Date().toISOString(),
      }
    );
  }

  // Předplatné zrušeno / expirováno — odebrat Pro
  if (type === 'customer.subscription.deleted') {
    const subId = obj.id;

    await supabase(
      'PATCH',
      `users?stripe_subscription_id=eq.${subId}`,
      {
        plan: 'free',
        subscription_status: 'canceled',
        updated_at: new Date().toISOString(),
      }
    );
  }

  return new Response('OK', { status: 200 });
}
