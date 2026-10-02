
// ── 1. CANVAS ESPACIAL INTERATIVO ────────────────────────────────
const canvas = document.getElementById('stars-canvas');
const ctx    = canvas.getContext('2d');

let W, H, mouse = { x: -9999, y: -9999 };
let stars = [], nebulas = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initStars(); });

// Cores das estrelas (paleta da imagem)
const STAR_COLORS = ['#ffffff', '#e8d8ff', '#cc88ff', '#00d4ff', '#b0e0ff'];

// ── Inicializa estrelas
function initStars() {
  stars = [];
  const count = Math.floor((W * H) / 3500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:       Math.random() * W,
      y:       Math.random() * H,
      r:       Math.random() * 1.8 + 0.2,
      alpha:   Math.random() * 0.7 + 0.3,
      speed:   Math.random() * 0.3 + 0.05,
      depth:   Math.random() * 3 + 1,
      twinkle: Math.random() * Math.PI * 2,
      color:   STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    });
  }
  nebulas = [
    { x: W * .15, y: H * .25, r: 220, color: 'rgba(61,15,122,' },
    { x: W * .8,  y: H * .15, r: 180, color: 'rgba(0,100,200,' },
    { x: W * .5,  y: H * .6,  r: 160, color: 'rgba(80,0,160,'  },
  ];
}
initStars();

// ── Partículas de clique
let particles = [];
function spawnParticles(x, y) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * .3;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x, y,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      r:     Math.random() * 2.5 + 1,
      alpha: 1,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    });
  }
}

// ── Shooting stars
let shooters = [];
function spawnShooter() {
  shooters.push({
    x:     Math.random() * W * .7,
    y:     Math.random() * H * .4,
    len:   Math.random() * 140 + 80,
    speed: Math.random() * 6 + 4,
    angle: (Math.random() * 20 + 25) * Math.PI / 180,
    alpha: 0,
    phase: 'in',
    hold:  0,
  });
}
setInterval(spawnShooter, 2800);

// ── Loop principal
function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, W, H);

  // nébulas
  nebulas.forEach(n => {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grad.addColorStop(0,   n.color + '.18)');
    grad.addColorStop(0.5, n.color + '.07)');
    grad.addColorStop(1,   n.color + '0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // estrelas com parallax
  const mx = (mouse.x / W - .5) * 2;
  const my = (mouse.y / H - .5) * 2;

  stars.forEach(s => {
    const px = s.x + mx * s.depth * 8;
    const py = s.y + my * s.depth * 8;
    s.twinkle += 0.025;
    const a     = s.alpha * (.7 + Math.sin(s.twinkle) * .3);
    const dx    = mouse.x - px, dy = mouse.y - py;
    const dist  = Math.sqrt(dx*dx + dy*dy);
    const boost = dist < 120 ? 1 - dist / 120 : 0;

    ctx.beginPath();
    ctx.arc(px, py, s.r + boost * 1.5, 0, Math.PI * 2);
    ctx.fillStyle   = s.color;
    ctx.globalAlpha = Math.min(1, a + boost * .6);
    ctx.fill();
  });

  // constelação próxima ao cursor
  ctx.globalAlpha = 1;
  const near = stars.filter(s => {
    const px = s.x + mx * s.depth * 8;
    const py = s.y + my * s.depth * 8;
    return Math.hypot(mouse.x - px, mouse.y - py) < 160;
  }).slice(0, 6);

  for (let i = 0; i < near.length; i++) {
    for (let j = i + 1; j < near.length; j++) {
      const ax = near[i].x + mx * near[i].depth * 8;
      const ay = near[i].y + my * near[i].depth * 8;
      const bx = near[j].x + mx * near[j].depth * 8;
      const by = near[j].y + my * near[j].depth * 8;
      const d  = Math.hypot(ax - bx, ay - by);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(204,136,255,${.25 * (1 - d/120)})`;
        ctx.lineWidth   = .6;
        ctx.stroke();
      }
    }
  }

  // shooting stars
  shooters = shooters.filter(s => !(s.phase === 'out' && s.alpha <= 0));
  shooters.forEach(s => {
    if (s.phase === 'in')   { s.alpha += .08; if (s.alpha >= 1)  { s.phase = 'hold'; s.hold = 12; } }
    if (s.phase === 'hold') { s.hold--;        if (s.hold  <= 0)  { s.phase = 'out';              } }
    if (s.phase === 'out')  { s.alpha -= .05; }
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    const ex = s.x - Math.cos(s.angle) * s.len;
    const ey = s.y - Math.sin(s.angle) * s.len;
    const g  = ctx.createLinearGradient(ex, ey, s.x, s.y);
    g.addColorStop(0, `rgba(255,255,255,0)`);
    g.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.globalAlpha = s.alpha; ctx.stroke();
    ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });

  // partículas
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.alpha > 0.02);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.04; p.vx *= 0.97; p.alpha -= 0.025;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.alpha); ctx.fill();
  });

  ctx.globalAlpha = 1;
}
draw();

// ── Rastrear mouse
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('touchmove', e => {
  mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', () => { mouse.x = -9999; mouse.y = -9999; });

// ── Clique = explosão
window.addEventListener('click', e => {
  if (e.target.closest('a, button, input, textarea')) return;
  spawnParticles(e.clientX, e.clientY);
});

// ═══════════════════════════════════════════════════════════════
// 2. TERMINAL ANIMADO
// ═══════════════════════════════════════════════════════════════
const termBody = document.getElementById('terminal-body');

// Linhas do "código" que serão digitadas
// Cada item: { text, class, delay (ms antes de começar esta linha) }
const TERM_LINES = [
  { text: '$ python portfolio.py',           cls: 'prompt',   pause: 400  },
  { text: '',                                cls: '',         pause: 200  },
  { text: '# carregando módulos...',         cls: 'comment',  pause: 0    },
  { text: 'import flask',                    cls: 'keyword',  pause: 120  },
  { text: 'import skills',                   cls: 'keyword',  pause: 100  },
  { text: 'import passion',                  cls: 'keyword',  pause: 100  },
  { text: '',                                cls: '',         pause: 200  },
  { text: 'class Developer:',               cls: 'keyword',  pause: 180  },
  { text: '  name    = "Luís Felipe"',       cls: 'string',   pause: 120  },
  { text: '  role    = "Full Stack Dev"',    cls: 'string',   pause: 120  },
  { text: '  stack   = ["Python","Java",',   cls: 'cyan',     pause: 120  },
  { text: '             "Flask","HTML"]',    cls: 'cyan',     pause: 80   },
  { text: '',                                cls: '',         pause: 160  },
  { text: '  def solve(self, problem):',     cls: 'func',     pause: 180  },
  { text: '    coffee  = True',              cls: 'cyan',     pause: 100  },
  { text: '    music   = True',              cls: 'cyan',     pause: 100  },
  { text: '    return coffee + music',       cls: 'output',   pause: 100  },
  { text: '',                                cls: '',         pause: 160  },
  { text: '  def contact(self):',            cls: 'func',     pause: 160  },
  { text: '    print("Bora codar! 🚀")',     cls: 'string',   pause: 120  },
  { text: '',                                cls: '',         pause: 300  },
  { text: '> Inicializando portfólio...',    cls: 'output',   pause: 0    },
  { text: '> Skills carregadas: OK ✓',       cls: 'output',   pause: 300  },
  { text: '> Projetos carregados: OK ✓',     cls: 'output',   pause: 300  },
  { text: '> Servidor rodando em :5000 ✓',   cls: 'output',   pause: 300  },
];

// mapeamento de classe → classe CSS do terminal
const CLS_MAP = {
  prompt:  't-prompt',
  comment: 't-comment',
  keyword: 't-keyword',
  func:    't-func',
  string:  't-string',
  cyan:    't-cyan',
  output:  't-output',
  '':      '',
};

let termLineIdx = 0;
let termCharIdx = 0;
let termCursor  = null;

function createCursor() {
  const c = document.createElement('span');
  c.className = 't-cursor';
  return c;
}

function termNext() {
  if (!termBody || termLineIdx >= TERM_LINES.length) {
    // reinicia após pausa longa
    setTimeout(() => {
      termBody.innerHTML = '';
      termLineIdx = 0;
      termCharIdx = 0;
      termNext();
    }, 3500);
    return;
  }

  const item = TERM_LINES[termLineIdx];

  // linha vazia — só adiciona br
  if (item.text === '') {
    const br = document.createElement('span');
    br.className = 't-line';
    br.innerHTML = '&nbsp;';
    termBody.appendChild(br);
    termBody.scrollTop = termBody.scrollHeight;
    termLineIdx++;
    termCharIdx = 0;
    setTimeout(termNext, item.pause || 80);
    return;
  }

  // cria linha se ainda não existe
  let line = termBody.querySelector('.t-line-current');
  if (!line) {
    line = document.createElement('span');
    line.className = 't-line t-line-current ' + (CLS_MAP[item.cls] || '');
    termBody.appendChild(line);
  }

  // remove cursor antigo
  if (termCursor && termCursor.parentNode) termCursor.parentNode.removeChild(termCursor);

  // digita próximo caractere
  if (termCharIdx < item.text.length) {
    line.textContent = item.text.slice(0, termCharIdx + 1);
    line.appendChild(createCursor());
    termCursor = line.lastChild;
    termBody.scrollTop = termBody.scrollHeight;
    termCharIdx++;
    // velocidade de digitação: mais rápido em linhas longas
    const spd = item.text.length > 30 ? 28 : 45;
    setTimeout(termNext, spd + Math.random() * 20);
  } else {
    // linha completa — remove classe de "current", avança
    line.classList.remove('t-line-current');
    // cursor vai para próxima linha
    termLineIdx++;
    termCharIdx = 0;
    setTimeout(termNext, item.pause || 120);
  }
}

// inicia com pequeno delay para a página carregar
setTimeout(termNext, 800);

// Atualiza velocidade do fundo com o mouse (mantém parallax)
window.addEventListener('mousemove', e => {
  // apenas registra — o parallax já está no listener de cima
});



// ── 3. TYPING EFFECT ─────────────────────────────────────────────
const titles = ['DESENVOLVEDOR', 'PYTHON DEV', 'JAVA DEV', 'FULL STACK', 'CRIADOR DE SOLUÇÕES'];
let ti = 0, ci = 0, deleting = false;
const typEl = document.getElementById('typing-text');
function type() {
  if (!typEl) return;
  const cur = titles[ti];
  typEl.textContent = deleting ? cur.slice(0, --ci) : cur.slice(0, ++ci);
  if (!deleting && ci === cur.length)  { setTimeout(() => deleting = true, 2000); }
  else if (deleting && ci === 0)       { deleting = false; ti = (ti + 1) % titles.length; }
  setTimeout(type, deleting ? 55 : 100);
}
type();

// ── 4. SKILL BARS ─────────────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.level + '%');
  });
}, { threshold: 0.25 });
document.querySelectorAll('.skills-grid').forEach(g => skillObs.observe(g));

// ── 5. NAVBAR SCROLL ──────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 24px rgba(0,0,0,.8)' : 'none';
});

// ── 6. HAMBÚRGUER ─────────────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', () =>
  document.querySelector('.nav-links').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () =>
    document.querySelector('.nav-links').classList.remove('open')));

// ── 7. FORMULÁRIO ─────────────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  msg.textContent = '✅ Mensagem enviada com sucesso!';
  this.reset();
  setTimeout(() => msg.textContent = '', 4000);
});

// ── 8. BADGE JAVA ─────────────────────────────────────────────────
fetch('/api/java-info').then(r => r.json()).then(data => {
  const badge = document.getElementById('java-badge');
  if (!badge) return;
  badge.style.display = 'block';
  badge.innerHTML = data.source === 'java-component'
    ? `☕ <strong>Java ativo!</strong> v${data.javaVersion} — ${data.generatedAt}`
    : `☕ ${data.message}`;
}).catch(() => {});
