// api/admin.js — Admin data endpoint (chráněno heslem)
export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
    },
  });
  return res.json();
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body = {};
  try { body = await req.json(); } catch {}

  // Ověření hesla
  if (!ADMIN_PASSWORD || body.password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Nesprávné heslo' }), { status: 401 });
  }

  const action = body.action || 'dashboard';

  if (action === 'dashboard') {
    // Přehled — uživatelé + logy
    const [users, generations] = await Promise.all([
      supabaseGet('users?select=*&order=created_at.desc&limit=100'),
      supabaseGet('generations?select=*&order=created_at.desc&limit=200'),
    ]);

    // Statistiky
    const proUsers    = users.filter(u => u.plan === 'pro' && u.subscription_status === 'active');
    const totalGen    = generations.length;
    const todayGen    = generations.filter(g => {
      const d = new Date(g.created_at);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;

    // Top profese
    const tradeCounts = {};
    generations.forEach(g => {
      if (g.trade) tradeCounts[g.trade] = (tradeCounts[g.trade] || 0) + 1;
    });
    const topTrades = Object.entries(tradeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Top situace
    const sitCounts = {};
    generations.forEach(g => {
      if (g.situation) sitCounts[g.situation] = (sitCounts[g.situation] || 0) + 1;
    });
    const topSituations = Object.entries(sitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return new Response(JSON.stringify({
      stats: {
        totalUsers: users.length,
        proUsers: proUsers.length,
        totalGenerations: totalGen,
        todayGenerations: todayGen,
      },
      topTrades,
      topSituations,
      users,
      recentGenerations: generations.slice(0, 50),
    }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
}
