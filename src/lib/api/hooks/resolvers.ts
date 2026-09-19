/**
 * src/lib/api/hooks/resolvers.ts â hooks "live-or-fallback".
 * Pakai data API bila tersedia; jatuh ke data statis FE saat backend belum hidup,
 * agar demo tetap tampil (FE-7: UI tak boleh kosong/crash saat API mati).
 */
import type { Berita, Cabor, EventInfo, JadwalItem, MedaliKontingen, Venue } from "../../../types";
import type { Artikel, Foto, Pertandingan } from "../../../data/pages";
import type { Sosial } from "../../../data/content";
import {
  beritaList,
  caborIconByFile,
  caborList as staticCabor,
  event as staticEvent,
  jadwalList as staticJadwal,
  klasemenList as staticKlasemen,
  socials as staticSocials,
  venueList as staticVenue,
} from "../../../data/content";
import { API_CONFIG, DEMO_DATA } from "../config";
import {
  artikelList,
  galeriFoto as staticGaleri,
  liveChannels as staticChannels,
  pertandinganList as staticPertandingan,
  streamingAktif as staticStreamingAktif,
} from "../../../data/pages";
import { SOCIAL_KEYS, settingsToBranding, settingsToSocialHref } from "../adapters/media";
import type { Branding } from "../types";
import brandLogo from "../../../assets/brand/logo.png";
import {
  useArtikelList,
  useBerita,
  useEvent,
  useGaleri,
  useSettings,
  useStreaming,
  useVenueContents,
} from "./media";
import type { StreamingState } from "./media";
import { useCabor, useJadwal, useKlasemen, useLiveSkor, useVenue } from "./sports";

/** Data contoh hanya saat demo/dev — lihat DEMO_DATA di config.ts. */
const DEMO = DEMO_DATA;

function liveOr<T>(data: T[] | undefined, demo: T[]): T[] {
  if (data && data.length > 0) return data;
  return DEMO ? demo : [];
}

/** Identitas event: dari settings cms bila terisi, jika tidak pakai data statis. */
export function useEventInfo(): EventInfo {
  const { data } = useEvent();
  return data?.edisi ? data : staticEvent;
}

/** Branding situs (logo/favicon/slogan/footer) â CMS dgn fallback bawaan. */
export function useBranding(): Branding {
  const { data } = useSettings();
  const event = useEventInfo();
  const b = settingsToBranding(data ?? {});
  return {
    ...b,
    slogan: b.slogan || event.tagline,
    footerDescription:
      b.footerDescription || `${event.namaPanjang} â Tuan Rumah ${event.tuanRumah}.`,
    logoMainLight: b.logoMainLight || brandLogo,
    logoMainDark: b.logoMainDark || brandLogo,
    logoFooterLight: b.logoFooterLight || brandLogo,
    logoFooterDark: b.logoFooterDark || brandLogo,
  };
}

/** Konfigurasi SEO turunan (nama situs, base URL, gambar share default, handle X). */
export interface SeoConfig {
  siteName: string;
  baseUrl: string;
  defaultImage: string;
  twitterHandle: string;
}

export function useSeoConfig(): SeoConfig {
  const { data } = useSettings();
  const branding = useBranding();
  const event = useEventInfo();
  const map = data ?? {};
  const s = (v: unknown): string => (typeof v === "string" ? v : "");
  const baseUrl = (s(map.frontend_url) || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/, "");
  const siteName = s(map.site_title) || event.namaPanjang || "PORA Aceh Jaya";
  const defaultImage = s(map.og_default_image) || branding.logoMainLight || "";
  const x = branding.socials.find((l) => l.platform === "x" || l.platform === "twitter");
  const twitterHandle = x?.url ? "@" + x.url.replace(/\/+$/, "").split("/").pop() : "";
  return { siteName, baseUrl, defaultImage, twitterHandle };
}

/** Kanal sosial: ikon/brand statis dgn href ditimpa setting cms bila tersedia. */
export function useSocialLinks(): Sosial[] {
  const { data } = useSettings();
  if (!data) return staticSocials;
  return staticSocials.map((s) => {
    const href = settingsToSocialHref(data, s.nama as keyof typeof SOCIAL_KEYS);
    return href ? { ...s, href } : s;
  });
}

/** Kartu berita untuk section beranda (live atau statis), opsional dibatasi. */
export function useBeritaCards(limit?: number): Berita[] {
  const { data } = useBerita();
  const list = liveOr(data, beritaList);
  return limit ? list.slice(0, limit) : list;
}

/** Daftar artikel untuk laman berita (live atau statis). */
export function useArtikelCards(): Artikel[] {
  const { data } = useArtikelList();
  return liveOr(data, artikelList);
}

/** Ikon cabor bundel FE per nama â fallback sekunder bila nama file API tak match. */
const caborIconByNama = new Map(staticCabor.map((c) => [c.nama, c.iconSrc]));
/** Foto venue bundel FE per nama â fallback bila enrichment cms belum ada. */
const venueImageByNama = new Map(staticVenue.map((v) => [v.nama, v.image]));

/**
 * Cabor dari simpora. API `icon` hanya nama file (mis. "anggar.png"), jadi:
 *  - iconSrc  = URL penuh ke server Simpora (coba dimuat lebih dulu).
 *  - iconFallback = ikon bundel FE (by nama file, lalu by nama cabor) â dipakai
 *    <img onError> bila file di Simpora belum ada/404. Hybrid: live + fallback mulus.
 */
export function useCaborList(): Cabor[] {
  const { data } = useCabor();
  if (!data || data.length === 0) return staticCabor;
  return data.map((c) => {
    const fallback = caborIconByFile(c.iconSrc) || caborIconByNama.get(c.nama) || "";
    const apiUrl = c.iconSrc ? `${API_CONFIG.simporaIconBase}/${c.iconSrc}` : "";
    return { ...c, iconSrc: apiUrl || fallback, iconFallback: fallback };
  });
}

/**
 * Venue core dari simpora + enrichment CMS VenueContent (gambar & deskripsi)
 * dipetakan via venueRef = id venue. Gambar: CMS â bundel FE â kosong.
 */
export function useVenueList(): Venue[] {
  const { data } = useVenue();
  const { data: contents } = useVenueContents();
  if (!data || data.length === 0) return DEMO ? staticVenue : [];
  const byRef = new Map((contents ?? []).map((c) => [c.venueRef, c]));
  return data.map((v) => {
    const c = v.ref ? byRef.get(v.ref) : undefined;
    return {
      ...v,
      image: c?.imageUrl || v.image || venueImageByNama.get(v.nama) || "",
      deskripsi: c?.description ?? v.deskripsi,
      // galleryVisible default true; sembunyikan galeri bila admin mematikannya.
      galeri: c?.galleryVisible === false ? [] : galeriUrls(c?.gallery),
    };
  });
}

/** Normalisasi gallery CMS (string[] atau {url}[]) â array URL. */
function galeriUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((g) => (typeof g === "string" ? g : (g as { url?: string })?.url ?? ""))
    .filter(Boolean);
}

/** Jadwal terdekat homepage: hanya laga belum selesai (exclude finished). */
export function useJadwalRingkas(limit?: number): JadwalItem[] {
  const { data } = useJadwal({ status: "scheduled,ongoing", per_page: 50 });
  const list = liveOr(data, staticJadwal);
  return limit ? list.slice(0, limit) : list;
}

/** Jadwal keseluruhan (semua status, termasuk selesai) untuk laman jadwal. */
export function useJadwalLengkap(): JadwalItem[] {
  const { data } = useJadwal({ per_page: 200 });
  return liveOr(data, staticJadwal);
}

/** Klasemen medali (live atau statis). */
export function useKlasemenList(): MedaliKontingen[] {
  const { data } = useKlasemen();
  return liveOr(data, staticKlasemen);
}

/** Daftar pertandingan live skor (live atau statis). */
export function useLiveSkorList(): Pertandingan[] {
  const { data } = useLiveSkor();
  return liveOr(data, staticPertandingan);
}

/** Galeri foto (live atau statis). */
export function useGaleriFoto(): Foto[] {
  const { data } = useGaleri();
  return liveOr(data, staticGaleri);
}

/** Status siaran dari CMS; data demo hanya saat DEMO (lihat atas). */
export function useStreamingState(): StreamingState {
  const { data } = useStreaming();
  if (!data) return DEMO ? { enabled: staticStreamingAktif, channels: staticChannels } : { enabled: false, channels: [] };
  return data;
}
