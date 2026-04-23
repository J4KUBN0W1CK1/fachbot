// api/portal.js — Stripe Customer Portal session
export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

async function getStripeCustomerId(email) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=stripe_customer_id`,
      {
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();
    return data?.[0]?.stripe_customer_id || null;
  } catch {
    return null;
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body = {};
  try { body = await req.json(); } catch {}

  const { email, lang = 'cs' } = body;
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 });
  }

  const customerId = await getStripeCustomerId(email);
  if (!customerId) {
    return new Response(JSON.stringify({ error: 'Účet nenalezen. Zkontroluj email.' }), { status: 404 });
  }

  const origin = req.headers.get('origin') || 'https://fachbot.com';
  const returnUrls = { cs: `${origin}/ucet`, sk: `${origin}/sk/ucet`, pl: `${origin}/pl/konto` };
  const returnUrl = returnUrls[lang] || returnUrls.cs;

  try {
    const params = new URLSearchParams();
    params.append('customer', customerId);
    params.append('return_url', returnUrl);

    const stripeRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe portal error:', data.error?.message);
      return new Response(
        JSON.stringify({ error: 'Nepodařilo se otevřít správu předplatného.' }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ url: data.url }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Chyba připojení.' }), { status: 500 });
  }
}
