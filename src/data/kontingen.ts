/** Satu kontingen peserta: nama daerah + URL lambang ter-bundle. */
export interface Kontingen {
  nama: string;
  logo: string;
}

/**
 * Lambang kontingen di-bundle lewat Vite dari src/assets agar URL-nya pasti
 * ter-resolve di base path manapun (di-hash & ikut build) — bukan path mentah
 * ke /public. Pola sama dengan ikon cabor di data/content.ts.
 */
const logoModules = import.meta.glob(
  "../assets/kontingen/*.png",
  { eager: true, import: "default" }
) as Record<string, string>;

/** Ambil URL lambang ter-bundle berdasarkan nama file; lempar bila tak ada. */
function logo(file: string): string {
  const match = Object.entries(logoModules).find(([path]) =>
    path.endsWith(`/${file}`)
  );
  if (!match) {
    throw new Error(`Lambang kontingen tidak ditemukan: ${file}`);
  }
  return match[1];
}

/** Peta wilayah_kode BPS (mis. "11.01") → URL lambang ter-bundle; utk ikon jadwal. */
export const logoByWilayah: Record<string, string> = Object.fromEntries(
  Object.entries(logoModules).map(([path, url]) => [
    (path.split("/").pop() ?? "").replace(/\.png$/, ""),
    url,
  ]),
);

/** URL lambang kontingen dari wilayah_kode (level kab/kota "11.NN"); "" bila tak ada. */
export function logoKontingen(wilayahKode?: string | null): string {
  if (!wilayahKode) return "";
  return logoByWilayah[wilayahKode] ?? logoByWilayah[wilayahKode.slice(0, 5)] ?? "";
}

/** 23 kabupaten/kota Aceh (kode BPS 11.xx) sebagai kontingen peserta PORA. */
export const kontingenList: Kontingen[] = [
  { nama: "Aceh Selatan", logo: logo("11.01.png") },
  { nama: "Aceh Tenggara", logo: logo("11.02.png") },
  { nama: "Aceh Timur", logo: logo("11.03.png") },
  { nama: "Aceh Tengah", logo: logo("11.04.png") },
  { nama: "Aceh Barat", logo: logo("11.05.png") },
  { nama: "Aceh Besar", logo: logo("11.06.png") },
  { nama: "Pidie", logo: logo("11.07.png") },
  { nama: "Aceh Utara", logo: logo("11.08.png") },
  { nama: "Simeulue", logo: logo("11.09.png") },
  { nama: "Aceh Singkil", logo: logo("11.10.png") },
  { nama: "Bireuen", logo: logo("11.11.png") },
  { nama: "Aceh Barat Daya", logo: logo("11.12.png") },
  { nama: "Gayo Lues", logo: logo("11.13.png") },
  { nama: "Aceh Jaya", logo: logo("11.14.png") },
  { nama: "Nagan Raya", logo: logo("11.15.png") },
  { nama: "Aceh Tamiang", logo: logo("11.16.png") },
  { nama: "Bener Meriah", logo: logo("11.17.png") },
  { nama: "Pidie Jaya", logo: logo("11.18.png") },
  { nama: "Kota Banda Aceh", logo: logo("11.71.png") },
  { nama: "Kota Sabang", logo: logo("11.72.png") },
  { nama: "Kota Langsa", logo: logo("11.73.png") },
  { nama: "Kota Lhokseumawe", logo: logo("11.74.png") },
  { nama: "Kota Subulussalam", logo: logo("11.75.png") },
];
