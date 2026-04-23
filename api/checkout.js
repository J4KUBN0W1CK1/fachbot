// api/checkout.js — Stripe Checkout session (Node.js runtime)
const Stripe = require('stripe');

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { lang = 'cs', billing = 'monthly', email = '' } = req.body || {};

  const priceId = PRICES[lang]?.[billing];
  if (!priceId) {
    return res.status(400).json({ error: 'Neplatna kombinace' });
  }

  const origin = req.headers.origin
    || (req.headers.referer ? req.headers.referer.replace(/\/[^/]*$/, '') : null)
    || 'https://fachbot.vercel.app';
  const langPrefix = lang === 'cs' ? '' : `/${lang}`;

  try {
    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${langPrefix}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}${langPrefix}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    if (email && email.includes('@')) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
