/** Satu kontingen peserta: nama daerah + path lambang di /public. */
export interface Kontingen {
  nama: string;
  logo: string;
}

/** 23 kabupaten/kota Aceh (kode BPS 11.xx) sebagai kontingen peserta PORA. */
export const kontingenList: Kontingen[] = [
  { nama: "Aceh Selatan", logo: "/images/kontingen/11.01.png" },
  { nama: "Aceh Tenggara", logo: "/images/kontingen/11.02.png" },
  { nama: "Aceh Timur", logo: "/images/kontingen/11.03.png" },
  { nama: "Aceh Tengah", logo: "/images/kontingen/11.04.png" },
  { nama: "Aceh Barat", logo: "/images/kontingen/11.05.png" },
  { nama: "Aceh Besar", logo: "/images/kontingen/11.06.png" },
  { nama: "Pidie", logo: "/images/kontingen/11.07.png" },
  { nama: "Aceh Utara", logo: "/images/kontingen/11.08.png" },
  { nama: "Simeulue", logo: "/images/kontingen/11.09.png" },
  { nama: "Aceh Singkil", logo: "/images/kontingen/11.10.png" },
  { nama: "Bireuen", logo: "/images/kontingen/11.11.png" },
  { nama: "Aceh Barat Daya", logo: "/images/kontingen/11.12.png" },
  { nama: "Gayo Lues", logo: "/images/kontingen/11.13.png" },
  { nama: "Aceh Jaya", logo: "/images/kontingen/11.14.png" },
  { nama: "Nagan Raya", logo: "/images/kontingen/11.15.png" },
  { nama: "Aceh Tamiang", logo: "/images/kontingen/11.16.png" },
  { nama: "Bener Meriah", logo: "/images/kontingen/11.17.png" },
  { nama: "Pidie Jaya", logo: "/images/kontingen/11.18.png" },
  { nama: "Kota Banda Aceh", logo: "/images/kontingen/11.71.png" },
  { nama: "Kota Sabang", logo: "/images/kontingen/11.72.png" },
  { nama: "Kota Langsa", logo: "/images/kontingen/11.73.png" },
  { nama: "Kota Lhokseumawe", logo: "/images/kontingen/11.74.png" },
  { nama: "Kota Subulussalam", logo: "/images/kontingen/11.75.png" },
];
