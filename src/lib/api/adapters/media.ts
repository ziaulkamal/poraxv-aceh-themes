/**
 * src/lib/api/adapters/media.ts — petakan respons MENTAH cms-media → tipe FE.
 * Konten (settings, artikel, halaman, komentar, galeri, siaran, enrichment venue).
 */
import type { Berita, EventInfo } from "../../../types";
import type { Artikel, Foto, Komentar, LiveChannel } from "../../../data/pages";
import { formatTanggalPanjang, formatWaktuRelatif } from "../../datetime";
import type {
  RawArticle,
  RawComment,
  RawContentBlock,
  RawContentBody,
  RawGalleryPhoto,
  RawLiveStream,
  RawPage,
  RawSettingsMap,
  RawTiptapDoc,
} from "../types";

const str = (v: unknown): string => (v == null ? "" : String(v));

/** Map setting publik → identitas event (Hero/Footer/Countdown). */
export function settingsToEvent(map: RawSettingsMap): EventInfo {
  return {
    edisi: str(map.event_edisi),
    namaPanjang: str(map.event_nama_panjang),
    tuanRumah: str(map.event_tuan_rumah),
    kota: str(map.event_kota),
    tanggalMulai: str(map.event_tanggal_mulai),
    tanggalSelesai: str(map.event_tanggal_selesai),
    tagline: str(map.event_tagline),
  };
}

/** Platform sosial yang didukung → key setting cms. */
export const SOCIAL_KEYS = {
  Facebook: "social_facebook",
  Instagram: "social_instagram",
  Threads: "social_threads",
  TikTok: "social_tiktok",
  X: "social_x",
} as const;

/** Ambil href sosial dari setting (per platform); kosong bila tak diset. */
export function settingsToSocialHref(map: RawSettingsMap, platform: keyof typeof SOCIAL_KEYS): string {
  return str(map[SOCIAL_KEYS[platform]]);
}

/** Node TipTap → tipe blok FE (selaras dgn cms-media `toContentBlocks`). */
const TIPTAP_TIPE: Record<string, RawContentBlock["tipe"]> = {
  paragraph: "paragraf",
  heading: "subjudul",
  blockquote: "kutipan",
};

/** Rangkai teks dari leaf node TipTap secara rekursif. */
function extractTeks(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: unknown; content?: unknown };
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.content)) return n.content.map(extractTeks).join("");
  return "";
}

/** Dokumen TipTap (`{ content:[...] }`) → blok FE; abaikan node tak terdukung. */
function tiptapToBlocks(doc: RawTiptapDoc): RawContentBlock[] {
  const out: RawContentBlock[] = [];
  for (const node of doc.content ?? []) {
    if (!node || typeof node !== "object") continue;
    const tipe = TIPTAP_TIPE[String((node as { type?: unknown }).type)];
    if (!tipe) continue;
    const teks = extractTeks(node).trim();
    if (teks) out.push({ tipe, teks });
  }
  return out;
}

/** Normalkan `body` (blok FE jadi | string | dokumen TipTap) → daftar blok FE. */
function normalizeBlocks(body: RawContentBody | undefined): RawContentBlock[] {
  if (Array.isArray(body)) {
    return body.filter((b) => b && typeof b.teks === "string");
  }
  if (typeof body === "string" && body.trim()) {
    return body
      .split(/\n{2,}/)
      .map((teks) => ({ tipe: "paragraf" as const, teks: teks.trim() }))
      .filter((b) => b.teks);
  }
  if (body && typeof body === "object" && Array.isArray(body.content)) {
    return tiptapToBlocks(body);
  }
  return [];
}

/** Pilih blok isi: utamakan `blocks` backend, jatuh ke normalisasi `body`. */
function pilihBlocks(blocks: RawContentBlock[] | undefined, body: RawContentBody | undefined): RawContentBlock[] {
  return blocks && blocks.length > 0 ? blocks : normalizeBlocks(body);
}

/** Estimasi durasi baca dari blok isi (200 kata/menit, minimal 1). */
function hitungDurasiBaca(blocks: RawContentBlock[]): string {
  const kata = blocks.reduce((n, b) => n + b.teks.trim().split(/\s+/).length, 0);
  return `${Math.max(1, Math.round(kata / 200))} menit`;
}

/** Artikel cms → kartu Berita. */
export function toBerita(raw: RawArticle): Berita {
  return {
    slug: raw.slug,
    judul: raw.title,
    ringkasan: raw.excerpt ?? "",
    kategori: raw.category?.name ?? "",
    tanggal: formatTanggalPanjang(raw.publishedAt),
    image: raw.featuredMedia?.url ?? "",
  };
}

/** Artikel cms → Artikel lengkap (isi blok + durasi baca terhitung). */
export function toArtikel(raw: RawArticle): Artikel {
  const isi = pilihBlocks(raw.blocks, raw.body);
  return {
    slug: raw.slug,
    judul: raw.title,
    kategori: raw.category?.name ?? "",
    tanggal: formatTanggalPanjang(raw.publishedAt),
    penulis: raw.author?.name ?? "Redaksi PORA",
    durasiBaca: hitungDurasiBaca(isi),
    image: raw.featuredMedia?.url ?? "",
    ringkasan: raw.excerpt ?? "",
    isi,
  };
}

/** Halaman statis cms → daftar blok isi. */
export function toPageBlocks(raw: RawPage): RawContentBlock[] {
  return pilihBlocks(raw.blocks, raw.body);
}

/** Komentar cms (rekursif) → Komentar FE; email TIDAK dibalikan API. */
export function toKomentar(raw: RawComment): Komentar {
  const anak = raw.replies ?? raw.children ?? raw.balasan ?? [];
  return {
    id: raw.id,
    nama: raw.authorName,
    waktu: formatWaktuRelatif(raw.createdAt),
    isi: raw.body,
    suka: raw.likeCount ?? 0,
    balasan: anak.map(toKomentar),
  };
}

/** Orientasi foto: dari enum cms, fallback rasio dimensi media. */
function toOrientasi(raw: RawGalleryPhoto): Foto["orientasi"] {
  const o = (raw.orientation ?? "").toString().toUpperCase();
  if (o === "POTRET") return "potret";
  if (o === "LANSKAP") return "lanskap";
  if (o === "KOTAK") return "kotak";
  const w = raw.media?.width ?? 0;
  const h = raw.media?.height ?? 0;
  if (w && h) return w > h ? "lanskap" : w < h ? "potret" : "kotak";
  return "lanskap";
}

/** Foto galeri cms → Foto FE. */
export function toFoto(raw: RawGalleryPhoto): Foto {
  return {
    id: raw.id,
    src: raw.src ?? raw.media?.url ?? "",
    caption: raw.caption ?? "",
    kategori: raw.category ?? "",
    orientasi: toOrientasi(raw),
  };
}

/** Angka penonton → ringkas "3.2K". */
function formatPenonton(n: number | undefined): string {
  if (!n || n < 1000) return String(n ?? 0);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
}

/** Kanal siaran cms → LiveChannel FE. */
export function toLiveChannel(raw: RawLiveStream): LiveChannel {
  return {
    id: raw.id,
    youtubeId: raw.youtubeId,
    cabor: raw.cabor ?? "",
    judul: raw.judul,
    venue: raw.venue ?? "",
    penonton: formatPenonton(raw.penonton),
    matchRef: raw.matchRef ?? undefined,
    sorotan: raw.sorotan ?? false,
  };
}
