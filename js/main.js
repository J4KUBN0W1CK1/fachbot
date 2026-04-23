// ─── i18n ───────────────────────────────────────────────────────────────────
const LANG = window.FACHBOT_LANG || 'cs';
const i18n = {
  cs: {
    showMoreTrades:      '+ Zobrazit více profesí',
    hideTrades:          '− Skrýt',
    showMoreSituations:  '+ Zobrazit další situace',
    hideSituations:      '− Skrýt',
    generating:          'Generuji…',
    generateBtn:         'Vygenerovat zprávu',
    serverError:         'Chyba serveru',
    noResult:            '— žádný výsledek —',
    errorPrefix:         'Něco se pokazilo',
    errorRetry:          'Zkus to prosím znovu.',
    copied:              'Zkopírováno',
    copy:                'Kopírovat',
    cannotCopy:          'Nelze kopírovat',
    waPlaceholder:       'Doplň telefon pro WhatsApp',
    emailModalTitle:     'Ještě 2 generování zdarma',
    emailModalDesc:      'Zadej email a získáš 2 generování navíc — bez nutnosti platit.',
    emailPlaceholder:    'tvuj@email.cz',
    emailHint:           'Bez spamu. Email využijeme jen pro přístup k Fachbotu.',
    emailSubmit:         'Získat 2 generování zdarma',
    emailSkip:           'Přejít na Pro verzi →',
    paywallPerk1:        'Neomezená generování',
    paywallPerk2:        'PDF nabídky s tvojí hlavičkou',
    paywallPerk3:        'Vlastní šablony',
    paywallPerk4:        'Historie zpráv',
    feedbackUp:          'Super, díky! 🙌',
    feedbackDown:        'Díky! Zaznamenáno.',
    checkoutError:       'Chyba',
    checkoutFetchError:  'Chyba připojení',
    resetText:           'Dobrý den pane Nováku,\n\nozývám se k vaší poptávce. Mohl bych vám nabídnout termín v úterý odpoledne nebo ve středu dopoledne.\n\nPokud vám bude jeden z termínů sedět, rovnou ho potvrdíme. Když budete chtít, pošlu i stručnou cenovou nabídku.\n\nDěkuji,',
    resetChannel:        'SMS',
  },
  sk: {
    showMoreTrades:      '+ Zobraziť viac profesií',
    hideTrades:          '− Skryť',
    showMoreSituations:  '+ Zobraziť ďalšie situácie',
    hideSituations:      '− Skryť',
    generating:          'Generujem…',
    generateBtn:         'Pripraviť text',
    serverError:         'Chyba servera',
    noResult:            '— žiadny výsledok —',
    errorPrefix:         'Niečo sa pokazilo',
    errorRetry:          'Skús to prosím znova.',
    copied:              'Skopírované',
    copy:                'Kopírovať',
    cannotCopy:          'Nedá sa kopírovať',
    waPlaceholder:       'Doplň telefón pre WhatsApp',
    emailModalTitle:     'Ešte 2 generovania zadarmo',
    emailModalDesc:      'Zadaj email a získaš 2 generovania navyše — bez platenia.',
    emailPlaceholder:    'tvoj@email.sk',
    emailHint:           'Bez spamu. Email použijeme len pre prístup k Fachbotu.',
    emailSubmit:         'Získať 2 generovania zadarmo',
    emailSkip:           'Prejsť na Pro verziu →',
    paywallPerk1:        'Neobmedzené generovanie',
    paywallPerk2:        'PDF ponuky s tvojou hlavičkou',
    paywallPerk3:        'Vlastné šablóny',
    paywallPerk4:        'História správ',
    feedbackUp:          'Super, ďakujem! 🙌',
    feedbackDown:        'Ďakujem! Zaznamenané.',
    checkoutError:       'Chyba',
    checkoutFetchError:  'Chyba pripojenia',
    resetText:           'Dobrý deň pán Novák,\n\nozývam sa k vašej dopyte. Mohol by som vám ponúknuť termín v utorok popoludní alebo v stredu dopoludnia.\n\nAk vám niektorý termín vyhovuje, hneď ho potvrdíme. Ak budete chcieť, pošlem aj stručnú cenovú ponuku.\n\nĎakujem,',
    resetChannel:        'SMS',
  },
  pl: {
    showMoreTrades:      '+ Pokaż więcej zawodów',
    hideTrades:          '− Ukryj',
    showMoreSituations:  '+ Pokaż więcej sytuacji',
    hideSituations:      '− Ukryj',
    generating:          'Generuję…',
    generateBtn:         'Przygotuj tekst',
    serverError:         'Błąd serwera',
    noResult:            '— brak wyniku —',
    errorPrefix:         'Coś poszło nie tak',
    errorRetry:          'Spróbuj ponownie.',
    copied:              'Skopiowano',
    copy:                'Kopiuj',
    cannotCopy:          'Nie można skopiować',
    waPlaceholder:       'Podaj telefon do WhatsApp',
    emailModalTitle:     'Jeszcze 2 generowania za darmo',
    emailModalDesc:      'Podaj email i dostaniesz 2 dodatkowe generowania — bez płacenia.',
    emailPlaceholder:    'twoj@email.pl',
    emailHint:           'Bez spamu. Użyjemy emaila tylko do dostępu do Fachbota.',
    emailSubmit:         'Zdobadź 2 generowania za darmo',
    emailSkip:           'Przejdź do wersji Pro →',
    paywallPerk1:        'Nieograniczone generowania',
    paywallPerk2:        'Oferty PDF z twoim nagłówkiem',
    paywallPerk3:        'Własne szablony',
    paywallPerk4:        'Historia wiadomości',
    feedbackUp:          'Super, dzięki! 🙌',
    feedbackDown:        'Dzięki! Zapisane.',
    checkoutError:       'Błąd',
    checkoutFetchError:  'Błąd połączenia',
    resetText:           'Dzień dobry Panie Nowak,\n\nodzywam się w sprawie Pana zapytania. Mogę zaproponować termin we wtorek po południu lub w środę przed południem.\n\nJeśli któryś termin Panu odpowiada, od razu go potwierdzimy. Jeśli chce Pan, mogę też przesłać krótką wycenę.\n\nDziękuję,',
    resetChannel:        'SMS',
  },
};
const t = i18n[LANG] || i18n.cs;

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
      ? t.showMoreTrades
      : t.hideTrades;
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
const mobileSticky = document.querySelector('.mobile-sticky');

function updateStickyVisibility() {
  if (!mobileSticky) return;
  const cookieVisible = cookieBar && cookieBar.classList.contains('visible');
  if (cookieVisible) {
    mobileSticky.style.display = 'none';
  } else {
    mobileSticky.style.display = '';
  }
}

if (cookieBar && !localStorage.getItem('cookie_ok')) {
  cookieBar.classList.add('visible');
  updateStickyVisibility();
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookie_ok', '1');
    cookieBar.classList.remove('visible');
    updateStickyVisibility();
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
      <h2 id="fb-modal-title">${t.emailModalTitle}</h2>
      <p>${t.emailModalDesc}</p>
      <input type="email" id="fb-email-input" placeholder="${t.emailPlaceholder}" autocomplete="email" />
      <p class="fb-modal-hint">${t.emailHint}</p>
      <button class="fb-modal-btn" id="fb-email-submit">${t.emailSubmit}</button>
      <button class="fb-modal-skip" id="fb-email-skip">${t.emailSkip}</button>
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
      alert(t.checkoutError + ': ' + (data.error || '?'));
    }
  } catch (e) {
    alert(t.checkoutFetchError + ': ' + e.message);
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
        <li>✓ ${t.paywallPerk1}</li>
        <li>✓ ${t.paywallPerk2}</li>
        <li>✓ ${t.paywallPerk3}</li>
        <li>✓ ${t.paywallPerk4}</li>
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
    btn.textContent = isLoading ? t.generating : t.generateBtn;
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
        email: localStorage.getItem('fb_email') || '',
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `${t.serverError} (${resp.status})`);
    }

    const data = await resp.json();
    resultBox.textContent = data.text || t.noResult;
    incrementCount();
  } catch (err) {
    resultBox.textContent = `${t.errorPrefix}: ${err.message}\n\n${t.errorRetry}`;
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

  resultBox.textContent = t.resetText;
});

// ─── Copy ─────────────────────────────────────────────────────────────────────
copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultBox.textContent);
    copyBtn.textContent = t.copied;
    setTimeout(() => { copyBtn.textContent = t.copy; }, 1200);
  } catch {
    copyBtn.textContent = t.cannotCopy;
    setTimeout(() => { copyBtn.textContent = t.copy; }, 1200);
  }
});

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
waBtn?.addEventListener('click', () => {
  const ph   = clientPhone?.value.trim();
  const text = encodeURIComponent(resultBox.textContent);

  if (!ph) {
    clientPhone.focus();
    clientPhone.placeholder = t.waPlaceholder;
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
      ? t.showMoreSituations
      : t.hideSituations;
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

async function sendFeedback(vote, comment = '') {
  const situation = document.querySelector('.situation.active')?.dataset.type || '';
  const trade = document.querySelector('.trade-pill.active')?.textContent.trim() || '';
  const lang = window.FACHBOT_LANG || 'cs';
  try {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote, comment, lang, situation, trade }),
    });
  } catch {}
}

if (voteUp && voteDown) {
  voteUp.addEventListener('click', () => {
    voteUp.classList.add('selected');
    voteDown.classList.remove('selected');
    if (feedbackComment) feedbackComment.style.display = 'none';
    if (feedbackThanks) {
      feedbackThanks.style.display = 'block';
      feedbackThanks.textContent = t.feedbackUp;
    }
    sendFeedback('up');
  });

  voteDown.addEventListener('click', () => {
    voteDown.classList.add('selected');
    voteUp.classList.remove('selected');
    if (feedbackComment) feedbackComment.style.display = 'block';
    if (feedbackThanks) feedbackThanks.style.display = 'none';
  });

  feedbackSend?.addEventListener('click', () => {
    const text = document.getElementById('feedbackText')?.value.trim() || '';
    sendFeedback('down', text);
    if (feedbackComment) feedbackComment.style.display = 'none';
    if (feedbackThanks) {
      feedbackThanks.style.display = 'block';
      feedbackThanks.textContent = t.feedbackDown;
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

// ─── Firma CTA ───────────────────────────────────────────────────
const firmaCTA = document.getElementById('firmaCTA');
if (firmaCTA) {
  firmaCTA.addEventListener('click', () => {
    const lang = window.FACHBOT_LANG || 'cs';
    const subjects = { cs: 'Zájem o firemní tarif Fachbot', sk: 'Záujem o firemný tarif Fachbot', pl: 'Zapytanie o plan firmowy Fachbot' };
    const bodies = {
      cs: 'Dobrý den,%0A%0Amám zájem o firemní tarif Fachbot.%0A%0APočet uživatelů:%0ANazev firmy:%0ATelefon:%0A%0ADěkuji',
      sk: 'Dobrý deň,%0A%0Amám záujem o firemný tarif Fachbot.%0A%0APočet používateľov:%0ANázov firmy:%0ATelefón:%0A%0AViac info',
      pl: 'Dzień dobry,%0A%0AChciałbym dowiedzieć się więcej o planie firmowym Fachbot.%0A%0ALiczba użytkowników:%0ANazwa firmy:%0ATelefon:%0A%0ADziękuję',
    };
    window.location.href = `mailto:info@fachbot.com?subject=${subjects[lang] || subjects.cs}&body=${bodies[lang] || bodies.cs}`;
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
