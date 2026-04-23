const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const situations = [...document.querySelectorAll('.situation')];
const tradePills = [...document.querySelectorAll('.trade-pill')];
const resultBox = document.getElementById('resultBox');
const metaSituation = document.getElementById('metaSituation');
const metaChannel = document.getElementById('metaChannel');
const metaTrade = document.getElementById('metaTrade');
const tone = document.getElementById('tone');
const jobDesc = document.getElementById('jobDesc');
const clientName = document.getElementById('clientName');
const clientThing = document.getElementById('clientThing');
const clientPhone = document.getElementById('clientPhone');
const clientEmail = document.getElementById('clientEmail');
const channel = document.getElementById('channel');
const myName = document.getElementById('myName');
const myCompany = document.getElementById('myCompany');
const myPhone = document.getElementById('myPhone');
const myCity = document.getElementById('myCity');
const generateBtn = document.getElementById('generateBtn');
const mobileGenerateBtn = document.getElementById('mobileGenerateBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const regenBtn = document.getElementById('regenBtn');
const waBtn = document.getElementById('waBtn');
const mailBtn = document.getElementById('mailBtn');

const initialThemeDark =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

html.setAttribute('data-theme', initialThemeDark ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  html.setAttribute(
    'data-theme',
    html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
});

situations.forEach((btn) =>
  btn.addEventListener('click', () => {
    situations.forEach((x) => x.classList.remove('active'));
    btn.classList.add('active');
    metaSituation.textContent = btn.dataset.type;
  })
);

tradePills.forEach((btn) =>
  btn.addEventListener('click', () => {
    tradePills.forEach((x) => x.classList.remove('active'));
    btn.classList.add('active');
    metaTrade.textContent = btn.textContent.trim();
  })
);

channel.addEventListener('change', () => {
  metaChannel.textContent = channel.value;
});

function buildText(variant = 0) {
  const situation =
    document.querySelector('.situation.active')?.dataset.type || 'Domluvit termín';
  const trade =
    document.querySelector('.trade-pill.active')?.textContent.trim() || 'Instalatér';
  const name = clientName.value.trim() || 'pane Nováku';
  const thing = clientThing.value.trim() || 'vaši zakázku';
  const desc =
    jobDesc.value.trim() || 'ozývám se k vaší poptávce a posílám stručné shrnutí.';
  const toneValue = tone.value;
  const output = channel.value;
  const signer = myName.value.trim();
  const company = myCompany.value.trim();
  const phone = myPhone.value.trim();
  const city = myCity.value.trim();

  const openings = {
    'Domluvit termín': [
      `Dobrý den ${name},\n\nozývám se kvůli ${thing}.`,
      `Dobrý den ${name},\n\nděkuji za zprávu ohledně ${thing}.`
    ],
    'Poslat nabídku': [
      `Dobrý den ${name},\n\nposílám orientační nabídku k ${thing}.`,
      `Dobrý den ${name},\n\nv návaznosti na domluvu posílám stručnou nabídku k ${thing}.`
    ],
    'Upřesnit zakázku': [
      `Dobrý den ${name},\n\nabych mohl přesně navrhnout další postup k ${thing}, potřebuju ještě upřesnit pár detailů.`,
      `Dobrý den ${name},\n\nk ${thing} si ještě potřebuju potvrdit několik věcí, ať je to bez zbytečných nedorozumění.`
    ],
    'Připomenout platbu': [
      `Dobrý den ${name},\n\npřipomínám platbu k ${thing}.`,
      `Dobrý den ${name},\n\njen se připomínám ohledně úhrady za ${thing}.`
    ]
  };

  let toneSentence = '';
  if (toneValue === 'Více profesionální') {
    toneSentence = '\n\nText je formulovaný věcněji a profesionálněji.';
  } else if (toneValue === 'Více přátelský') {
    toneSentence = '\n\nTón je přirozený a trochu uvolněnější.';
  }

  const bodyCore = {
    'Domluvit termín': `${desc}\n\nMůžu nabídnout termín podle domluvy. Jakmile mi dáte vědět, rezervuji konkrétní čas.${toneSentence}`,
    'Poslat nabídku': `${desc}\n\nPokud vám bude nabídka vyhovovat, můžeme rovnou potvrdit termín nebo upřesnit detaily.${toneSentence}`,
    'Upřesnit zakázku': `${desc}\n\nJakmile budu mít upřesněné informace, pošlu vám přesnější cenu i postup.${toneSentence}`,
    'Připomenout platbu': `${desc}\n\nJakmile bude platba uhrazená, prosím o krátké potvrzení. Zakázku tím uzavřeme.${toneSentence}`
  };

  const closingVariants = [
    'Děkuji a přeji hezký den,',
    'Díky a budu čekat na potvrzení,'
  ];

  const signLines = [];
  if (signer) signLines.push(signer);
  if (company) signLines.push(company);
  if (city) signLines.push(city);
  if (phone) signLines.push(phone);

  const signatureBlock = signLines.length ? signLines.join('\n') : '';

  const baseText = [
    openings[situation][variant % openings[situation].length],
    bodyCore[situation],
    closingVariants[variant % closingVariants.length],
    signatureBlock
  ]
    .filter(Boolean)
    .join('\n\n');

  if (output === 'PDF nabídka / faktura') {
    const pdfIntro = openings['Poslat nabídku'][variant % 2];
    const pdfBody = `\n\nPřipravil jsem pro vás podklady k ${thing}. Ve finální verzi z toho Fachbot vytvoří čistou PDF nabídku s položkami, cenou a kontakty.\n\n${closingVariants[variant % 2]}`;
    const pdfText = [pdfIntro + pdfBody, signatureBlock]
      .filter(Boolean)
      .join('\n\n');
    resultBox.textContent = pdfText;
  } else {
    resultBox.textContent = baseText;
  }
}

generateBtn.addEventListener('click', () => buildText(0));
mobileGenerateBtn.addEventListener('click', () => buildText(0));
regenBtn.addEventListener('click', () => buildText(1));

resetBtn.addEventListener('click', () => {
  [
    jobDesc,
    clientName,
    clientThing,
    clientPhone,
    clientEmail,
    myName,
    myCompany,
    myPhone,
    myCity
  ].forEach((el) => {
    el.value = '';
  });

  tone.selectedIndex = 0;
  channel.selectedIndex = 0;
  metaChannel.textContent = channel.value;

  resultBox.textContent = `Dobrý den pane Nováku,\n\nozývám se k vaší poptávce. Mohl bych vám nabídnout termín v úterý odpoledne nebo ve středu dopoledne.\n\nPokud vám bude jeden z termínů sedět, rovnou ho potvrdíme. Když budete chtít, pošlu i stručnou cenovou nabídku.\n\nDěkuji,`;
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultBox.textContent);
    copyBtn.textContent = 'Zkopírováno';
    setTimeout(() => {
      copyBtn.textContent = 'Kopírovat';
    }, 1200);
  } catch (e) {
    copyBtn.textContent = 'Nelze kopírovat';
    setTimeout(() => {
      copyBtn.textContent = 'Kopírovat';
    }, 1200);
  }
});

waBtn.addEventListener('click', () => {
  const phone = clientPhone.value.trim();
  const text = encodeURIComponent(resultBox.textContent);

  if (!phone) {
    clientPhone.focus();
    clientPhone.placeholder = 'Doplň telefon pro WhatsApp';
    clientPhone.classList.add('field-error');
    setTimeout(() => clientPhone.classList.remove('field-error'), 1500);
    return;
  }

  const cleaned = phone.replace(/\s+/g, '');
  window.open(`https://wa.me/${cleaned}?text=${text}`, '_blank', 'noopener,noreferrer');
});

mailBtn.addEventListener('click', () => {
  const mail = clientEmail.value.trim();
  const subject = encodeURIComponent(metaSituation.textContent);
  const body = encodeURIComponent(resultBox.textContent);
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
});

// Show more trades
const showMoreBtn = document.getElementById('showMoreTrades');
const tradeGridExtra = document.getElementById('tradeGridExtra');
if (showMoreBtn && tradeGridExtra) {
  showMoreBtn.addEventListener('click', () => {
    tradeGridExtra.classList.toggle('hidden');
    showMoreBtn.textContent = tradeGridExtra.classList.contains('hidden')
      ? '+ Zobrazit více profesí'
      : '− Skrýt';
    // Make extra pills selectable
    tradeGridExtra.querySelectorAll('.trade-pill').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.trade-pill').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        if (metaTrade) metaTrade.textContent = btn.textContent.trim();
      })
    );
  });
}
