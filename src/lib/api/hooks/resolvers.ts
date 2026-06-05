/**
 * src/lib/api/hooks/resolvers.ts — hooks "live-or-fallback".
 * Pakai data API bila tersedia; jatuh ke data statis FE saat backend belum hidup,
 * agar demo tetap tampil (FE-7: UI tak boleh kosong/crash saat API mati).
 */
import type { Berita, Cabor, EventInfo, JadwalItem, MedaliKontingen, Venue } from "../../../types";
import type { Artikel, Pertandingan } from "../../../data/pages";
import type { Sosial } from "../../../data/content";
import {
  beritaList,
  caborList as staticCabor,
  event as staticEvent,
  jadwalList as staticJadwal,
  klasemenList as staticKlasemen,
  socials as staticSocials,
  venueList as staticVenue,
} from "../../../data/content";
import { artikelList, pertandinganList as staticPertandingan } from "../../../data/pages";
import { SOCIAL_KEYS, settingsToSocialHref } from "../adapters/media";
import { useBerita, useArtikelList, useEvent, useSettings } from "./media";
import { useCabor, useJadwal, useKlasemen, useLiveSkor, useVenue } from "./sports";

/** Identitas event: dari settings cms bila terisi, jika tidak pakai data statis. */
export function useEventInfo(): EventInfo {
  const { data } = useEvent();
  return data?.edisi ? data : staticEvent;
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
  const list = data && data.length > 0 ? data : beritaList;
  return limit ? list.slice(0, limit) : list;
}

/** Daftar artikel untuk laman berita (live atau statis). */
export function useArtikelCards(): Artikel[] {
  const { data } = useArtikelList();
  return data && data.length > 0 ? data : artikelList;
}

/** Ikon cabor bundel FE per nama — fallback bila maskot API kosong. */
const caborIconByNama = new Map(staticCabor.map((c) => [c.nama, c.iconSrc]));
/** Foto venue bundel FE per nama — fallback bila enrichment cms belum ada. */
const venueImageByNama = new Map(staticVenue.map((v) => [v.nama, v.image]));

/** Cabor dari simpora; iconSrc jatuh ke ikon bundel FE bila maskot API kosong. */
export function useCaborList(): Cabor[] {
  const { data } = useCabor();
  if (!data || data.length === 0) return staticCabor;
  return data.map((c) => (c.iconSrc ? c : { ...c, iconSrc: caborIconByNama.get(c.nama) ?? "" }));
}

/** Venue core dari simpora; image jatuh ke foto bundel FE bila belum di-enrich. */
export function useVenueList(): Venue[] {
  const { data } = useVenue();
  if (!data || data.length === 0) return staticVenue;
  return data.map((v) => (v.image ? v : { ...v, image: venueImageByNama.get(v.nama) ?? "" }));
}

/** Jadwal terdekat (live atau statis), opsional dibatasi jumlahnya. */
export function useJadwalRingkas(limit?: number): JadwalItem[] {
  const { data } = useJadwal();
  const list = data && data.length > 0 ? data : staticJadwal;
  return limit ? list.slice(0, limit) : list;
}

/** Klasemen medali (live atau statis). */
export function useKlasemenList(): MedaliKontingen[] {
  const { data } = useKlasemen();
  return data && data.length > 0 ? data : staticKlasemen;
}

/** Daftar pertandingan live skor (live atau statis). */
export function useLiveSkorList(): Pertandingan[] {
  const { data } = useLiveSkor();
  return data && data.length > 0 ? data : staticPertandingan;
}
