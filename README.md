# Din2link — Website + Admin Panel

Proyek statis (HTML/CSS/JS murni, tanpa build tool).

## Struktur

```
├── index.html        # Website utama (landing page)
├── admin.html        # Admin panel (edit konten)
├── css/
│   ├── style.css     # Style website utama
│   └── admin.css     # Style admin panel
├── js/
│   ├── data.js       # Data/konfigurasi default (dipakai keduanya)
│   ├── main.js       # Logika website utama
│   └── admin.js      # Logika admin panel
└── README.md
```

## Cara menjalankan

Cukup buka `index.html` di browser, atau jalankan server lokal:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Lalu buka `http://localhost:8000`.

> Disarankan lewat server lokal agar localStorage konsisten
> (file:// kadang punya origin berbeda antar-file di beberapa browser).

## Cara kerja admin panel

1. Buka `admin.html`.
2. Edit konten (brand, hero, fitur, testimoni, pembayaran, FAQ, footer).
3. Perubahan tersimpan otomatis ke **localStorage** dengan key
   `din2link.site.config`.
4. `index.html` membaca key yang sama saat dimuat → konten langsung berubah
   setelah refresh.

Fitur tambahan admin:
- **Ganti Nama Massal** — cari & ganti teks di semua field (mis. rebranding).
- **Data & Backup** — ekspor/impor konfigurasi sebagai JSON, serta reset
  ke default.

## Kustomisasi

- Default konten: edit `js/data.js` (objek `DIN2LINK_DEFAULTS`).
- Warna brand: variabel CSS di `css/style.css` (`--brand`, `--brand-2`).
- Ikon fitur: tambah entri baru di objek `ICONS` pada `js/main.js`,
  lalu daftarkan namanya di `ICON_OPTIONS` pada `js/admin.js`.

## Catatan produksi

Admin panel ini berbasis localStorage (per-browser) — cocok untuk demo/prototipe.
Untuk produksi multi-user, ganti lapisan penyimpanan di `js/data.js` dan
`js/admin.js` dengan panggilan API ke backend (REST/DB), struktur datanya
sudah siap dipakai apa adanya sebagai JSON.
