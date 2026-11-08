/* ============================================================
   Din2link — Script admin panel
   Bergantung pada: js/data.js
   Menyimpan ke localStorage (DIN2LINK_STORE_KEY) sehingga
   index.html otomatis memakai data terbaru.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- State ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S = din2linkGetConfig();
  let view = 'dashboard';

  /* ---------- Util ---------- */
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  function setPath(o, p, v) {
    const ks = p.split('.');
    const last = ks.pop();
    const t = ks.reduce((a, k) => a[k], o);
    t[last] = v;
  }

  function save() {
    try {
      localStorage.setItem(DIN2LINK_STORE_KEY, JSON.stringify(S));
    } catch (e) { /* storage penuh / private mode */ }
    document.getElementById('saveState').textContent = 'Tersimpan';
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 1800);
  }

  /* ---------- Field builder ---------- */
  function input(label, path, opt) {
    opt = opt || {};
    const v = getPath(S, path) ?? '';
    if (opt.area) {
      return `<label class="fld"><span>${label}</span><textarea rows="${opt.rows || 3}" data-path="${path}">${esc(v)}</textarea></label>`;
    }
    if (opt.color) {
      return `<label class="fld"><span>${label}</span><input type="color" data-path="${path}" value="${esc(v)}"></label>`;
    }
    return `<label class="fld"><span>${label}</span><input type="text" data-path="${path}" value="${esc(v)}" placeholder="${opt.ph || ''}"></label>`;
  }

  /* ---------- Navigasi ---------- */
  const NAV = [
    ['dashboard', '📊', 'Ringkasan'],
    ['brand', '🏷️', 'Brand'],
    ['hero', '🚀', 'Hero / Beranda'],
    ['features', '✨', 'Fitur'],
    ['testimonials', '💬', 'Testimoni'],
    ['payments', '💳', 'Pembayaran'],
    ['faq', '❓', 'FAQ'],
    ['footer', '📄', 'Footer'],
    ['rename', '🔁', 'Ganti Nama Massal'],
    ['data', '💾', 'Data & Backup']
  ];

  const TITLES = {
    dashboard: ['Ringkasan', 'Statistik singkat konten situs'],
    brand: ['Brand', 'Nama, inisial, domain, dan URL dashboard'],
    hero: ['Hero / Beranda', 'Judul besar dan tombol di halaman depan'],
    features: ['Fitur', 'Kartu keunggulan di beranda'],
    testimonials: ['Testimoni', 'Ulasan pengguna'],
    payments: ['Metode Pembayaran', 'Logo & nama metode pembayaran'],
    faq: ['FAQ', 'Pertanyaan yang sering diajukan'],
    footer: ['Footer', 'Kontak dan hak cipta'],
    rename: ['Ganti Nama Massal', 'Cari & ganti teks di seluruh konten'],
    data: ['Data & Backup', 'Ekspor, impor, dan reset']
  };

  function renderNav() {
    document.getElementById('nav').innerHTML = NAV.map(
      ([k, i, l]) =>
        `<button data-nav="${k}" class="${view === k ? 'on' : ''}"><span class="i">${i}</span>${l}</button>`
    ).join('');
    document.getElementById('ttl').textContent = TITLES[view][0];
    document.getElementById('sub').textContent = TITLES[view][1];
    document.getElementById('sbName').textContent = S.brand.name;
    document.getElementById('sbMark').textContent =
      S.brand.initial || S.brand.name.charAt(0).toUpperCase();
  }

  /* ---------- Views ---------- */
  const ICON_OPTIONS = ['chart', 'chat', 'levels', 'lock', 'bolt', 'globe'];

  const views = {
    dashboard() {
      return `
      <div class="page-head"><h2>Selamat datang di ${esc(S.brand.name)} Admin</h2>
        <p>Ubah konten di menu kiri — buka <b>Lihat Situs</b> untuk melihat hasilnya.</p></div>
      <div class="stats">
        <div class="stat"><span>BRAND</span><strong>${esc(S.brand.name)}</strong></div>
        <div class="stat"><span>DOMAIN</span><strong>${esc(S.brand.domain)}</strong></div>
        <div class="stat"><span>FITUR</span><strong>${S.features.length}</strong></div>
        <div class="stat"><span>TESTIMONI</span><strong>${S.testimonials.length}</strong></div>
        <div class="stat"><span>PEMBAYARAN</span><strong>${S.payments.length}</strong></div>
        <div class="stat"><span>FAQ</span><strong>${S.faq.length}</strong></div>
      </div>
      <div class="tip">💡 Data disimpan di localStorage browser ini. Website utama (index.html) otomatis membaca data terbaru saat dimuat ulang.</div>`;
    },

    brand() {
      return `
      <div class="page-head"><h2>Identitas Brand</h2><p>Dipakai di header, footer, dan metadata.</p></div>
      <div class="card">
        <h3>Informasi utama</h3>
        <div class="grid2">
          ${input('Nama brand', 'brand.name')}
          ${input('Inisial logo', 'brand.initial')}
          ${input('Domain', 'brand.domain')}
          ${input('URL Dashboard', 'brand.dashboardUrl')}
          ${input('URL Daftar (signup)', 'brand.signupUrl')}
        </div>
      </div>`;
    },

    hero() {
      return `
      <div class="page-head"><h2>Bagian Hero</h2><p>Judul besar, angka CPM, dan tombol aksi.</p></div>
      <div class="card">
        <h3>Judul &amp; angka</h3>
        <div class="grid2">
          ${input('Badge kecil', 'hero.badge')}
          ${input('Baris judul 1', 'hero.title1')}
          ${input('Baris judul 2 (disorot)', 'hero.title2')}
          ${input('Nilai CPM', 'hero.cpm')}
          ${input('Lama pembayaran', 'hero.payout')}
        </div>
      </div>
      <div class="card">
        <h3>Tombol</h3>
        <div class="grid2">
          ${input('Tombol utama', 'hero.ctaPrimary')}
          ${input('Tombol kedua', 'hero.ctaSecondary')}
        </div>
      </div>`;
    },

    features() {
      return `
      <div class="page-head"><h2>Fitur</h2><p>Ikon tersedia: ${ICON_OPTIONS.join(', ')}.</p></div>
      <div class="card">
        <h3>Daftar fitur <em>${S.features.length} item</em></h3>
        ${S.features.map((f, i) => `
          <div class="item">
            <div class="item-head">
              <strong>${esc(f.title || 'Fitur ' + (i + 1))}</strong>
              <div class="row">
                <button class="btn mini ghost" data-action="up" data-list="features" data-i="${i}">↑</button>
                <button class="btn mini ghost" data-action="down" data-list="features" data-i="${i}">↓</button>
                <button class="btn mini danger" data-action="del" data-list="features" data-i="${i}">Hapus</button>
              </div>
            </div>
            <div class="item-body">
              <label class="fld"><span>Ikon</span>
                <select data-path="features.${i}.icon">
                  ${ICON_OPTIONS.map(ic => `<option value="${ic}" ${f.icon === ic ? 'selected' : ''}>${ic}</option>`).join('')}
                </select>
              </label>
              ${input('Judul', 'features.' + i + '.title')}
              <div class="full">${input('Deskripsi', 'features.' + i + '.desc', { area: true, rows: 2 })}</div>
            </div>
          </div>`).join('')}
        <button class="btn ghost" data-action="add" data-list="features">+ Tambah fitur</button>
      </div>`;
    },

    testimonials() {
      return `
      <div class="page-head"><h2>Testimoni</h2><p>Ulasan pengguna yang tampil di beranda.</p></div>
      <div class="card">
        <h3>Daftar testimoni <em>${S.testimonials.length} item</em></h3>
        ${S.testimonials.map((t, i) => `
          <div class="item">
            <div class="item-head">
              <strong>${esc(t.name || 'Pengguna ' + (i + 1))}${t.featured ? ' ⭐' : ''}</strong>
              <div class="row">
                <button class="btn mini ghost" data-action="feat" data-list="testimonials" data-i="${i}">${t.featured ? 'Unggulan ✓' : 'Jadikan unggulan'}</button>
                <button class="btn mini ghost" data-action="up" data-list="testimonials" data-i="${i}">↑</button>
                <button class="btn mini ghost" data-action="down" data-list="testimonials" data-i="${i}">↓</button>
                <button class="btn mini danger" data-action="del" data-list="testimonials" data-i="${i}">Hapus</button>
              </div>
            </div>
            <div class="item-body">
              ${input('Nama', 'testimonials.' + i + '.name')}
              ${input('Keterangan / role', 'testimonials.' + i + '.role')}
              <div class="full">${input('Isi testimoni', 'testimonials.' + i + '.text', { area: true, rows: 3 })}</div>
            </div>
          </div>`).join('')}
        <button class="btn ghost" data-action="add" data-list="testimonials">+ Tambah testimoni</button>
      </div>`;
    },

    payments() {
      return `
      <div class="page-head"><h2>Metode Pembayaran</h2><p>Nama, huruf logo, dan warna latar.</p></div>
      <div class="card">
        <h3>Daftar metode <em>${S.payments.length} item</em></h3>
        ${S.payments.map((p, i) => `
          <div class="item">
            <div class="item-head">
              <strong>${esc(p.name)}</strong>
              <div class="row">
                <button class="btn mini ghost" data-action="up" data-list="payments" data-i="${i}">↑</button>
                <button class="btn mini ghost" data-action="down" data-list="payments" data-i="${i}">↓</button>
                <button class="btn mini danger" data-action="del" data-list="payments" data-i="${i}">Hapus</button>
              </div>
            </div>
            <div class="item-body">
              ${input('Nama metode', 'payments.' + i + '.name')}
              ${input('Huruf logo', 'payments.' + i + '.short')}
              ${input('Warna latar', 'payments.' + i + '.bg', { color: true })}
            </div>
          </div>`).join('')}
        <button class="btn ghost" data-action="add" data-list="payments">+ Tambah metode</button>
      </div>`;
    },

    faq() {
      return `
      <div class="page-head"><h2>FAQ</h2><p>Pertanyaan &amp; jawaban di halaman depan.</p></div>
      <div class="card">
        <h3>Daftar FAQ <em>${S.faq.length} item</em></h3>
        ${S.faq.map((f, i) => `
          <div class="item">
            <div class="item-head">
              <strong>FAQ #${i + 1}</strong>
              <div class="row">
                <button class="btn mini ghost" data-action="up" data-list="faq" data-i="${i}">↑</button>
                <button class="btn mini ghost" data-action="down" data-list="faq" data-i="${i}">↓</button>
                <button class="btn mini danger" data-action="del" data-list="faq" data-i="${i}">Hapus</button>
              </div>
            </div>
            <div class="item-body">
              <div class="full">${input('Pertanyaan', 'faq.' + i + '.q')}</div>
              <div class="full">${input('Jawaban', 'faq.' + i + '.a', { area: true, rows: 3 })}</div>
            </div>
          </div>`).join('')}
        <button class="btn ghost" data-action="add" data-list="faq">+ Tambah FAQ</button>
      </div>`;
    },

    footer() {
      return `
      <div class="page-head"><h2>Footer</h2><p>Kontak dan hak cipta.</p></div>
      <div class="card">
        <div class="grid2">
          ${input('Email dukungan', 'footer.email')}
          ${input('Link Telegram', 'footer.telegram')}
        </div>
        ${input('Tagline footer', 'footer.tagline', { area: true, rows: 2 })}
        ${input('Teks hak cipta', 'footer.copyright')}
      </div>`;
    },

    rename() {
      return `
      <div class="page-head"><h2>Ganti Nama Massal</h2><p>Mengganti teks di semua field sekaligus — cocok untuk rebranding.</p></div>
      <div class="card">
        <h3>🔁 Cari &amp; ganti</h3>
        <div class="grid2">
          <label class="fld"><span>Teks lama</span><input id="rOld" type="text" value="move2link"></label>
          <label class="fld"><span>Teks baru</span><input id="rNew" type="text" value="din2link"></label>
        </div>
        <div class="row">
          <button class="btn primary" id="rGo">Ganti semua</button>
        </div>
        <div class="tip">Penggantian tidak peka huruf besar/kecil dan mempertahankan kapitalisasi awal (Move2link → Din2link, move2link → din2link).</div>
      </div>`;
    },

    data() {
      return `
      <div class="page-head"><h2>Data &amp; Backup</h2><p>Simpan konfigurasi ke file atau pulihkan dari file.</p></div>
      <div class="card">
        <h3>Ekspor</h3>
        <div class="row">
          <button class="btn primary" id="dExport">Unduh JSON</button>
          <button class="btn ghost" id="dCopy">Salin ke clipboard</button>
        </div>
      </div>
      <div class="card">
        <h3>Impor</h3>
        <label class="fld"><span>Tempel JSON di sini</span><textarea id="dIn" rows="6"></textarea></label>
        <div class="row"><button class="btn primary" id="dImport">Terapkan JSON</button></div>
      </div>
      <div class="card">
        <h3>Reset</h3>
        <div class="row">
          <button class="btn danger" id="dReset">Kembalikan ke default Din2link</button>
        </div>
      </div>`;
    }
  };

  function render() {
    renderNav();
    document.getElementById('content').innerHTML = views[view]();
  }

  /* ---------- Ganti nama massal ---------- */
  function bulkReplace(oldS, newS) {
    if (!oldS) return 0;
    let count = 0;
    const rx = new RegExp(oldS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const capNew = newS.charAt(0).toUpperCase() + newS.slice(1);

    const walk = (o) => {
      for (const k in o) {
        if (typeof o[k] === 'string') {
          const before = o[k];
          o[k] = o[k].replace(rx, (m) => (/^[A-Z]/.test(m) ? capNew : newS));
          if (o[k] !== before) count++;
        } else if (o[k] && typeof o[k] === 'object') {
          walk(o[k]);
        }
      }
    };
    walk(S);
    return count;
  }

  /* ---------- Template item baru ---------- */
  const NEW_ITEM = {
    features: () => ({ icon: 'bolt', title: 'Fitur Baru', desc: 'Deskripsi fitur baru.' }),
    testimonials: () => ({
      name: 'Pengguna Baru',
      role: 'Kreator Konten',
      text: 'Tulis testimoni di sini.',
      gradient: 'linear-gradient(135deg,#136cfa,#7c3aed)',
      featured: false
    }),
    payments: () => ({ name: 'Metode Baru', short: 'M', bg: '#334155' }),
    faq: () => ({ q: 'Pertanyaan baru?', a: 'Tulis jawabannya di sini.' })
  };

  /* ---------- Event: navigasi ---------- */
  document.getElementById('nav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    view = b.dataset.nav;
    render();
  });

  /* ---------- Event: input fields ---------- */
  const content = document.getElementById('content');

  content.addEventListener('input', (e) => {
    const el = e.target.closest('[data-path]');
    if (!el) return;
    setPath(S, el.dataset.path, el.value);
    save();
    if (el.dataset.path.startsWith('brand.')) renderNav();
  });

  content.addEventListener('change', (e) => {
    const el = e.target.closest('select[data-path]');
    if (!el) return;
    setPath(S, el.dataset.path, el.value);
    save();
  });

  /* ---------- Event: tombol aksi list & lainnya ---------- */
  content.addEventListener('click', (e) => {
    const t = e.target;

    /* list actions */
    const b = t.closest('[data-action]');
    if (b && b.dataset.list) {
      const list = b.dataset.list;
      const i = Number(b.dataset.i);
      const act = b.dataset.action;

      if (act === 'add') {
        S[list].push(NEW_ITEM[list]());
        toast('Item ditambahkan');
      } else if (act === 'del') {
        S[list].splice(i, 1);
        toast('Item dihapus');
      } else if (act === 'up' && i > 0) {
        S[list].splice(i - 1, 0, S[list].splice(i, 1)[0]);
      } else if (act === 'down' && i < S[list].length - 1) {
        S[list].splice(i + 1, 0, S[list].splice(i, 1)[0]);
      } else if (act === 'feat') {
        // hanya satu testimoni unggulan
        S.testimonials.forEach((x, j) => (x.featured = j === i));
        toast('Testimoni unggulan diperbarui');
      }

      save();
      render();
      return;
    }

    /* ganti nama massal */
    if (t.id === 'rGo') {
      const oldS = document.getElementById('rOld').value;
      const newS = document.getElementById('rNew').value;
      const n = bulkReplace(oldS, newS);
      save();
      render();
      toast(n + ' teks diperbarui');
    }

    /* ekspor */
    if (t.id === 'dExport') {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'din2link-config.json';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('File JSON diunduh');
    }

    if (t.id === 'dCopy') {
      navigator.clipboard
        .writeText(JSON.stringify(S, null, 2))
        .then(() => toast('JSON disalin'))
        .catch(() => toast('Gagal menyalin'));
    }

    /* impor */
    if (t.id === 'dImport') {
      try {
        const data = JSON.parse(document.getElementById('dIn').value);
        S = Object.assign(clone(DIN2LINK_DEFAULTS), data);
        save();
        render();
        toast('Konfigurasi diterapkan');
      } catch (err) {
        toast('JSON tidak valid');
      }
    }

    /* reset */
    if (t.id === 'dReset') {
      if (confirm('Kembalikan semua pengaturan ke default Din2link?')) {
        S = clone(DIN2LINK_DEFAULTS);
        save();
        render();
        toast('Direset ke default');
      }
    }
  });

  /* ---------- Init ---------- */
  render();
})();
