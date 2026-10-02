// Add confirmed personal links here. Empty values are intentionally not displayed.
const profile = { email: 'gkola67@gmail.com', phone: '08112324547', linkedin: '' };

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

const nextTools = new Set(['PyTorch', 'Hugging Face', 'FastAPI', 'Docker']);
document.querySelectorAll('.skill-card').forEach(card => {
  const suggested = nextTools.has(card.querySelector('h3').textContent);
  const badge = document.createElement('span');
  badge.className = 'experience-badge' + (suggested ? ' to-explore' : '');
  badge.textContent = suggested ? 'TO EXPLORE' : 'PROJECT USE';
  card.append(badge);
});

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
if (profile.phone) addContact('GIVE ME A CALL', profile.phone, 'tel:+234' + profile.phone.slice(1));
if (profile.email) document.querySelector('.contact-caption').textContent = 'Have an idea in mind? Send me an email, give me a call, or explore what I’m building on GitHub.';
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
