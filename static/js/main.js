// ── Menu mobile ────────────────────────────────────────────────────
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');

toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

menu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  })
);

// ── Navbar sólida ao rolar ────────────────────────────────────────
const navbar = document.getElementById('navbar');

// ── Destaca a seção atual no menu ─────────────────────────────────
const navMap = new Map(
  [...document.querySelectorAll('.nav-links a[href^="#"]')]
    .map(a => [a.getAttribute('href').slice(1), a])
);
const sections = [...navMap.keys()]
  .map(id => document.getElementById(id))
  .filter(Boolean);

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
  const line = window.innerHeight * 0.4;
  let current = sections[0];
  sections.forEach(s => { if (s.getBoundingClientRect().top <= line) current = s; });
  if (atBottom) current = sections[sections.length - 1];
  navMap.forEach((a, id) => a.classList.toggle('active', id === current?.id));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
