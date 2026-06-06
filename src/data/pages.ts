/**
 * Data dummy untuk laman-laman demo (artikel, live skor, galeri, detail venue).
 * Semua placeholder — angka & teks contoh, foto dari Unsplash.
 */

/* ============================ ARTIKEL / BERITA ============================ */

export interface Artikel {
  slug: string;
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  durasiBaca: string;
  image: string;
  ringkasan: string;
  /** Isi artikel sebagai blok paragraf; blok "kutipan" dirender khusus. */
  isi: { tipe: "paragraf" | "subjudul" | "kutipan"; teks: string }[];
}

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const artikelList: Artikel[] = [
  {
    slug: "pembukaan-pora-xv-meriah",
    judul: "Pembukaan PORA XV Berlangsung Meriah di Stadion Utama Calang",
    kategori: "Seremoni",
    tanggal: "12 September 2026",
    penulis: "Redaksi PORA",
    durasiBaca: "4 menit",
    image: unsplash("photo-1461896836934-ffe607ba8211"),
    ringkasan:
      "Ribuan penonton memadati Stadion Utama Calang menyaksikan defile 23 kontingen kabupaten/kota se-Aceh pada upacara pembukaan PORA XV.",
    isi: [
      { tipe: "paragraf", teks: "Pekan Olahraga Aceh (PORA) XV resmi dibuka pada Sabtu malam di Stadion Utama Calang, Kabupaten Aceh Jaya. Upacara pembukaan berlangsung khidmat sekaligus meriah, ditandai dengan defile 23 kontingen kabupaten/kota se-Aceh." },
      { tipe: "paragraf", teks: "Pesta kembang api menghiasi langit Calang saat api obor PORA dinyalakan oleh atlet legendaris Aceh. Momen ini menjadi penanda dimulainya kompetisi multi-cabang terbesar di provinsi paling barat Indonesia tersebut." },
      { tipe: "subjudul", teks: "Semangat Persaudaraan" },
      { tipe: "paragraf", teks: "Dalam sambutannya, Ketua Panitia Besar menekankan bahwa PORA bukan sekadar ajang adu prestasi, melainkan juga perekat persaudaraan antar-daerah di Aceh." },
      { tipe: "kutipan", teks: "PORA adalah panggung bagi putra-putri terbaik Aceh untuk bersaing secara sehat dan menjunjung sportivitas." },
      { tipe: "paragraf", teks: "Sebanyak 29 cabang olahraga dipertandingkan di enam venue yang tersebar di Calang dan sekitarnya. Tuan rumah Aceh Jaya menargetkan peningkatan posisi di klasemen akhir perolehan medali." },
    ],
  },
  {
    slug: "tuan-rumah-raih-emas-pertama",
    judul: "Tuan Rumah Aceh Jaya Raih Medali Emas Pertama dari Cabang Atletik",
    kategori: "Atletik",
    tanggal: "13 September 2026",
    penulis: "Fauzan A.",
    durasiBaca: "3 menit",
    image: unsplash("photo-1552674605-db6ffd4facb5"),
    ringkasan:
      "Sprinter muda tuan rumah tampil mengejutkan dengan menjuarai nomor lari 100m putra, menyumbang emas perdana bagi Aceh Jaya.",
    isi: [
      { tipe: "paragraf", teks: "Kontingen tuan rumah Aceh Jaya membuka keran medali emas lewat cabang atletik. Sprinter muda berusia 19 tahun finis terdepan di nomor lari 100m putra dengan catatan waktu 10,4 detik." },
      { tipe: "paragraf", teks: "Sorak-sorai penonton lokal membahana di Stadion Utama Calang begitu pelari kebanggaan mereka melintasi garis finis lebih dulu dari para pesaingnya." },
      { tipe: "subjudul", teks: "Modal Percaya Diri" },
      { tipe: "paragraf", teks: "Pelatih menyebut emas perdana ini menjadi modal percaya diri bagi seluruh atlet tuan rumah untuk tampil maksimal di cabang-cabang lainnya." },
    ],
  },
  {
    slug: "jadwal-final-pekan-pertama",
    judul: "Inilah Jadwal Lengkap Partai Final Pekan Pertama PORA XV",
    kategori: "Jadwal",
    tanggal: "14 September 2026",
    penulis: "Redaksi PORA",
    durasiBaca: "2 menit",
    image: unsplash("photo-1540747913346-19e32dc3e97e"),
    ringkasan:
      "Sejumlah partai final mempertemukan kontingen-kontingen unggulan pada pekan pertama. Berikut agenda yang wajib disimak.",
    isi: [
      { tipe: "paragraf", teks: "Memasuki pekan pertama, panitia merilis jadwal partai final dari sejumlah cabang olahraga unggulan. Persaingan diprediksi sengit, terutama di cabang bela diri dan akuatik." },
      { tipe: "paragraf", teks: "Penonton diimbau hadir lebih awal mengingat tingginya antusiasme masyarakat untuk menyaksikan langsung pertandingan-pertandingan puncak." },
    ],
  },
  {
    slug: "venue-renang-krueng-sabee-siap",
    judul: "Kolam Renang Krueng Sabee Dinyatakan Siap Gelar Final Akuatik",
    kategori: "Venue",
    tanggal: "11 September 2026",
    penulis: "Nadia R.",
    durasiBaca: "3 menit",
    image: unsplash("photo-1574629810360-7efbbe195018"),
    ringkasan:
      "Setelah melalui sertifikasi, kolam renang berstandar nasional ini siap menjadi arena perebutan medali cabang renang.",
    isi: [
      { tipe: "paragraf", teks: "Kolam Renang Krueng Sabee dinyatakan siap menggelar seluruh nomor cabang renang setelah lolos sertifikasi teknis dari pengurus cabang provinsi." },
      { tipe: "paragraf", teks: "Fasilitas pendukung seperti papan loncat, sistem pencatat waktu elektronik, dan tribun penonton telah rampung dipasang menjelang hari pertandingan." },
      { tipe: "kutipan", teks: "Kami ingin atlet tampil nyaman dengan fasilitas terbaik yang bisa kami sediakan." },
    ],
  },
  {
    slug: "volunteer-pora-garda-terdepan",
    judul: "Ribuan Volunteer Jadi Garda Terdepan Suksesnya PORA XV",
    kategori: "Volunteer",
    tanggal: "10 September 2026",
    penulis: "Redaksi PORA",
    durasiBaca: "3 menit",
    image: unsplash("photo-1517457373958-b7bdd4587205"),
    ringkasan:
      "Di balik megahnya penyelenggaraan, ribuan relawan bekerja tanpa lelah memastikan setiap detail berjalan lancar.",
    isi: [
      { tipe: "paragraf", teks: "Lebih dari seribu relawan dari berbagai latar belakang turut ambil bagian menyukseskan PORA XV. Mereka tersebar di berbagai pos, mulai dari akomodasi, transportasi, hingga layanan medis." },
      { tipe: "paragraf", teks: "Para relawan menjalani pelatihan singkat sebelum hari-H untuk memastikan pelayanan kepada atlet, ofisial, dan penonton berjalan optimal." },
    ],
  },
  {
    slug: "medali-perdana-cabang-silat",
    judul: "Cabang Pencak Silat Sumbang Kejutan di Hari Kedua",
    kategori: "Bela Diri",
    tanggal: "13 September 2026",
    penulis: "Iqbal M.",
    durasiBaca: "2 menit",
    image: unsplash("photo-1555597673-b21d5c935865"),
    ringkasan:
      "Pesilat-pesilat muda tampil memukau, beberapa di antaranya menumbangkan unggulan di babak awal.",
    isi: [
      { tipe: "paragraf", teks: "Arena Padepokan Bela Diri Lamno menjadi saksi sejumlah kejutan di cabang pencak silat. Beberapa pesilat muda berhasil menumbangkan nama-nama unggulan sejak babak penyisihan." },
      { tipe: "paragraf", teks: "Hasil ini membuat persaingan medali di cabang bela diri semakin terbuka dan sulit diprediksi hingga partai final." },
    ],
  },
];

/** Komentar contoh untuk laman artikel (mendukung balasan bertingkat). */
export interface Komentar {
  id: string;
  nama: string;
  /** Email pengirim — dikumpulkan untuk verifikasi, tidak ditampilkan publik. */
  email?: string;
  waktu: string;
  isi: string;
  suka: number;
  balasan: Komentar[];
}

export const komentarList: Komentar[] = [
  {
    id: "k1",
    nama: "Rahmad Saputra",
    waktu: "2 jam lalu",
    isi: "Bangga lihat Aceh Jaya jadi tuan rumah! Semoga lancar sampai penutupan. 🔥",
    suka: 12,
    balasan: [
      {
        id: "k1r1",
        nama: "Admin PORA",
        waktu: "1 jam lalu",
        isi: "Terima kasih dukungannya, Rahmad! Pantau terus update resminya ya. 🙌",
        suka: 4,
        balasan: [],
      },
    ],
  },
  {
    id: "k2",
    nama: "Cut Maulida",
    waktu: "4 jam lalu",
    isi: "Liputannya lengkap, terima kasih redaksi. Ditunggu update klasemen tiap harinya ya.",
    suka: 7,
    balasan: [],
  },
  {
    id: "k3",
    nama: "Teuku Iqbal",
    waktu: "Kemarin",
    isi: "Hadir langsung di Calang, suasananya luar biasa meriah. Salut buat panitia dan volunteer!",
    suka: 9,
    balasan: [],
  },
];

/* ============================ LIVE STREAMING ============================ */

/**
 * Saklar utama siaran: bersifat tentatif, hanya menyala bila Panitia Besar
 * mengaktifkan mode streaming. Beberapa cabang dapat tayang bersamaan.
 */
export const streamingAktif = true;

/** Satu saluran siaran langsung (satu cabang/pertandingan). */
export interface LiveChannel {
  id: string;
  youtubeId: string;
  cabor: string;
  judul: string;
  venue: string;
  penonton: string;
  matchRef?: string; // id pertandingan simpora; tombol "Tonton Live" di kartu laga
  sorotan?: boolean; // laga sorotan (maks 2) — tampil menonjol di halaman live
}

export const liveChannels: LiveChannel[] = [
  {
    id: "ls1",
    youtubeId: "yeRMYp_hlo8",
    cabor: "Sepak Bola",
    judul: "Semifinal — Aceh Jaya vs Aceh Besar",
    venue: "Stadion Utama Calang",
    penonton: "3.2K",
  },
  {
    id: "ls2",
    youtubeId: "SyqGcOUMBqM",
    cabor: "Bola Voli",
    judul: "Perempat Final — Banda Aceh vs Pidie",
    venue: "GOR Aceh Jaya",
    penonton: "1.4K",
  },
  {
    id: "ls3",
    youtubeId: "amv5fSEVK2I",
    cabor: "Bulu Tangkis",
    judul: "Final Tunggal Putra",
    venue: "GOR Aceh Jaya",
    penonton: "2.1K",
  },
  {
    id: "ls4",
    youtubeId: "QlzJYYrq3W4",
    cabor: "Futsal",
    judul: "Final — Nagan Raya vs Aceh Selatan",
    venue: "GOR Aceh Jaya",
    penonton: "980",
  },
  {
    id: "ls5",
    youtubeId: "yeRMYp_hlo8",
    cabor: "Bola Basket",
    judul: "Semifinal — Kota Langsa vs Aceh Tamiang",
    venue: "GOR Aceh Jaya",
    penonton: "1.1K",
  },
  {
    id: "ls6",
    youtubeId: "SyqGcOUMBqM",
    cabor: "Renang",
    judul: "Final 50m Gaya Bebas Putra",
    venue: "Kolam Renang Krueng Sabee",
    penonton: "760",
  },
  {
    id: "ls7",
    youtubeId: "amv5fSEVK2I",
    cabor: "Pencak Silat",
    judul: "Final Kelas B Putri",
    venue: "Padepokan Bela Diri Lamno",
    penonton: "1.6K",
  },
  {
    id: "ls8",
    youtubeId: "QlzJYYrq3W4",
    cabor: "Panahan",
    judul: "Final Recurve Putra",
    venue: "Lapangan Tembak Teunom",
    penonton: "540",
  },
];

/* ============================ LIVE SKOR ============================ */

export interface Peserta {
  nama: string;
  kontingen: string;
  logo?: string; // lambang kontingen (dari wilayah_kode); FE tampilkan ikon, bukan nama
}

export interface Pertandingan {
  id: string;
  jenis: "tunggal" | "tim";
  cabor: string;
  babak: string;
  status: "live" | "selesai" | "akan";
  /** menit berjalan / jam mulai / "FT". */
  klok: string;
  venue: string;
  a: Peserta;
  b: Peserta;
  skorA: number;
  skorB: number;
  /** Khusus tunggal: rincian skor tiap set/game [a, b]. */
  set?: [number, number][];
  /** Semua peserta. >2 = basis multi-kontingen (ikon saja, nilai disembunyikan). */
  peserta?: Peserta[];
}

export const pertandinganList: Pertandingan[] = [
  {
    id: "m1",
    jenis: "tim",
    cabor: "Sepak Bola",
    babak: "Semifinal",
    status: "live",
    klok: "67'",
    venue: "Stadion Utama Calang",
    a: { nama: "Aceh Jaya", kontingen: "Aceh Jaya" },
    b: { nama: "Aceh Besar", kontingen: "Aceh Besar" },
    skorA: 2,
    skorB: 1,
  },
  {
    id: "m2",
    jenis: "tim",
    cabor: "Bola Voli",
    babak: "Perempat Final",
    status: "live",
    klok: "Set 3",
    venue: "GOR Aceh Jaya",
    a: { nama: "Kota Banda Aceh", kontingen: "Kota Banda Aceh" },
    b: { nama: "Pidie", kontingen: "Pidie" },
    skorA: 2,
    skorB: 0,
    set: [
      [25, 19],
      [25, 22],
      [11, 8],
    ],
  },
  {
    id: "m3",
    jenis: "tunggal",
    cabor: "Bulu Tangkis",
    babak: "Final Tunggal Putra",
    status: "live",
    klok: "Game 2",
    venue: "GOR Aceh Jaya",
    a: { nama: "M. Rizki", kontingen: "Aceh Utara" },
    b: { nama: "Fadhil R.", kontingen: "Kota Lhokseumawe" },
    skorA: 1,
    skorB: 0,
    set: [
      [21, 18],
      [14, 11],
    ],
  },
  {
    id: "m4",
    jenis: "tunggal",
    cabor: "Tenis Meja",
    babak: "Semifinal",
    status: "live",
    klok: "Game 4",
    venue: "GOR Aceh Jaya",
    a: { nama: "Yusuf A.", kontingen: "Bireuen" },
    b: { nama: "Dimas P.", kontingen: "Aceh Tengah" },
    skorA: 2,
    skorB: 1,
    set: [
      [11, 7],
      [9, 11],
      [11, 8],
      [6, 9],
    ],
  },
  {
    id: "m5",
    jenis: "tim",
    cabor: "Bola Basket",
    babak: "Penyisihan Grup B",
    status: "selesai",
    klok: "FT",
    venue: "GOR Aceh Jaya",
    a: { nama: "Kota Langsa", kontingen: "Kota Langsa" },
    b: { nama: "Aceh Tamiang", kontingen: "Aceh Tamiang" },
    skorA: 78,
    skorB: 64,
  },
  {
    id: "m6",
    jenis: "tunggal",
    cabor: "Pencak Silat",
    babak: "Final Kelas B Putri",
    status: "selesai",
    klok: "Selesai",
    venue: "Padepokan Bela Diri Lamno",
    a: { nama: "Salsabila", kontingen: "Aceh Jaya" },
    b: { nama: "Cut Nyak", kontingen: "Aceh Barat" },
    skorA: 5,
    skorB: 3,
  },
  {
    id: "m7",
    jenis: "tim",
    cabor: "Futsal",
    babak: "Final",
    status: "akan",
    klok: "19:30",
    venue: "GOR Aceh Jaya",
    a: { nama: "Nagan Raya", kontingen: "Nagan Raya" },
    b: { nama: "Aceh Selatan", kontingen: "Aceh Selatan" },
    skorA: 0,
    skorB: 0,
  },
  {
    id: "m8",
    jenis: "tunggal",
    cabor: "Panahan",
    babak: "Final Recurve Putra",
    status: "akan",
    klok: "16:00",
    venue: "Lapangan Tembak Teunom",
    a: { nama: "Haikal", kontingen: "Aceh Timur" },
    b: { nama: "Reza F.", kontingen: "Gayo Lues" },
    skorA: 0,
    skorB: 0,
  },
];

/* ============================ DETAIL VENUE ============================ */

/** Info tambahan venue untuk laman viewer (dipadukan dgn venueList di content). */
export const venueDetail: Record<string, { kapasitas: string; deskripsi: string }> = {
  "Stadion Utama Calang": {
    kapasitas: "15.000 penonton",
    deskripsi:
      "Stadion kebanggaan Aceh Jaya dengan rumput standar nasional dan lintasan atletik delapan jalur. Menjadi pusat seremoni pembukaan serta laga puncak sepak bola dan atletik.",
  },
  "GOR Aceh Jaya": {
    kapasitas: "4.500 penonton",
    deskripsi:
      "Gelanggang olahraga serbaguna berpendingin udara, menampung beberapa cabang indoor sekaligus dengan lapangan berstandar pertandingan.",
  },
  "Kolam Renang Krueng Sabee": {
    kapasitas: "2.000 penonton",
    deskripsi:
      "Kolam renang berstandar nasional 50 meter dengan sistem pencatat waktu elektronik dan papan loncat lengkap.",
  },
  "Padepokan Bela Diri Lamno": {
    kapasitas: "1.800 penonton",
    deskripsi:
      "Arena khusus cabang bela diri dengan matras berstandar serta area pemanasan yang luas bagi para atlet.",
  },
  "Lapangan Tembak Teunom": {
    kapasitas: "1.200 penonton",
    deskripsi:
      "Fasilitas menembak dan panahan dengan jarak tembak bersertifikasi dan sistem keamanan berlapis.",
  },
  "Sirkuit Pantai Lhok Geulumpang": {
    kapasitas: "Area terbuka",
    deskripsi:
      "Sirkuit balap sepeda menyusuri garis pantai dengan pemandangan Samudra Hindia, menantang stamina para pembalap.",
  },
};

/* ============================ GALERI ============================ */

export interface Foto {
  id: string;
  src: string;
  caption: string;
  kategori: string;
  /** Orientasi memengaruhi ukuran tile pada layout masonry kustom. */
  orientasi: "potret" | "lanskap" | "kotak";
}

export const galeriFoto: Foto[] = [
  { id: "g1", src: unsplash("photo-1461896836934-ffe607ba8211", 900), caption: "Defile kontingen saat pembukaan", kategori: "Seremoni", orientasi: "lanskap" },
  { id: "g2", src: unsplash("photo-1552674605-db6ffd4facb5", 700), caption: "Sprinter melesat di nomor 100m", kategori: "Atletik", orientasi: "potret" },
  { id: "g3", src: unsplash("photo-1574629810360-7efbbe195018", 800), caption: "Final renang gaya bebas", kategori: "Akuatik", orientasi: "kotak" },
  { id: "g4", src: unsplash("photo-1555597673-b21d5c935865", 700), caption: "Aksi pesilat di atas matras", kategori: "Bela Diri", orientasi: "potret" },
  { id: "g5", src: unsplash("photo-1546519638-68e109498ffc", 900), caption: "Tembakan tiga angka cabang basket", kategori: "Basket", orientasi: "lanskap" },
  { id: "g6", src: unsplash("photo-1571019613454-1cb2f99b2d8b", 800), caption: "Sorak suporter tuan rumah", kategori: "Suporter", orientasi: "kotak" },
  { id: "g7", src: unsplash("photo-1517649763962-0c623066013b", 700), caption: "Smash penentu di partai voli", kategori: "Voli", orientasi: "potret" },
  { id: "g8", src: unsplash("photo-1540747913346-19e32dc3e97e", 900), caption: "Laga sengit di Stadion Calang", kategori: "Sepak Bola", orientasi: "lanskap" },
  { id: "g9", src: unsplash("photo-1593079831268-3381b0db4a77", 800), caption: "Konsentrasi atlet panahan", kategori: "Panahan", orientasi: "kotak" },
  { id: "g10", src: unsplash("photo-1471506480208-91b3a4cc78be", 900), caption: "Pembalap menyusuri pantai", kategori: "Balap Sepeda", orientasi: "lanskap" },
  { id: "g11", src: unsplash("photo-1517466787929-bc90951d0974", 700), caption: "Medali emas perdana tuan rumah", kategori: "Seremoni", orientasi: "potret" },
  { id: "g12", src: unsplash("photo-1577471488278-16eec37ffcc2", 800), caption: "Antusiasme penonton di GOR", kategori: "Suporter", orientasi: "kotak" },
];
