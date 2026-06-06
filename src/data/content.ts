import type { ComponentType, SVGProps } from "react";
import {
  Facebook,
  Instagram,
  Threads,
  TikTok,
  XLogo,
} from "../components/ui/BrandIcons";
import type {
  Berita,
  Cabor,
  EventInfo,
  JadwalItem,
  MedaliKontingen,
  Venue,
} from "../types";

/** Identitas event — nilai PLACEHOLDER, ganti saat data resmi tersedia. */
export const event: EventInfo = {
  edisi: "PORA XV",
  namaPanjang: "Pekan Olahraga Aceh",
  tuanRumah: "Kabupaten Aceh Jaya",
  kota: "Calang",
  tanggalMulai: "2026-09-12T08:00:00+07:00",
  tanggalSelesai: "2026-09-22T22:00:00+07:00",
  tagline: "Satukan Semangat, Raih Prestasi di Bumi Aceh Jaya",
};

/** Kanal sosial resmi PORA Aceh Jaya (`brand` = warna isi saat hover). */
export interface Sosial {
  nama: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  brand: string;
}

export const socials: Sosial[] = [
  { nama: "Facebook", href: "https://facebook.com/poraacehjaya", icon: Facebook, brand: "#1877F2" },
  { nama: "Instagram", href: "https://instagram.com/poraacehjaya", icon: Instagram, brand: "#E4405F" },
  { nama: "Threads", href: "https://threads.net/@poraacehjaya", icon: Threads, brand: "#000000" },
  { nama: "TikTok", href: "https://tiktok.com/@poraacehjaya", icon: TikTok, brand: "#010101" },
  { nama: "X", href: "https://x.com/poraacehjaya", icon: XLogo, brand: "#000000" },
];

/**
 * Ikon cabor di-bundle lewat Vite dari src/assets agar URL-nya pasti ter-resolve
 * (di-hash & ikut build) — bukan path mentah ke /public.
 */
const iconModules = import.meta.glob(
  "../assets/icon-cabor/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
) as Record<string, string>;

/** Ambil URL ikon ter-bundle berdasarkan nama file; lempar bila tak ditemukan. */
function icon(file: string): string {
  const match = Object.entries(iconModules).find(([path]) =>
    path.endsWith(`/${file}`)
  );
  if (!match) {
    throw new Error(`Ikon cabor tidak ditemukan: ${file}`);
  }
  return match[1];
}

/** Peta ikon bundel per basename (tanpa ekstensi) — kunci fallback dari nama file API. */
const iconByBasename = new Map(
  Object.entries(iconModules).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ])
);

/**
 * Resolusi ikon bundel FE dari nama file API (mis. "muaythai.png").
 * Cocokkan basename saja agar beda ekstensi (png↔jpg) tetap kena; "" bila tak ada.
 */
export function caborIconByFile(file: string): string {
  if (!file) return "";
  return iconByBasename.get(file.replace(/\.[^.]+$/, "")) ?? "";
}

/** Cabang olahraga yang dipertandingkan (data contoh; jumlah nomor PLACEHOLDER). */
export const caborList: Cabor[] = [
  { nama: "Sepak Bola", iconSrc: icon("sepak-bola.png"), jumlahNomor: 1 },
  { nama: "Futsal", iconSrc: icon("futsal.png"), jumlahNomor: 1 },
  { nama: "Bola Voli", iconSrc: icon("bola-voli.png"), jumlahNomor: 2 },
  { nama: "Bola Basket", iconSrc: icon("bola-basket.png"), jumlahNomor: 2 },
  { nama: "Sepak Takraw", iconSrc: icon("sepak-takraw.png"), jumlahNomor: 4 },
  { nama: "Atletik", iconSrc: icon("atletik.png"), jumlahNomor: 24 },
  { nama: "Bulu Tangkis", iconSrc: icon("badminton.png"), jumlahNomor: 5 },
  { nama: "Tenis Meja", iconSrc: icon("tennis-meja.png"), jumlahNomor: 6 },
  { nama: "Tenis Lapangan", iconSrc: icon("tennis-lapangan.png"), jumlahNomor: 7 },
  { nama: "Petanque", iconSrc: icon("petanque.png"), jumlahNomor: 6 },
  { nama: "Panahan", iconSrc: icon("panahan.png"), jumlahNomor: 9 },
  { nama: "Menembak", iconSrc: icon("menembak.png"), jumlahNomor: 7 },
  { nama: "Angkat Besi", iconSrc: icon("angkat-besi.png"), jumlahNomor: 10 },
  { nama: "Balap Sepeda", iconSrc: icon("balap-sepeda.jpg"), jumlahNomor: 8 },
  { nama: "Balap Motor", iconSrc: icon("bermotor.png"), jumlahNomor: 6 },
  { nama: "Sepatu Roda", iconSrc: icon("sepatu-roda.png"), jumlahNomor: 8 },
  { nama: "Panjat Tebing", iconSrc: icon("panjat-tebing.png"), jumlahNomor: 6 },
  { nama: "Arung Jeram", iconSrc: icon("arung-jeram.png"), jumlahNomor: 6 },
  { nama: "Dayung", iconSrc: icon("dayung.png"), jumlahNomor: 12 },
  { nama: "Layar", iconSrc: icon("layar.png"), jumlahNomor: 8 },
  { nama: "Pencak Silat", iconSrc: icon("silat.png"), jumlahNomor: 16 },
  { nama: "Karate", iconSrc: icon("karate.png"), jumlahNomor: 12 },
  { nama: "Taekwondo", iconSrc: icon("taekwondo.png"), jumlahNomor: 14 },
  { nama: "Wushu", iconSrc: icon("wushu.png"), jumlahNomor: 10 },
  { nama: "Kempo", iconSrc: icon("kempo.png"), jumlahNomor: 8 },
  { nama: "Muay Thai", iconSrc: icon("muaythai.jpg"), jumlahNomor: 8 },
  { nama: "Tarung Derajat", iconSrc: icon("tarung-derajat.png"), jumlahNomor: 8 },
  { nama: "Tinju", iconSrc: icon("tinju.png"), jumlahNomor: 10 },
  { nama: "Anggar", iconSrc: icon("anggar.jpg"), jumlahNomor: 12 },
];

/** Venue/arena pertandingan di Aceh Jaya (data contoh). */
export const venueList: Venue[] = [
  {
    nama: "Stadion Utama Calang",
    lokasi: "Calang, Krueng Sabee",
    cabor: ["Sepak Bola", "Atletik"],
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80",
  },
  {
    nama: "GOR Aceh Jaya",
    lokasi: "Calang",
    cabor: ["Bola Voli", "Bulu Tangkis", "Tenis Meja"],
    image:
      "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?auto=format&fit=crop&w=800&q=80",
  },
  {
    nama: "Kolam Renang Krueng Sabee",
    lokasi: "Krueng Sabee",
    cabor: ["Renang"],
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  },
  {
    nama: "Padepokan Bela Diri Lamno",
    lokasi: "Jaya, Lamno",
    cabor: ["Pencak Silat", "Karate"],
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
  },
  {
    nama: "Lapangan Tembak Teunom",
    lokasi: "Teunom",
    cabor: ["Menembak", "Panahan"],
    image:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
  },
  {
    nama: "Sirkuit Pantai Lhok Geulumpang",
    lokasi: "Setia Bakti",
    cabor: ["Balap Sepeda"],
    image:
      "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=800&q=80",
  },
];

/** Cuplikan jadwal pertandingan terdekat (data contoh). */
export const jadwalList: JadwalItem[] = [
  {
    tanggal: "12 Sep",
    waktu: "08:00",
    cabor: "Upacara",
    acara: "Pembukaan PORA XV",
    venue: "Stadion Utama Calang",
  },
  {
    tanggal: "13 Sep",
    waktu: "09:00",
    cabor: "Atletik",
    acara: "Final Lari 100m Putra",
    venue: "Stadion Utama Calang",
  },
  {
    tanggal: "13 Sep",
    waktu: "14:00",
    cabor: "Renang",
    acara: "Final 50m Gaya Bebas",
    venue: "Kolam Renang Krueng Sabee",
  },
  {
    tanggal: "14 Sep",
    waktu: "16:00",
    cabor: "Sepak Bola",
    acara: "Babak Penyisihan Grup A",
    venue: "Stadion Utama Calang",
  },
  {
    tanggal: "15 Sep",
    waktu: "10:00",
    cabor: "Pencak Silat",
    acara: "Final Kelas B Putri",
    venue: "Padepokan Bela Diri Lamno",
  },
];

/** Klasemen perolehan medali per kontingen (data contoh). */
export const klasemenList: MedaliKontingen[] = [
  { peringkat: 1, kontingen: "Kota Banda Aceh", emas: 42, perak: 31, perunggu: 28 },
  { peringkat: 2, kontingen: "Kabupaten Aceh Besar", emas: 35, perak: 29, perunggu: 33 },
  { peringkat: 3, kontingen: "Kabupaten Aceh Jaya", emas: 28, perak: 22, perunggu: 19 },
  { peringkat: 4, kontingen: "Kota Lhokseumawe", emas: 24, perak: 26, perunggu: 21 },
  { peringkat: 5, kontingen: "Kabupaten Pidie", emas: 21, perak: 18, perunggu: 25 },
  { peringkat: 6, kontingen: "Kabupaten Bireuen", emas: 19, perak: 23, perunggu: 20 },
  { peringkat: 7, kontingen: "Kabupaten Aceh Barat", emas: 17, perak: 15, perunggu: 22 },
  { peringkat: 8, kontingen: "Kota Langsa", emas: 14, perak: 17, perunggu: 16 },
];

/** Berita & kabar terbaru seputar event (data contoh). */
export const beritaList: Berita[] = [
  {
    judul: "Aceh Jaya Siap Sambut 23 Kontingen di PORA XV",
    ringkasan:
      "Seluruh venue di Calang dan sekitarnya rampung 95 persen menjelang hari pembukaan.",
    kategori: "Persiapan",
    tanggal: "2 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  },
  {
    judul: "Maskot “Si Geulumpang” Resmi Diperkenalkan",
    ringkasan:
      "Maskot bertema pesisir Aceh Jaya jadi wajah semangat sportivitas PORA tahun ini.",
    kategori: "Identitas",
    tanggal: "28 Agu 2026",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
  },
  {
    judul: "Estafet Obor Mulai Bergulir dari Banda Aceh",
    ringkasan:
      "Api semangat PORA diarak melewati lima kabupaten sebelum tiba di Calang.",
    kategori: "Agenda",
    tanggal: "25 Agu 2026",
    image:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
  },
];
