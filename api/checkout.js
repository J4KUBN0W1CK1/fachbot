// api/checkout.js — Stripe Checkout session přes REST API (bez npm balíčku)
export const config = { runtime: 'edge' };

const PRICES = {
  cs: {
    monthly: 'price_1TPQUmF6raFkbeu3XSZwp1dR',
    yearly:  'price_1TPQXoF6raFkbeu3poOZHaVV',
  },
  sk: {
    monthly: 'price_1TPQYZF6raFkbeu3SeMKUGyo',
    yearly:  'price_1TPQZBF6raFkbeu3FKwEWYQI',
  },
  pl: {
    monthly: 'price_1TPQZdF6raFkbeu3jjlxvxiS',
    yearly:  'price_1TPQa4F6raFkbeu3zZiyVA5c',
  },
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body = {};
  try { body = await req.json(); } catch {}

  const { lang = 'cs', billing = 'monthly', email = '' } = body;

  const priceId = PRICES[lang]?.[billing];
  if (!priceId) {
    return new Response(JSON.stringify({ error: 'Neplatna kombinace' }), { status: 400 });
  }

  const origin = req.headers.get('origin')
    || req.headers.get('referer')?.replace(/\/$/, '')
    || 'https://fachbot.vercel.app';
  const langPrefix = lang === 'cs' ? '' : `/${lang}`;

  const successUrl = `${origin}${langPrefix}/success.html?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl  = `${origin}${langPrefix}/#pricing`;

  // Sestavíme form-encoded body pro Stripe API
  const params = new URLSearchParams();
  params.append('mode', 'subscription');
  params.append('line_items[0][price]', priceId);
  params.append('line_items[0][quantity]', '1');
  params.append('success_url', successUrl);
  params.append('cancel_url', cancelUrl);
  params.append('allow_promotion_codes', 'true');
  params.append('billing_address_collection', 'auto');
  if (email && email.includes('@')) {
    params.append('customer_email', email);
  }

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe error:', data.error?.message);
      return new Response(JSON.stringify({ error: data.error?.message || 'Stripe error' }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: data.url }), { status: 200 });
  } catch (err) {
    console.error('Fetch error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
