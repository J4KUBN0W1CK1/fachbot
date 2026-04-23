export const config = { runtime: 'edge' };

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

  const { situation, trade, description, tone, channel, addressMode = 'vy', clientName, clientThing, myName, myCompany, myPhone, myCity, lang = 'cs' } = body;

  if (!situation || !trade) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
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

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });
  }
}
