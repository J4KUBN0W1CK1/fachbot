export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

// Limity: free uživatel (bez emailu) = 5, free s emailem = 5, pro = neomezeno
const FREE_LIMIT = 5;

async function getUserStatus(email) {
  if (!email || !SUPABASE_URL || !SUPABASE_SECRET_KEY) return { isPro: false, count: 0 };
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=plan,subscription_status`,
      {
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();
    const user = data?.[0];
    const isPro = user?.plan === 'pro' && user?.subscription_status === 'active';
    return { isPro, exists: !!user };
  } catch {
    return { isPro: false, exists: false };
  }
}

async function getGenerationCount(email) {
  if (!email || !SUPABASE_URL || !SUPABASE_SECRET_KEY) return 0;
  try {
    // Počet generování za posledních 30 dní
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/generations?email=eq.${encodeURIComponent(email)}&created_at=gte.${since}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          'Prefer': 'count=exact',
        },
      }
    );
    const countHeader = res.headers.get('content-range');
    // content-range: 0-4/5  → bereme číslo za lomítkem
    if (countHeader) {
      const total = parseInt(countHeader.split('/')[1], 10);
      return isNaN(total) ? 0 : total;
    }
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

async function logGeneration(email, lang, situation, trade, channel, tone) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/generations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email || null, lang, situation, trade, channel, tone, generated_text: text || null }),
    });
  } catch {}
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { situation, trade, description, tone, channel, addressMode = 'vy', clientName, clientThing, myName, myCompany, myPhone, myCity, lang = 'cs', email = '' } = body;

  if (!situation || !trade) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // ── Server-side freemium gate ──────────────────────────────────────────────
  // Pouze pokud máme email — bez emailu nelze ověřit, client-side limit platí
  if (email && email.includes('@')) {
    const [{ isPro }, serverCount] = await Promise.all([
      getUserStatus(email),
      getGenerationCount(email),
    ]);

    if (!isPro && serverCount >= FREE_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'limit_reached', message: 'Vyčerpal jsi volná generování.' }),
        { status: 429 }
      );
    }
  }

  const langMap = { cs: 'česky', sk: 'slovensky', pl: 'po polsku' };
  const langText = langMap[lang] || 'česky';

  const channelInstructions = {
    'WhatsApp zpráva': 'Napiš krátkou WhatsApp zprávu — max 5 vět, žádné formální oslovení, přátelský ale profesionální tón.',
    'SMS zpráva': 'Napiš SMS — max 2–3 věty, velmi stručně, jen to nejdůležitější.',
    'Email': 'Napiš email s předmětem a tělem zprávy. Trochu formálnější, ale stále lidský.',
    'Cenová nabídka': 'Napiš stručnou cenovou nabídku s popisem prací a orientační cenou. Strukturovaně, přehledně.',
    'PDF nabídka / faktura': 'Napiš strukturovaný text pro profesionální PDF nabídku — úvod, popis prací, orientační cena, podmínky, kontakt.',
  };

  const toneInstructions = {
    'Přirozený': 'Tón: přirozený, stručný, lidský. Žádné korporátní fráze.',
    'Formální': 'Tón: formální, věcný, profesionální. Správná čeština, zdvořilé formulace.',
  };

  const addressInstructions = addressMode === 'ty'
    ? 'Zákazníka tykej — používej 2. osobu jednotného čísla (ty, tvůj, zavolej...).'
    : 'Zákazníkovi vykej — používej 2. osobu množného čísla (Vy, Váš, zavolejte...). Vy/Váš piš s velkým V.';

  const situationInstructions = {
    'Požádat o recenzi': 'Napiš přátelskou žádost o Google recenzi. Zákazník je spokojený, požádej ho přirozeně — bez nátlaku, bez hvězdiček v textu. Přidej odkaz na Google recenze jako placeholder: [odkaz na Google recenze].',
    'Připomenout termín': 'Napiš krátkou přátelskou připomínku termínu návštěvy den předem. Uveď datum a čas pokud jsou v popisu. Max 3 věty.',
    'Odmítnout zakázku': 'Napiš slušné odmítnutí zakázky. Nebude znít jako výmluva — jednoduše nemáš kapacitu nebo zakázka nespadá do tvého oboru. Zachovej dobrý vztah, případně navrhni alternativu.',
  };

  const situationExtra = situationInstructions[situation] ? `\nSpecifické instrukce pro tuto situaci: ${situationInstructions[situation]}` : '';

  const systemPrompt = `Jsi asistent pro ${trade}. Pomáháš psát zprávy zákazníkům ${langText}. 
Piš vždy ${langText}. Nikdy nepřidávej vysvětlení, jen samotný text zprávy.
${channelInstructions[channel] || channelInstructions['WhatsApp zpráva']}
${toneInstructions[tone] || toneInstructions['Přirozený']}
${addressInstructions}${situationExtra}
${myName ? `Odesílatel: ${myName}${myCompany ? ', ' + myCompany : ''}${myCity ? ', ' + myCity : ''}${myPhone ? ', ' + myPhone : ''}.` : ''}
Vždy přidej podpis odesílatele pokud jsou jeho údaje k dispozici.`;

  const userPrompt = `Situace: ${situation}
Profese: ${trade}
${clientName ? `Zákazník: ${clientName}` : ''}
${clientThing ? `Předmět zakázky: ${clientThing}` : ''}
${description ? `Popis: ${description}` : 'Připrav vhodný text pro danou situaci.'}

Napiš hotový text zprávy.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return new Response(JSON.stringify({ error: err.error?.message || 'OpenAI error' }), { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    // Logovat generování do Supabase (async, neblokuje odpověď)
    logGeneration(email, lang, situation, trade, channel, tone);

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });
  }
}
