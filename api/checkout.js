// api/checkout.js — Stripe Checkout session
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price IDs pro každou kombinaci jazyk × billing period
const PRICES = {
  cs: {
    monthly: 'price_1TPQUmF6raFkbeu3XSZwp1dR', // 249 Kč/měsíc
    yearly:  'price_1TPQXoF6raFkbeu3poOZHaVV', // 2 490 Kč/rok
  },
  sk: {
    monthly: 'price_1TPQYZF6raFkbeu3SeMKUGyo', // 9,99 €/měsíc
    yearly:  'price_1TPQZBF6raFkbeu3FKwEWYQI', // 99 €/rok
  },
  pl: {
    monthly: 'price_1TPQZdF6raFkbeu3jjlxvxiS', // 39 zł/měsíc
    yearly:  'price_1TPQa4F6raFkbeu3zZiyVA5c',  // 390 zł/rok
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lang = 'cs', billing = 'monthly', email = '' } = req.body || {};

  const priceId = PRICES[lang]?.[billing];
  if (!priceId) {
    return res.status(400).json({ error: 'Neplatná kombinace jazyk/billing' });
  }

  // Detekce origin pro success/cancel URL
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://fachbot.vercel.app';
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

    // Předvyplň email pokud ho máme (z email gate)
    if (email && email.includes('@')) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Nepodařilo se vytvořit platební session' });
  }
}
