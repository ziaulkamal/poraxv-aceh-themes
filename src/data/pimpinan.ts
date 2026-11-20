import gubernur from "../assets/pimpinan/gubernur.webp";
import bupati from "../assets/pimpinan/bupati.webp";

/** Varian tata letak section pimpinan: a = dua panel, b = slide, c = menyatu Hero. */
export type VarianPimpinan = "a" | "b" | "c";

/**
 * Varian yang aktif di situs. Hardcode (tanpa database): ganti huruf ini lalu
 * deploy ulang landing. `?pimpinan=a|b|c` di URL hanya untuk pratinjau.
 */
export const VARIAN_PIMPINAN: VarianPimpinan = "a";

export interface PaketPimpinan {
  foto: string;
  jabatan: string;
  wilayah: string;
  nama: [string, string];
}

/** Urutan protokol: Provinsi dulu, lalu Kabupaten tuan rumah. */
export const paketPimpinan: PaketPimpinan[] = [
  { foto: gubernur, jabatan: "Gubernur & Wakil Gubernur", wilayah: "Aceh", nama: ["Muzakir Manaf", "Fadhlullah"] },
  { foto: bupati, jabatan: "Bupati & Wakil Bupati", wilayah: "Aceh Jaya", nama: ["Safwandi", "Muslem D"] },
];
