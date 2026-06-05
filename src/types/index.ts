/** Informasi inti penyelenggaraan event (dipakai Hero & Footer). */
export interface EventInfo {
  edisi: string; // mis. "PORA XV"
  namaPanjang: string;
  tuanRumah: string;
  kota: string;
  tanggalMulai: string; // ISO, dipakai countdown
  tanggalSelesai: string; // ISO
  tagline: string;
}

/** Satu cabang olahraga yang dipertandingkan. */
export interface Cabor {
  nama: string;
  iconSrc: string; // path gambar ikon cabor di /public/images/icon-cabor
  jumlahNomor: number; // banyak nomor/medali yang diperebutkan
}

/** Satu venue/arena pertandingan di wilayah tuan rumah. */
export interface Venue {
  nama: string;
  lokasi: string;
  cabor: string[]; // cabor yang digelar di sini
  image: string;
}

/** Satu agenda pertandingan pada cuplikan jadwal. */
export interface JadwalItem {
  tanggal: string; // mis. "12 Sep"
  waktu: string; // mis. "09:00"
  cabor: string;
  acara: string;
  venue: string;
}

/** Perolehan medali satu kontingen kabupaten/kota. */
export interface MedaliKontingen {
  peringkat: number;
  kontingen: string;
  emas: number;
  perak: number;
  perunggu: number;
}

/** Satu kartu berita/kabar terbaru. */
export interface Berita {
  judul: string;
  ringkasan: string;
  kategori: string;
  tanggal: string;
  image: string;
}
