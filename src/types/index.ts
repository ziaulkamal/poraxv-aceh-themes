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
  iconSrc: string; // URL ikon utama (dari API Simpora bila live; bundel FE bila statis)
  iconFallback?: string; // ikon bundel FE; dipakai <img onError> bila iconSrc API 404
  jumlahNomor: number; // banyak nomor/medali yang diperebutkan
}

/** Satu venue/arena pertandingan di wilayah tuan rumah. */
export interface Venue {
  nama: string;
  lokasi: string;
  cabor: string[]; // cabor yang digelar di sini
  image: string;
  ref?: string; // id venue simpora → key ke CMS VenueContent
  deskripsi?: string; // dari CMS VenueContent (fallback data statis)
  galeri?: string[]; // foto tambahan dari CMS VenueContent
}

/** Satu agenda pertandingan pada cuplikan jadwal. */
export interface JadwalItem {
  tanggal: string; // mis. "12 Sep"
  waktu: string; // mis. "09:00"
  cabor: string;
  acara: string;
  venue: string;
  status?: "akan" | "live" | "selesai"; // dari core; kosong utk data statis
  kode?: string; // match_code, mis. "SPK-001"
  kontingen?: Array<{ nama: string; logo: string }>; // ikon peserta; nama utk alt saja
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
  slug?: string; // dari CMS → tautan ke /berita/:slug (statis demo bisa tanpa slug)
  judul: string;
  ringkasan: string;
  kategori: string;
  tanggal: string;
  image: string;
}
