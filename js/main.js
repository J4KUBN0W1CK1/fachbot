// ─── DOM refs ────────────────────────────────────────────────────────────────
const html             = document.documentElement;
const themeToggle      = document.getElementById('themeToggle');
const situations       = [...document.querySelectorAll('.situation')];
const tradePills       = [...document.querySelectorAll('.trade-pill')];
const resultBox        = document.getElementById('resultBox');
const metaSituation    = document.getElementById('metaSituation');
const metaChannel      = document.getElementById('metaChannel');
const metaTrade        = document.getElementById('metaTrade');
const tone             = document.getElementById('tone');
const addressMode      = document.getElementById('addressMode');
const jobDesc          = document.getElementById('jobDesc');
const clientName       = document.getElementById('clientName');
const clientThing      = document.getElementById('clientThing');
const clientPhone      = document.getElementById('clientPhone');
const clientEmail      = document.getElementById('clientEmail');
const channel          = document.getElementById('channel');
const myName           = document.getElementById('myName');
const myCompany        = document.getElementById('myCompany');
const myPhone          = document.getElementById('myPhone');
const myCity           = document.getElementById('myCity');
const generateBtn      = document.getElementById('generateBtn');
const mobileGenerateBtn= document.getElementById('mobileGenerateBtn');
const resetBtn         = document.getElementById('resetBtn');
const copyBtn          = document.getElementById('copyBtn');
const regenBtn         = document.getElementById('regenBtn');
const waBtn            = document.getElementById('waBtn');
const mailBtn          = document.getElementById('mailBtn');

// ─── Theme ───────────────────────────────────────────────────────────────────
const initialThemeDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
html.setAttribute('data-theme', initialThemeDark ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  html.setAttribute(
    'data-theme',
    html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
});

// ─── Situation + trade pills ──────────────────────────────────────────────────
situations.forEach(btn =>
  btn.addEventListener('click', () => {
    situations.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    metaSituation.textContent = btn.dataset.type;
  })
);

tradePills.forEach(btn =>
  btn.addEventListener('click', () => {
    tradePills.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    metaTrade.textContent = btn.textContent.trim();
  })
);

channel.addEventListener('change', () => {
  metaChannel.textContent = channel.value;
});

// ─── Show more trades ─────────────────────────────────────────────────────────
const showMoreBtn    = document.getElementById('showMoreTrades');
const tradeGridExtra = document.getElementById('tradeGridExtra');
if (showMoreBtn && tradeGridExtra) {
  showMoreBtn.addEventListener('click', () => {
    tradeGridExtra.classList.toggle('hidden');
    showMoreBtn.textContent = tradeGridExtra.classList.contains('hidden')
      ? '+ Zobrazit více profesí'
      : '− Skrýt';
    tradeGridExtra.querySelectorAll('.trade-pill').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.trade-pill').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        if (metaTrade) metaTrade.textContent = btn.textContent.trim();
      })
    );
  });
}

// ─── Cookie bar ───────────────────────────────────────────────────────────────
const cookieBar    = document.getElementById('cookieBar');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBar && !localStorage.getItem('cookie_ok')) {
  cookieBar.classList.add('visible');
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookie_ok', '1');
    cookieBar.classList.remove('visible');
  });
}

// ─── Freemium ─────────────────────────────────────────────────────────────────
// fb_count       = number of generations used
// fb_email_bonus = "1" if user entered email (grants 2 extra = total 5)
const FREE_LIMIT       = 3;
const EMAIL_BONUS      = 2;
const TOTAL_LIMIT      = FREE_LIMIT + EMAIL_BONUS; // 5

function getCount()      { return parseInt(localStorage.getItem('fb_count') || '0', 10); }
function hasEmailBonus() { return localStorage.getItem('fb_email_bonus') === '1'; }
function incrementCount(){ localStorage.setItem('fb_count', getCount() + 1); }

function getRemainingGenerations() {
  const limit = hasEmailBonus() ? TOTAL_LIMIT : FREE_LIMIT;
  return Math.max(0, limit - getCount());
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function createEmailModal() {
  const overlay = document.createElement('div');
  overlay.className = 'fb-modal-overlay';
  overlay.innerHTML = `
    <div class="fb-modal" role="dialog" aria-modal="true" aria-labelledby="fb-modal-title">
      <div class="fb-modal-icon">✉️</div>
      <h2 id="fb-modal-title">Ještě 2 generování zdarma</h2>
      <p>Zadej email a získáš 2 generování navíc — bez nutnosti platit.</p>
      <input type="email" id="fb-email-input" placeholder="tvuj@email.cz" autocomplete="email" />
      <p class="fb-modal-hint">Bez spamu. Email využijeme jen pro přístup k Fachbotu.</p>
      <button class="fb-modal-btn" id="fb-email-submit">Získat 2 generování zdarma</button>
      <button class="fb-modal-skip" id="fb-email-skip">Přejít na Pro verzi →</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));

  const input  = overlay.querySelector('#fb-email-input');
  const submit = overlay.querySelector('#fb-email-submit');
  const skip   = overlay.querySelector('#fb-email-skip');

  input.focus();

  function saveEmail() {
    const val = input.value.trim();
    if (!val || !val.includes('@')) {
      input.classList.add('field-error');
      setTimeout(() => input.classList.remove('field-error'), 1200);
      return;
    }
    localStorage.setItem('fb_email_bonus', '1');
    localStorage.setItem('fb_email', val);
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
    // Now run the actual generation that was blocked
    runGeneration();
  }

  submit.addEventListener('click', saveEmail);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') saveEmail(); });
  skip.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
    showPaywall();
  });
}

// ─── Stripe checkout helper ───────────────────────────────────────────────────
async function startCheckout(billing = 'monthly') {
  const lang  = window.FACHBOT_LANG || 'cs';
  const email = localStorage.getItem('fb_email') || '';

  try {
    const resp = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, billing, email }),
    });
    const data = await resp.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Nepodařilo se otevřít platební stránku. Napiš nám na info@fachbot.com.');
    }
  } catch {
    alert('Nepodařilo se otevřít platební stránku. Napiš nám na info@fachbot.com.');
  }
}

function showPaywall() {
  const lang = window.FACHBOT_LANG || 'cs';

  // Texty podle jazyka
  const t = {
    cs: {
      title: 'Vyčerpal jsi volná generování',
      desc:  'S Fachbot Pro máš neomezená generování, PDF nabídky a vlastní hlavičku.',
      monthly: '249 Kč / měsíc',
      yearly:  '2 490 Kč / rok',
      ctaMonthly: 'Přejít na Pro — 249 Kč/měsíc',
      ctaYearly:  'Přejít na Pro — 2 490 Kč/rok',
      close: 'Zavřít',
    },
    sk: {
      title: 'Vyčerpal si voľné generovanie',
      desc:  'S Fachbot Pro máš neobmedzené generovanie, PDF ponuky a vlastnú hlavičku.',
      monthly: '9,99 € / mesiac',
      yearly:  '99 € / rok',
      ctaMonthly: 'Prejsť na Pro — 9,99 €/mesiac',
      ctaYearly:  'Prejsť na Pro — 99 €/rok',
      close: 'Zatvoriť',
    },
    pl: {
      title: 'Wykorzystałeś darmowe generowania',
      desc:  'Z Fachbot Pro masz nieograniczone generowanie, oferty PDF i własny nagłówek.',
      monthly: '39 zł / miesiąc',
      yearly:  '390 zł / rok',
      ctaMonthly: 'Przejdź na Pro — 39 zł/miesiąc',
      ctaYearly:  'Przejdź na Pro — 390 zł/rok',
      close: 'Zamknij',
    },
  };
  const tx = t[lang] || t.cs;

  const overlay = document.createElement('div');
  overlay.className = 'fb-modal-overlay';
  overlay.innerHTML = `
    <div class="fb-modal" role="dialog" aria-modal="true" aria-labelledby="fb-paywall-title">
      <div class="fb-modal-icon">🔒</div>
      <h2 id="fb-paywall-title">${tx.title}</h2>
      <p>${tx.desc}</p>
      <ul class="fb-paywall-perks">
        <li>✓ Neomezená generování</li>
        <li>✓ PDF nabídky s tvojí hlavičkou</li>
        <li>✓ Vlastní šablony</li>
        <li>✓ Historie zpráv</li>
      </ul>
      <div class="fb-paywall-billing">
        <button class="fb-billing-toggle active" id="pw-monthly" type="button">${tx.monthly}</button>
        <button class="fb-billing-toggle" id="pw-yearly" type="button">${tx.yearly}</button>
      </div>
      <button class="fb-modal-btn" id="fb-paywall-cta">${tx.ctaMonthly}</button>
      <button class="fb-modal-skip" id="fb-paywall-close">${tx.close}</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));

  const cta        = overlay.querySelector('#fb-paywall-cta');
  const close      = overlay.querySelector('#fb-paywall-close');
  const pwMonthly  = overlay.querySelector('#pw-monthly');
  const pwYearly   = overlay.querySelector('#pw-yearly');
  let billing = 'monthly';

  pwMonthly.addEventListener('click', () => {
    billing = 'monthly';
    pwMonthly.classList.add('active');
    pwYearly.classList.remove('active');
    cta.textContent = tx.ctaMonthly;
  });

  pwYearly.addEventListener('click', () => {
    billing = 'yearly';
    pwYearly.classList.add('active');
    pwMonthly.classList.remove('active');
    cta.textContent = tx.ctaYearly;
  });

  cta.addEventListener('click', () => startCheckout(billing));

  close.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
  });
}

// ─── Loading state ────────────────────────────────────────────────────────────
function setLoading(isLoading) {
  const btns = [generateBtn, mobileGenerateBtn].filter(Boolean);
  btns.forEach(btn => {
    btn.disabled = isLoading;
    btn.classList.toggle('loading', isLoading);
    btn.textContent = isLoading ? 'Generuji…' : 'Vygenerovat zprávu';
  });
  if (regenBtn) {
    regenBtn.disabled = isLoading;
  }
}

// ─── Core generation ──────────────────────────────────────────────────────────
async function runGeneration() {
  const situation  = document.querySelector('.situation.active')?.dataset.type || 'Domluvit termín';
  const trade      = document.querySelector('.trade-pill.active')?.textContent.trim() || 'Instalatér';
  const desc       = jobDesc.value.trim();
  const toneValue      = tone.value;
  const addressModeValue = addressMode?.value || 'vy';
  const output         = channel.value;
  const cName      = clientName.value.trim();
  const cThing     = clientThing.value.trim();
  const signer     = myName.value.trim();
  const company    = myCompany.value.trim();
  const phone      = myPhone.value.trim();
  const city       = myCity.value.trim();

  setLoading(true);
  resultBox.textContent = '';

  try {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situation,
        trade,
        description: desc,
        tone: toneValue,
        addressMode: addressModeValue,
        channel: output,
        clientName: cName,
        clientThing: cThing,
        myName: signer,
        myCompany: company,
        myPhone: phone,
        myCity: city,
        lang: window.FACHBOT_LANG || 'cs',
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `Chyba serveru (${resp.status})`);
    }

    const data = await resp.json();
    resultBox.textContent = data.text || '— žádný výsledek —';
    incrementCount();
  } catch (err) {
    resultBox.textContent = `Něco se pokazilo: ${err.message}\n\nZkus to prosím znovu.`;
  } finally {
    setLoading(false);
  }
}

// ─── Generate with freemium gate ──────────────────────────────────────────────
function handleGenerate() {
  const count    = getCount();
  const hasBonus = hasEmailBonus();
  const limit    = hasBonus ? TOTAL_LIMIT : FREE_LIMIT;

  if (count >= limit) {
    if (!hasBonus) {
      // Reached free limit (3) → show email gate
      createEmailModal();
    } else {
      // Reached total limit (5) → show paywall
      showPaywall();
    }
    return;
  }

  // Has remaining generations → run
  runGeneration();
}

generateBtn?.addEventListener('click', handleGenerate);
mobileGenerateBtn?.addEventListener('click', handleGenerate);

// Regenerate uses same gate
regenBtn?.addEventListener('click', handleGenerate);

// ─── Reset ────────────────────────────────────────────────────────────────────
resetBtn?.addEventListener('click', () => {
  [jobDesc, clientName, clientThing, clientPhone, clientEmail,
   myName, myCompany, myPhone, myCity].forEach(el => { if(el) el.value = ''; });

  tone.selectedIndex    = 0;
  channel.selectedIndex = 0;
  metaChannel.textContent = channel.value;

  resultBox.textContent = `Dobrý den pane Nováku,\n\nozývám se k vaší poptávce. Mohl bych vám nabídnout termín v úterý odpoledne nebo ve středu dopoledne.\n\nPokud vám bude jeden z termínů sedět, rovnou ho potvrdíme. Když budete chtít, pošlu i stručnou cenovou nabídku.\n\nDěkuji,`;
});

// ─── Copy ─────────────────────────────────────────────────────────────────────
copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultBox.textContent);
    copyBtn.textContent = 'Zkopírováno';
    setTimeout(() => { copyBtn.textContent = 'Kopírovat'; }, 1200);
  } catch {
    copyBtn.textContent = 'Nelze kopírovat';
    setTimeout(() => { copyBtn.textContent = 'Kopírovat'; }, 1200);
  }
});

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
waBtn?.addEventListener('click', () => {
  const ph   = clientPhone?.value.trim();
  const text = encodeURIComponent(resultBox.textContent);

  if (!ph) {
    clientPhone.focus();
    clientPhone.placeholder = 'Doplň telefon pro WhatsApp';
    clientPhone.classList.add('field-error');
    setTimeout(() => clientPhone.classList.remove('field-error'), 1500);
    return;
  }

  const cleaned = ph.replace(/\s+/g, '');
  window.open(`https://wa.me/${cleaned}?text=${text}`, '_blank', 'noopener,noreferrer');
});

// ─── Email ────────────────────────────────────────────────────────────────────
mailBtn?.addEventListener('click', () => {
  const mail    = clientEmail?.value.trim();
  const subject = encodeURIComponent(metaSituation?.textContent || '');
  const body    = encodeURIComponent(resultBox.textContent);
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
});

// ─── Billing toggle ───────────────────────────────────────────────────────────
const billMonthly    = document.getElementById('billMonthly');
const billYearly     = document.getElementById('billYearly');
const pricingSection = document.getElementById('pricing');

if (billMonthly && billYearly && pricingSection) {
  billMonthly.addEventListener('click', () => {
    pricingSection.dataset.billing = 'monthly';
    billMonthly.classList.add('active');
    billYearly.classList.remove('active');
  });

  billYearly.addEventListener('click', () => {
    pricingSection.dataset.billing = 'yearly';
    billYearly.classList.add('active');
    billMonthly.classList.remove('active');
  });
}

// ─── Show more situations ─────────────────────────────────────────────────────
const showMoreSituations  = document.getElementById('showMoreSituations');
const situationGridExtra  = document.getElementById('situationGridExtra');

if (showMoreSituations && situationGridExtra) {
  showMoreSituations.addEventListener('click', () => {
    situationGridExtra.classList.toggle('hidden');
    showMoreSituations.textContent = situationGridExtra.classList.contains('hidden')
      ? '+ Zobrazit další situace'
      : '− Skrýt';
    situationGridExtra.querySelectorAll('.situation').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.situation').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        if (metaSituation) metaSituation.textContent = btn.dataset.type;
      })
    );
  });
}

// ─── Feedback widget ──────────────────────────────────────────────────────────
const voteUp          = document.getElementById('voteUp');
const voteDown        = document.getElementById('voteDown');
const feedbackComment = document.getElementById('feedbackComment');
const feedbackSend    = document.getElementById('feedbackSend');
const feedbackThanks  = document.getElementById('feedbackThanks');

if (voteUp && voteDown) {
  voteUp.addEventListener('click', () => {
    voteUp.classList.add('selected');
    voteDown.classList.remove('selected');
    if (feedbackComment) feedbackComment.style.display = 'none';
    if (feedbackThanks) {
      feedbackThanks.style.display = 'block';
      feedbackThanks.textContent = 'Super, díky! 🙌';
    }
  });

  voteDown.addEventListener('click', () => {
    voteDown.classList.add('selected');
    voteUp.classList.remove('selected');
    if (feedbackComment) feedbackComment.style.display = 'block';
    if (feedbackThanks) feedbackThanks.style.display = 'none';
  });

  feedbackSend?.addEventListener('click', () => {
    const text = document.getElementById('feedbackText')?.value.trim() || '';
    const subject = encodeURIComponent('Zpětná vazba – Fachbot');
    const body = encodeURIComponent(text || 'Zpětná vazba bez komentáře.');
    window.location.href = `mailto:info@fachbot.com?subject=${subject}&body=${body}`;
    if (feedbackComment) feedbackComment.style.display = 'none';
    if (feedbackThanks) {
      feedbackThanks.style.display = 'block';
      feedbackThanks.textContent = 'Díky! Otevírám tvůj email…';
    }
  });
}

// ─── Pricing CTA ───────────────────────────────────────────────────
const pricingProBtn = document.getElementById('pricingProBtn');
if (pricingProBtn) {
  pricingProBtn.addEventListener('click', () => {
    const billing = pricingSection?.dataset.billing === 'yearly' ? 'yearly' : 'monthly';
    startCheckout(billing);
  });
}

// ─── Hamburger menu ───────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  // Zavřít po kliknutí na odkaz
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  // Zavřít po kliknutí mimo
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}
