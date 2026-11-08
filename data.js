/* ============================================================
   Din2link — Data konten situs
   File ini adalah "sumber data" default. Admin panel (admin.html)
   menyimpan perubahan ke localStorage dengan key yang sama,
   dan main.js akan memakai data dari localStorage jika ada.
   ============================================================ */

const DIN2LINK_STORE_KEY = 'din2link.site.config';

const DIN2LINK_DEFAULTS = {
  brand: {
    name: 'Din2link',
    initial: 'D',
    domain: 'din2link.com',
    dashboardUrl: 'https://dashboard.din2link.com/statistics',
    signupUrl: 'https://dashboard.din2link.com/signup'
  },

  hero: {
    badge: 'CPM Tertinggi 2026',
    title1: 'Shortlink',
    title2: 'CPM Tertinggi',
    cpm: 'Rp 179.200',
    payout: '12 jam',
    ctaPrimary: 'Daftar Sekarang',
    ctaSecondary: 'Lihat Rate CPM'
  },

  features: [
    {
      icon: 'chart',
      title: 'Rate CPM Tinggi',
      desc: 'CPM hingga Rp 179.200 untuk trafik Indonesia dan global.'
    },
    {
      icon: 'chat',
      title: 'Komunitas Aktif',
      desc: 'Bergabung di Telegram untuk tips, dukungan, dan update terbaru.'
    },
    {
      icon: 'levels',
      title: 'Level Iklan',
      desc: 'Atur level iklanmu — semakin banyak langkah, semakin tinggi CPM.'
    },
    {
      icon: 'lock',
      title: 'Link Paywall',
      desc: 'Kunci link di balik paywall dan dapatkan penghasilan langsung.'
    }
  ],

  testimonials: [
    {
      name: 'Ledac Official',
      role: 'YouTuber · 60k+ subscribers',
      text: 'Fitur Paywall dan Level Iklan di Din2link bener-bener ngebantu banget. Sangat rekomen ya guys, ga usah ragu lagi kalau mau pindah ke Din2link.',
      gradient: 'linear-gradient(135deg,#136cfa,#7c3aed)',
      featured: true
    },
    {
      name: 'MULDI21',
      role: 'YouTuber · 20k+ subscribers',
      text: 'Pas pindah ke Din2link, penghasilan saya jadi lebih tinggi dibanding shortlink lain. Rate CPM-nya kadang dinaikin kalau trafiknya bagus — pernah nyentuh sekitar Rp 300.000. Terima kasih Din2link!',
      gradient: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
      featured: false
    },
    {
      name: 'Abyzard Gaming',
      role: 'YouTuber · 34k+ subscribers',
      text: 'Mantap, payment super cepet, CPM tinggi, dan support-nya ramah banget. Din2link emang shortlink terbaik buat para kreator konten yang mau monetisasi link.',
      gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      featured: false
    }
  ],

  payments: [
    { name: 'PayPal',        short: 'P', bg: '#003087' },
    { name: 'DANA',          short: 'D', bg: '#108EE9' },
    { name: 'OVO',           short: 'O', bg: '#4C3494' },
    { name: 'GoPay',         short: 'G', bg: '#01ACD7' },
    { name: 'ShopeePay',     short: 'S', bg: '#F0592C' },
    { name: 'LinkAja',       short: 'L', bg: '#E82529' },
    { name: 'USDT (Tether)', short: 'T', bg: '#26A17B' },
    { name: 'Binance USDT',  short: 'B', bg: '#F3BA2F' },
    { name: 'Litecoin',      short: 'L', bg: '#345D9D' },
    { name: 'TRX (Tron)',    short: 'T', bg: '#FF060A' },
    { name: 'Bank Transfer', short: 'B', bg: '#334155' },
    { name: 'Payoneer',      short: 'P', bg: '#FF4800' },
    { name: 'Payeer',        short: 'P', bg: '#4598D8' }
  ],

  faq: [
    {
      q: 'Berapa rate CPM di Din2link?',
      a: 'Rate CPM Din2link bergantung pada negara asal pengunjung dan level iklan yang kamu pilih. Untuk trafik Indonesia, CPM bisa mencapai Rp 179.200 per 1.000 kunjungan.'
    },
    {
      q: 'Berapa minimal penarikan dan berapa lama prosesnya?',
      a: 'Minimal penarikan rendah dan prosesnya cepat — rata-rata dana masuk dalam waktu maksimal 12 jam setelah permintaan disetujui.'
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Tersedia PayPal, Payoneer, Payeer, USDT, TRX, Binance, Litecoin, transfer bank, serta e-wallet DANA, OVO, GoPay, ShopeePay, dan LinkAja.'
    },
    {
      q: 'Apakah trafik dari media sosial diperbolehkan?',
      a: 'Boleh. Trafik dari YouTube, TikTok, Instagram, Facebook, X, WhatsApp, dan Telegram diperbolehkan selama tidak mengandung aktivitas tidak valid seperti bot atau klik palsu.'
    },
    {
      q: 'Apakah pendaftaran dikenakan biaya?',
      a: 'Tidak. Pendaftaran 100% gratis dan kamu bisa mulai menghasilkan sejak link pertama dibagikan.'
    }
  ],

  footer: {
    tagline: 'Shortlink terbaik untuk menghasilkan uang dari setiap link yang kamu bagikan. CPM tinggi, pembayaran cepat, 13 metode pencairan.',
    email: 'support@din2link.com',
    telegram: 'https://t.me/din2link',
    copyright: '© 2026 Din2link. Seluruh hak cipta dilindungi.'
  }
};

/**
 * Ambil konfigurasi aktif:
 * gabungan default + override dari localStorage (hasil admin panel).
 */
function din2linkGetConfig() {
  try {
    const raw = localStorage.getItem(DIN2LINK_STORE_KEY);
    if (!raw) return structuredClone(DIN2LINK_DEFAULTS);
    const saved = JSON.parse(raw);
    // merge dangkal per-seksi agar field baru di default tetap ada
    const merged = structuredClone(DIN2LINK_DEFAULTS);
    for (const key of Object.keys(saved)) {
      merged[key] = saved[key];
    }
    return merged;
  } catch (e) {
    return structuredClone(DIN2LINK_DEFAULTS);
  }
}
