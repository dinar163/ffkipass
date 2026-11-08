/* ============================================================
   Din2link — Script utama website publik
   Bergantung pada: js/data.js (DIN2LINK_DEFAULTS, din2linkGetConfig)
   ============================================================ */

(function () {
  'use strict';

  const CFG = din2linkGetConfig();

  /* ---------- Util ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  const getPath = (obj, path) =>
    path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);

  /* ============================================================
     1. TERAPKAN KONFIG KE ELEMEN BERTANDA data-cfg
     ============================================================ */
  function applyConfigText() {
    $$('[data-cfg]').forEach((el) => {
      const val = getPath(CFG, el.dataset.cfg);
      if (typeof val === 'string' && val.length) el.textContent = val;
    });
  }

  /* ============================================================
     2. HEADER: efek scroll + menu mobile
     ============================================================ */
  function initHeader() {
    const header = $('#site-header');
    const onScroll = () =>
      header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = $('#burger');
    const mnav = $('#mobile-nav');
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      burger.classList.toggle('x', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', mnav).forEach((a) =>
      a.addEventListener('click', () => {
        mnav.classList.remove('open');
        burger.classList.remove('x');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ============================================================
     3. RENDER TESTIMONI (dari config)
     ============================================================ */
  const STAR_SVG =
    '<svg viewBox="0 0 20 20"><path d="M10 15l-5.9 3.1 1.1-6.5L.5 6.9l6.6-1L10 0l2.9 5.9 6.6 1-4.7 4.7 1.1 6.5z"/></svg>';

  function renderTestimonials() {
    const grid = $('#testimonial-grid');
    if (!grid) return;

    grid.innerHTML = CFG.testimonials
      .map((t) => {
        const initial = esc((t.name || '?').charAt(0).toUpperCase());
        return `
        <article class="tcard reveal ${t.featured ? 'feat' : ''}">
          <div class="tuser">
            <div class="ava" style="background:${esc(t.gradient || 'linear-gradient(135deg,#136cfa,#7c3aed)')}">${initial}</div>
            <div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>
          </div>
          <div class="stars" aria-label="5 dari 5 bintang">${STAR_SVG.repeat(5)}</div>
          <p>&ldquo;${esc(t.text)}&rdquo;</p>
        </article>`;
      })
      .join('');
  }

  /* ============================================================
     4. RENDER FITUR (dari config) — ikon berbasis nama
     ============================================================ */
  const ICONS = {
    chart:
      '<svg viewBox="0 0 24 24"><path d="M3 17l5-6 4 3 5-7 4 4"/><path d="M3 21h18"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.1-.9L3 21l1.9-4.7A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>',
    levels:
      '<svg viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    bolt:
      '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>'
  };

  function renderFeatures() {
    const grid = $('#feature-grid');
    if (!grid) return;

    grid.innerHTML = CFG.features
      .map(
        (f) => `
        <div class="fcard reveal">
          <div class="fico">${ICONS[f.icon] || ICONS.bolt}</div>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.desc)}</p>
        </div>`
      )
      .join('');
  }

  /* ============================================================
     5. RENDER FAQ (dari config)
     ============================================================ */
  function renderFaq() {
    const list = $('#faq-list');
    if (!list) return;

    list.innerHTML = CFG.faq
      .map(
        (item, i) => `
        <details class="q reveal" ${i === 0 ? 'open' : ''}>
          <summary>${esc(item.q)}</summary>
          <p>${esc(item.a)}</p>
        </details>`
      )
      .join('');
  }

  /* ============================================================
     6. MARQUEE METODE PEMBAYARAN
     ============================================================ */
  function payCard(p) {
    const el = document.createElement('div');
    el.className = 'pay-card';
    el.innerHTML = `
      <div class="pay-logo" style="background:${esc(p.bg)}">${esc(p.short)}</div>
      <span>${esc(p.name)}</span>`;
    return el;
  }

  function buildTrack(id, list) {
    const track = document.getElementById(id);
    if (!track) return;
    const frag = document.createDocumentFragment();
    // duplikasi 2x agar animasi translateX(-50%) berjalan mulus
    [...list, ...list].forEach((p) => frag.appendChild(payCard(p)));
    track.appendChild(frag);
  }

  function initMarquee() {
    buildTrack('track-a', CFG.payments);
    buildTrack('track-b', [...CFG.payments].reverse());
  }

  /* ============================================================
     7. REVEAL ON SCROLL (IntersectionObserver)
     ============================================================ */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          // stagger berdasarkan urutan di parent
          const idx = [...(el.parentElement?.children || [])].indexOf(el);
          el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    $$('.reveal').forEach((el) => io.observe(el));
  }

  /* ============================================================
     8. ANIMASI COUNTER PENDAPATAN (mockup HP)
     ============================================================ */
  function initCounter() {
    const el = $('#counter');
    if (!el) return;
    const target = Number(el.dataset.target || 0);
    const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          // easing easeOutCubic
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = fmt(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
  }

  /* ============================================================
     9. VIDEO PLACEHOLDER
     ============================================================ */
  function initVideo() {
    $$('.vthumb').forEach((v) => {
      const play = () => {
        const cap = $('.vcap', v);
        if (cap)
          cap.textContent =
            'Video demo akan diputar di sini — hubungkan ke YouTube atau file MP4 kamu.';
        v.style.cursor = 'default';
      };
      v.addEventListener('click', play);
      v.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          play();
        }
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    applyConfigText();
    renderTestimonials();
    renderFeatures();
    renderFaq();
    initHeader();
    initMarquee();
    initReveal();
    initCounter();
    initVideo();
  });
})();
