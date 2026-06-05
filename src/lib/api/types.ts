/**
 * src/lib/api/types.ts — bentuk MENTAH respons backend (sebelum di-adaptasi ke tipe FE).
 * simpora2026 = snake_case (Eloquent); cms-media = camelCase (Prisma). Banyak field opsional/defensif.
 */

/* ============================ simpora2026 (olahraga) ============================ */

/** Cabang olahraga (`GET /sports`, withCount categories). */
export interface RawSport {
  id: number;
  name: string;
  code: string;
  icon: string | null;
  is_active: boolean;
  categories_count?: number;
}

/** Sub-cabor (`sport_categories`). */
export interface RawSportCategory {
  id: number;
  name: string;
  sport_id: number;
  participant_type?: string;
  sport?: Pick<RawSport, "id" | "name" | "code">;
}

export interface RawWilayah {
  kode: string;
  nama: string;
}

/** Venue core (`GET /venues`, with wilayah + withCount sportCategories). */
export interface RawVenue {
  id: number;
  name: string;
  address: string | null;
  wilayah_kode: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  capacity: number | null;
  is_active: boolean;
  sport_categories_count?: number;
  wilayah?: RawWilayah | null;
  sportCategories?: RawSportCategory[];
}

export interface RawContingent {
  id: number;
  name: string;
  short_name?: string | null;
  wilayah_kode?: string | null;
}

export interface RawMatchParticipant {
  id: number;
  match_id: number;
  contingent_id: number;
  side: "home" | "away" | null;
  contingent?: RawContingent;
}

/** Status pertandingan simpora (lihat GameMatch::STATUS_TRANSITIONS). */
export type RawMatchStatus =
  | "scheduled"
  | "ongoing"
  | "finished"
  | "postponed"
  | "cancelled";

/** Pertandingan (`GET /matches`, paginator). `scheduled_at` = WALL-CLOCK. */
export interface RawMatch {
  id: number;
  match_code: string;
  sport_category_id: number;
  venue_id: number;
  round: string | null;
  stage?: string;
  group_label?: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  status: RawMatchStatus;
  notes: string | null;
  sportCategory?: RawSportCategory;
  venue?: Pick<RawVenue, "id" | "name" | "address">;
  participants?: RawMatchParticipant[];
}

/** Hasil pertandingan (`GET /matches/{id}/result`). `result_data` bentuknya per scoring_type. */
export interface RawMatchResult {
  id: number;
  match_id: number;
  scoring_type: "score" | "time" | "distance" | "point" | "rank" | string;
  result_data: RawResultData;
  notes: string | null;
}

/** result_data: {home,away,sets?} | {result} | {score} | {rank} — semua opsional. */
export interface RawResultData {
  home?: number;
  away?: number;
  sets?: Array<[number, number]> | Array<{ home: number; away: number }>;
  result?: string | number;
  score?: number;
  rank?: number;
  winner_side?: "home" | "away";
  [key: string]: unknown;
}

/** Baris klasemen medali (`GET /leaderboard`). */
export interface RawLeaderboardRow {
  rank: number;
  contingent_id: number;
  contingent_name: string;
  short_name: string | null;
  wilayah_kode: string | null;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

/* ============================ cms-media (konten) ============================ */

/** Map setting publik (`GET /settings/public`) → { key: value }. */
export type RawSettingsMap = Record<string, unknown>;

/** Referensi media cms (gambar). */
export interface RawMediaRef {
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
}

/** Blok isi artikel/halaman kompatibel FE. */
export interface RawContentBlock {
  tipe: "paragraf" | "subjudul" | "kutipan";
  teks: string;
}

/** Artikel cms (`GET /articles`, `/articles/:slug`). */
export interface RawArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body?: RawContentBlock[] | string | null;
  publishedAt: string | null;
  viewCount?: number;
  category?: { name: string } | null;
  author?: { name: string } | null;
  featuredMedia?: RawMediaRef | null;
  tags?: Array<{ name: string }>;
}

/** Halaman statis cms (`GET /pages/:slug`). */
export interface RawPage {
  slug: string;
  title: string;
  body?: RawContentBlock[] | string | null;
}

/** Komentar cms (tree APPROVED). Nama relasi anak bisa beragam → dinormalisasi adapter. */
export interface RawComment {
  id: string;
  authorName: string;
  body: string;
  likeCount?: number;
  isAdmin?: boolean;
  createdAt: string;
  replies?: RawComment[];
  children?: RawComment[];
  balasan?: RawComment[];
}

/** Foto galeri cms (`GET /gallery`). */
export interface RawGalleryPhoto {
  id: string;
  src?: string;
  media?: RawMediaRef;
  caption: string | null;
  category?: string | null;
  orientation?: "POTRET" | "LANSKAP" | "KOTAK" | string | null;
}

/** Satu kanal siaran (`GET /live-streams`). */
export interface RawLiveStream {
  id: string;
  youtubeId: string;
  sportName?: string | null;
  title: string;
  venueName?: string | null;
  viewerCount?: number;
  isLive?: boolean;
}

/** Respons live-streams: master saklar + daftar kanal. */
export interface RawLiveStreamsResponse {
  streaming_enabled: boolean;
  channels: RawLiveStream[];
}

/** Enrichment venue cms (`GET /venue-content/:ref`). */
export interface RawVenueContent {
  venueRef: string;
  description: string | null;
  image?: RawMediaRef | null;
  gallery?: RawMediaRef[];
}
