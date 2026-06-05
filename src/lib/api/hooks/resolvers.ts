/**
 * src/lib/api/hooks/resolvers.ts — hooks "live-or-fallback".
 * Pakai data API bila tersedia; jatuh ke data statis FE saat backend belum hidup,
 * agar demo tetap tampil (FE-7: UI tak boleh kosong/crash saat API mati).
 */
import type { Berita, EventInfo } from "../../../types";
import type { Artikel } from "../../../data/pages";
import type { Sosial } from "../../../data/content";
import {
  beritaList,
  event as staticEvent,
  socials as staticSocials,
} from "../../../data/content";
import { artikelList } from "../../../data/pages";
import { SOCIAL_KEYS, settingsToSocialHref } from "../adapters/media";
import { useBerita, useArtikelList, useEvent, useSettings } from "./media";

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
