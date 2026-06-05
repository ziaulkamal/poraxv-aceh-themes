# PORA XV — Aceh Jaya Theme

Landing page resmi **PORA XV (Pekan Olahraga Aceh)** dengan tuan rumah **Kabupaten Aceh Jaya**.
Dibangun sebagai single-page yang ringan, responsif, dan mendukung mode terang/gelap.

![Tampilan Hero PORA Aceh Jaya](./screenshot.jpg)

---

## ✨ Fitur

- **Hero dinamis** dengan maskot harimau, hitung mundur menuju pembukaan, dan statistik event.
- **Navigasi mengambang** yang berubah bentuk saat di-scroll, lengkap dengan off-canvas mobile.
- **Mode terang & gelap** — satu sumber tema lewat CSS variable (`src/app/globals.css`).
- **Cabang Olahraga** — 29 cabor dengan ikon ilustratif; pratinjau ringkas + tombol "Lihat semua" agar tidak menutupi konten penting.
- **Section lengkap**: Tentang, Jadwal, Klasemen Medali, Venue, Berita, dan Kontingen.
- **Animasi reveal** halus berbasis `IntersectionObserver` dan menghormati `prefers-reduced-motion`.

## 🛠️ Teknologi

| Area        | Stack                                   |
| ----------- | --------------------------------------- |
| Framework   | React 19 + TypeScript                   |
| Build tool  | Vite                                    |
| Styling     | Tailwind CSS (token via CSS variables)  |
| Ikon UI     | lucide-react                            |
| Aset cabor  | Di-bundle dari `src/assets` lewat Vite  |

## 🚀 Menjalankan secara lokal

> Prasyarat: Node.js 18+ dan npm.

```bash
# 1. Install dependency
npm install

# 2. Mode pengembangan (hot reload)
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Pratinjau hasil build
npm run preview
```

## 📁 Struktur Singkat

```
src/
├─ app/globals.css        # Sumber tunggal tema (warna, font, animasi)
├─ assets/icon-cabor/     # Ikon cabang olahraga (di-bundle Vite)
├─ components/
│  ├─ layout/             # Navbar, Footer, PageShell
│  ├─ sections/           # Hero, CabangOlahraga, Jadwal, dst.
│  └─ ui/                 # Button, Badge, Card, Reveal, dst.
├─ data/                  # Konten event (placeholder, ganti saat data resmi)
└─ types/                 # Tipe data domain
```

## 👤 Author

**Ziaul Kamal**

## © Hak Cipta & Lisensi

**Hak cipta © 2026 Ziaul Kamal. Seluruh hak dilindungi (All Rights Reserved).**

Tema ini dibuat **khusus untuk PORA Aceh Jaya** dan **tidak dilisensikan untuk penggunaan umum**.
Dilarang menyalin, memodifikasi, mendistribusikan, atau menggunakan kembali tema ini —
baik sebagian maupun seluruhnya — untuk event, organisasi, atau keperluan lain
tanpa izin tertulis dari pemegang hak cipta. Lihat berkas [LICENSE](./LICENSE).
