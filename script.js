// Add confirmed personal links here. Empty values are intentionally not displayed.
const profile = { email: 'gkola67@gmail.com', linkedin: '' };

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    document.querySelectorAll('.skill-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.querySelector('.skill-status').textContent = `Showing ${count} ${filter === 'all' ? '' : button.textContent.trim() + ' '}skills.`;
  });
});

const repository = 'https://github.com/kolawoleisaiah325/health-programme-analytics';
const projectDetails = {
  health: {
    label: 'DATA & MACHINE LEARNING / PORTFOLIO DEMO',
    title: 'Health Programme Analytics',
    description: 'A reproducible demonstration of a health programme analytics workflow, using six fictional facilities and 36 months of synthetic source data.',
    points: ['Validates incoming reports and distinguishes missing, invalid, duplicate, and zero submissions.', 'Uses a PostgreSQL warehouse design and a Streamlit dashboard to explore facility performance.', 'Combines service-volume forecasting and evidence-checked reporting. This is a portfolio demonstration, with no patient data or claimed real-world programme impact.'],
    url: repository
  },
  forecast: {
    label: 'HEALTH ANALYTICS / FORECASTING MODULE',
    title: 'Beyond the baseline.',
    description: 'A forecasting module within Health Programme Analytics. It models delivered doses, rather than unique patients, vaccine demand, or health outcomes.',
    points: ['Compares seasonal naive, Ridge trend-and-seasonality, and Holt-Winters methods.', 'Trains on 2023–2024 and evaluates on complete months in 2025 using a time-based holdout.', 'Documents data assumptions and treats forecast bands as illustrative. The card chart is a design illustration, not model results.'],
    url: repository + '/blob/main/src/forecast_service_volume.py'
  },
  report: {
    label: 'HEALTH ANALYTICS / AI REPORTING MODULE',
    title: 'AI with a paper trail.',
    description: 'An AI-assisted reporting module within Health Programme Analytics that turns a structured evidence pack into a draft programme brief.',
    points: ['Supports a local Ollama model, with a deterministic fallback when the model is unavailable.', 'Checks source citations and reported numbers against the evidence pack.', 'Keeps outputs labelled as drafts for human review, with clear synthetic-data context.'],
    url: repository + '/blob/main/src/report_assistant.py'
  }
};
const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projectDetails[button.dataset.project];
  dialogTrigger = button;
  document.querySelector('#dialog-label').textContent = project.label;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  const points = document.querySelector('#dialog-points');
  points.replaceChildren(...project.points.map(point => { const li = document.createElement('li'); li.textContent = point; return li; }));
  document.querySelector('#dialog-link').href = project.url;
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); dialogTrigger?.focus(); });

const contactContainer = document.querySelector('#additional-contact');
function addContact(label, text, href) {
  const link = document.createElement('a');
  link.className = 'contact-link'; link.href = href;
  if (href.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  const content = document.createElement('span');
  const small = document.createElement('small'); small.textContent = label;
  content.append(small, document.createTextNode(text));
  const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
  link.append(content, arrow); contactContainer.append(link);
}
if (profile.email) addContact('EMAIL ME', profile.email, 'mailto:' + profile.email);
if (profile.email) document.querySelector('.contact-caption').textContent = 'Have an idea in mind? Send me an email, or explore what I’m building on GitHub.';
if (profile.linkedin) addContact('LET’S CONNECT', 'LinkedIn', profile.linkedin);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navigation.querySelectorAll('a').forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// Decorative network: no external libraries, requests, or tracking.
const canvas = document.querySelector('#neural-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let width = 0, height = 0, animationId = 0, isVisible = true;
const nodes = Array.from({length: 46}, (_, i) => {
  const angle = i * 2.39996;
  const radius = .24 + (i % 8) * .027;
  return { x: .5 + Math.cos(angle) * radius, y: .5 + Math.sin(angle) * radius, phase: i * .7, radius: i % 5 === 0 ? 2.5 : 1.5 };
});
function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#a34a3e12'; ctx.lineWidth = .6;
  for (let x = 20; x < width; x += 27) { ctx.beginPath(); ctx.moveTo(x, 45); ctx.lineTo(x, height - 45); ctx.stroke(); }
  for (let y = 45; y < height - 30; y += 27) { ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(width - 20, y); ctx.stroke(); }
  const points = nodes.map(n => ({x: n.x * width + Math.sin(time * .0002 + n.phase) * 5, y: n.y * height + Math.cos(time * .0002 + n.phase) * 5, node: n}));
  points.forEach((p, i) => {
    points.slice(i + 1).forEach(q => {
      const distance = Math.hypot(p.x - q.x, p.y - q.y);
      if (distance < width * .24) {
        ctx.strokeStyle = `rgba(225,100,79,${.24 * (1 - distance / (width * .24))})`;
        ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    });
    const glow = .5 + .3 * Math.sin(time * .001 + p.node.phase);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.node.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,117,95,${glow})`; ctx.fill();
    if (i % 5 === 0) { ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.strokeStyle = '#ed6e4c33'; ctx.stroke(); }
  });
  if (!reducedMotion.matches && !document.hidden && isVisible) animationId = requestAnimationFrame(draw);
}
function restart() { cancelAnimationFrame(animationId); draw(performance.now()); }
new ResizeObserver(() => {
  const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); restart();
}).observe(canvas);
new IntersectionObserver(entries => { isVisible = entries[0].isIntersecting; restart(); }).observe(canvas);
document.addEventListener('visibilitychange', restart);
reducedMotion.addEventListener('change', restart);
