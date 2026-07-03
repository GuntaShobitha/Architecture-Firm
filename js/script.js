/* ============================================================
   STACKLY — original scripts + cinematic motion layer
   Preserves all existing behavior; adds Sondaven-style motion.
   ============================================================ */

/* ---------- ORIGINAL BEHAVIOR (preserved) ---------- */

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Burger
const burger = document.querySelector('.nav-burger');
const links = document.querySelector('.nav-links');
if (burger && links) burger.addEventListener('click', () => links.classList.toggle('open'));

// FAQ
document.querySelectorAll('.qitem').forEach(q => {
  q.addEventListener('click', () => q.classList.toggle('open'));
});

// Active nav highlight
const path = location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});

// Login role toggle
const role = document.getElementById('role');
if (role) {
  const form = document.getElementById('authform');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const r = role.value;
    if (!r) { alert('Please select a role'); return; }
    location.href = r === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
}

// Contact form
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    cform.innerHTML = '<div class="full" style="text-align:center;padding:40px"><h3>Thank you.</h3><p>We will get back to you within 24 hours.</p></div>';
  });
}

// SECTION VIDEO BACKGROUNDS
(function () {
  const pools = {
    'home.html':     ['architecture','studio','city','blueprint','interior','texture','studio','city','architecture','texture'],
    'about.html':    ['studio','texture','architecture','studio','city','blueprint','interior','texture'],
    'services.html': ['blueprint','architecture','interior','city','texture','studio','blueprint','architecture','interior'],
    'blog.html':     ['interior','studio','texture','architecture','blueprint','studio','interior'],
    'contact.html':  ['interior','studio','city','texture','blueprint','architecture']
  };
  const urls = {
    'architecture': '/__l5e/assets-v1/c9843ada-fbc6-45ee-b505-32e3b879ffef/architecture.mp4',
    'studio':       '/__l5e/assets-v1/45e3e545-0a78-4224-8962-811ee94e59d9/studio.mp4',
    'blueprint':    '/__l5e/assets-v1/1e731245-8051-4d65-a806-dc305b44dad4/blueprint.mp4',
    'interior':     '/__l5e/assets-v1/9798b0e0-ab7e-4149-b79c-73d93bfa15ce/interior.mp4',
    'city':         '/__l5e/assets-v1/200c2f37-af9f-422f-9d67-b32b3a7c06ef/city.mp4',
    'texture':      '/__l5e/assets-v1/0a63bf97-ee2d-4860-8bd0-1fd2e0ff7a67/texture.mp4'
  };
  const page = (location.pathname.split('/').pop() || 'home.html');
  const pool = pools[page]; if (!pool) return;
  const sections = document.querySelectorAll('section');
  sections.forEach((s, i) => {
    if (s.classList.contains('hero')) return;
    if (s.querySelector('.sec-video')) return;
    const key = pool[i % pool.length];
    const wrap = document.createElement('div');
    wrap.className = 'sec-video';
    wrap.innerHTML = `<video autoplay muted loop playsinline preload="metadata"><source src="${urls[key]}" type="video/mp4"></video>`;
    s.prepend(wrap);
    if (getComputedStyle(s).position === 'static') s.style.position = 'relative';
  });
})();

/* ---------- CINEMATIC MOTION LAYER ---------- */

(function cinematic() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  /* Reveal (existing .reveal) */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* Scroll progress */
  const progress = document.createElement('div');
  progress.className = 'cine-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
    progress.style.width = Math.max(0, Math.min(1, pct)) * 100 + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Loader */
  const loader = document.createElement('div');
  loader.className = 'cine-loader';
  loader.innerHTML = `
    <div class="cine-loader-mark">${'STACKLY'.split('').map(c => `<span>${c}</span>`).join('')}</div>
    <div class="cine-loader-bar"></div>`;
  document.body.appendChild(loader);
  const hideLoader = () => setTimeout(() => loader.classList.add('hide'), 900);
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);
  setTimeout(() => loader.classList.add('hide'), 2200); // safety

  /* Page transition curtain */
  const curtain = document.createElement('div');
  curtain.className = 'cine-curtain';
  document.body.appendChild(curtain);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    // only internal .html
    if (!/\.html($|\?|#)/.test(href) && href !== '/') return;
    e.preventDefault();
    curtain.classList.add('in');
    setTimeout(() => { location.href = a.href; }, 620);
  });
  window.addEventListener('pageshow', () => { curtain.classList.remove('in'); });

  /* Custom cursor (desktop only) */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && innerWidth > 900) {
    document.body.classList.add('cine-cursor-on');
    const dot = document.createElement('div'); dot.className = 'cine-cursor';
    const ring = document.createElement('div'); ring.className = 'cine-cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    const raf = () => { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(raf); };
    raf();
    const hoverables = 'a, button, .btn, .project, .bcard, .member, .step, .row, .kpi, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) { dot.classList.add('hover'); ring.classList.add('hover'); }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) { dot.classList.remove('hover'); ring.classList.remove('hover'); }
    });
  }

  /* Split-text on headlines (skip hero h1 — already animated) */
  const splitTargets = document.querySelectorAll('.section-head h2, .testi h2, .cta h2, .auth-form h2');
  splitTargets.forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w, i) => `<span class="cine-split" style="--d:${i * 60}ms"><span class="cine-split-inner">${w}&nbsp;</span></span>`).join('');
    const spans = h.querySelectorAll('.cine-split');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { spans.forEach(s => s.classList.add('in')); io.disconnect(); } });
    }, { threshold: .3 });
    io.observe(h);
  });

  /* Image mask reveal for large imagery */
  const maskTargets = document.querySelectorAll('.split .img, .project, .member, .bcard .thumb, .feature-blog .thumb');
  maskTargets.forEach(el => {
    el.classList.add('cine-mask');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: .15 });
    io.observe(el);
  });

  /* Section fade-in (subtle, wraps every <section> except hero) */
  document.querySelectorAll('section:not(.hero)').forEach(s => {
    s.classList.add('cine-section');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { s.classList.add('in'); io.unobserve(s); } });
    }, { threshold: .08 });
    io.observe(s);
  });

  /* Animated dividers between sections */
  document.querySelectorAll('section').forEach((s, i) => {
    if (i === 0) return;
    const d = document.createElement('div');
    d.className = 'cine-divider';
    s.parentNode.insertBefore(d, s);
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { d.classList.add('in'); io.disconnect(); } });
    }, { threshold: .5 });
    io.observe(d);
  });

  /* Animated stat counters */
  document.querySelectorAll('.stat h3, .kpi h3').forEach(el => {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+)([^\d]*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || '';
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const dur = 1400; const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .4 });
    io.observe(el);
  });

  /* Table row stagger */
  document.querySelectorAll('.rows').forEach(r => {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { r.classList.add('in'); io.disconnect(); } });
    }, { threshold: .2 });
    io.observe(r);
  });

  /* Magnetic buttons + ripple */
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    b.addEventListener('click', (e) => {
      const r = b.getBoundingClientRect();
      const rip = document.createElement('span');
      rip.className = 'cine-ripple';
      rip.style.left = (e.clientX - r.left) + 'px';
      rip.style.top = (e.clientY - r.top) + 'px';
      rip.style.width = rip.style.height = Math.max(r.width, r.height) + 'px';
      b.appendChild(rip);
      setTimeout(() => rip.remove(), 800);
    });
  });

  /* Hero parallax + mouse-follow depth */
  const hero = document.querySelector('.hero');
  if (hero) {
    const bg = hero.querySelector('.hero-bg');
    const inner = hero.querySelector('.hero-inner');
    addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, innerHeight);
      if (bg) bg.style.transform = `translateY(${y * .25}px)`;
      if (inner) inner.style.transform = `translateY(${y * .08}px)`;
    }, { passive: true });
    hero.addEventListener('mousemove', (e) => {
      const cx = (e.clientX / innerWidth - .5);
      const cy = (e.clientY / innerHeight - .5);
      if (bg) bg.style.transform = `translate(${cx * -14}px, ${cy * -14}px) scale(1.08)`;
    });

    /* Blueprint SVG behind hero */
    const bp = document.createElement('div');
    bp.className = 'cine-blueprint';
    bp.innerHTML = `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect x="120" y="140" width="520" height="620"/>
      <rect x="200" y="220" width="360" height="180"/>
      <rect x="200" y="440" width="170" height="240"/>
      <rect x="390" y="440" width="170" height="240"/>
      <line x1="120" y1="450" x2="640" y2="450"/>
      <line x1="380" y1="140" x2="380" y2="760"/>
      <circle cx="900" cy="450" r="180"/>
      <circle cx="900" cy="450" r="120"/>
      <line x1="720" y1="450" x2="1080" y2="450"/>
      <line x1="900" y1="270" x2="900" y2="630"/>
      <rect x="1140" y="200" width="340" height="500"/>
      <line x1="1140" y1="350" x2="1480" y2="350"/>
      <line x1="1140" y1="500" x2="1480" y2="500"/>
      <line x1="1310" y1="200" x2="1310" y2="700"/>
      <path d="M60 830 L1540 830"/>
      <path d="M60 70 L1540 70"/>
    </svg>`;
    hero.insertBefore(bp, hero.firstChild);

    /* Floating particles */
    const parts = document.createElement('div');
    parts.className = 'cine-particles';
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('span');
      p.className = 'cine-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-20px';
      p.style.animationDuration = (14 + Math.random() * 18) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      p.style.opacity = .3 + Math.random() * .5;
      parts.appendChild(p);
    }
    hero.appendChild(parts);
  }

  /* Parallax on any element opting in */
  const parallaxEls = document.querySelectorAll('[data-parallax], .split .img img, .cta');
  addEventListener('scroll', () => {
    parallaxEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const speed = parseFloat(el.dataset.parallax || '.08');
      const offset = (r.top - innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }, { passive: true });

  /* Tilt on project & dashboard cards */
  document.querySelectorAll('.project, .kpi, .step, .cinfo .card').forEach(c => {
    c.classList.add('cine-tilt');
    c.addEventListener('mousemove', (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
