// api/account.js — GET profil + historie, POST uložení profilu
export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const sbHeaders = {
  'apikey': SUPABASE_SECRET_KEY,
  'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

export default async function handler(req) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Not configured' }), { status: 500 });
  }

  const url = new URL(req.url);
  const email = url.searchParams.get('email') || '';

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 });
  }

  // ── GET — načti profil + historii ─────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const [userRes, historyRes] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=email,plan,subscription_status,subscription_end,display_name,company,phone,city,pref_tone,pref_address`,
          { headers: sbHeaders }
        ),
        fetch(
          `${SUPABASE_URL}/rest/v1/generations?email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=30&select=id,situation,trade,channel,tone,lang,generated_text,created_at`,
          { headers: sbHeaders }
        ),
      ]);

      const user = await userRes.json();
      const history = await historyRes.json();

      return new Response(
        JSON.stringify({
          user: user?.[0] || null,
          history: Array.isArray(history) ? history : [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
    }
  }

  // ── POST — ulož profil ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch {}

    const { display_name, company, phone, city, pref_tone, pref_address } = body;

    try {
      // Upsert — pokud uživatel neexistuje v tabulce (edge case), vytvoří ho
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            display_name: display_name || null,
            company: company || null,
            phone: phone || null,
            city: city || null,
            pref_tone: pref_tone || 'Přirozený',
            pref_address: pref_address || 'vy',
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Uložení selhalo' }), { status: 500 });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch {
      return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}
