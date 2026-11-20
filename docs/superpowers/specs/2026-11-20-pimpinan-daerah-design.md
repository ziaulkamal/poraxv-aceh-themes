# Section Pimpinan Daerah — desain singkat

Tanggal: 2026-11-20 · Ukuran: perubahan kecil (1 section baru di beranda)

## Maksud
Beranda poraxv.id menampilkan foto dua paket pimpinan daerah — Gubernur & Wakil
Gubernur Aceh, Bupati & Wakil Bupati Aceh Jaya — sebagai penanda dukungan
pemerintah. Hanya foto + nama/jabatan; tanpa kata sambutan.

## Tujuan / bukan tujuan
- Tujuan: foto tampil tepat di atas pita "23 Kontingen", cepat dimuat, rapi di HP.
- Tujuan: ketiga varian ikut ter-deploy; varian aktif dipilih lewat konstanta di kode.
- Bukan tujuan: data dari CMS/database, halaman profil pimpinan, kata sambutan.
- Anti-tujuan: beranda jadi berat (foto mentah 6–10 MB) atau gerakan bertumpuk yang ramai.

## Pendekatan (ketiganya dibangun, satu aktif)
- **A — dua panel berdampingan** (rekomendasi): setara, statis, Gubernur di kiri (protokol).
  Biaya: section lebih tinggi, di HP panel bertumpuk.
- **B — slide crossfade 6 dtk** dengan titik navigasi: hemat tempat; satu paket tersembunyi
  setengah waktu; gerak bertumpuk dengan pita logo.
- **C — menyatu di kaki Hero**: paling megah; perlu sambungan latar Hero yang mulus.

## Keputusan
- Pemilihan varian: konstanta `VARIAN_PIMPINAN` di `src/data/pimpinan.ts` (hardcode,
  tanpa database). Ganti = edit 1 baris + deploy ulang landing.
- Override `?pimpinan=a|b|c` di URL dipertahankan untuk membandingkan langsung di situs live
  (tidak berbahaya; hanya mengubah tampilan bagi yang membuka URL itu). — keputusan Claude
- Data (foto, jabatan, nama) di `src/data/pimpinan.ts`; nama tanpa gelar sampai dikonfirmasi.
- Foto: dipangkas ke batas piksel non-transparan, tinggi 900 px, WebP q82 (~70 KB/foto) di
  `src/assets/pimpinan/`. PNG mentah di root `landing/` tidak di-commit (masuk .gitignore).
- Gaya: token tema yang ada (surface-dark, emas, merah, hijau), tanpa hex mentah.

## Yang diserahkan ke pembangun
- Rapikan sambungan latar varian C; uji 320/390/768/1440 px; `tsc` + `npm run build`.
- Deploy: commit ke `main` repo `poraxv-aceh-themes`, lalu di tm
  `git -C landing pull && ./deploy-app.sh landing` (latar belakang), cek https://poraxv.id.
