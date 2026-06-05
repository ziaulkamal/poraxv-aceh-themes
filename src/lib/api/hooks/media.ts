/** src/lib/api/hooks/media.ts — hooks React Query untuk konten cms-media (read). */
import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Berita, EventInfo } from "../../../types";
import type { Artikel, Foto, Komentar } from "../../../data/pages";
import type { LiveChannel } from "../../../data/pages";
import { cmsGet, cmsList, cmsPost } from "../cms";
import { STALE } from "../queryClient";
import { qk } from "../queryKeys";
import {
  settingsToEvent,
  toArtikel,
  toBerita,
  toFoto,
  toKomentar,
  toLiveChannel,
  toPageBlocks,
} from "../adapters/media";
import type {
  RawArticle,
  RawComment,
  RawContentBlock,
  RawGalleryPhoto,
  RawLiveStreamsResponse,
  RawPage,
  RawSettingsMap,
  RawVenueContent,
} from "../types";

/** Hasil siaran: master saklar + kanal teradaptasi. */
export interface StreamingState {
  enabled: boolean;
  channels: LiveChannel[];
}

/** Map setting publik mentah (SEO/meta/event/sosial). */
export function useSettings(): UseQueryResult<RawSettingsMap> {
  return useQuery({
    queryKey: qk.settings,
    staleTime: STALE.statis,
    queryFn: () => cmsGet<RawSettingsMap>("/settings/public"),
  });
}

/** Identitas event turunan dari settings (berbagi cache dgn useSettings). */
export function useEvent(): UseQueryResult<EventInfo> {
  return useQuery({
    queryKey: qk.settings,
    staleTime: STALE.statis,
    queryFn: () => cmsGet<RawSettingsMap>("/settings/public"),
    select: settingsToEvent,
  });
}

/** Blok isi halaman statis (syarat-ketentuan, kebijakan-cookie). */
export function usePage(slug: string): UseQueryResult<RawContentBlock[]> {
  return useQuery({
    queryKey: qk.page(slug),
    enabled: !!slug,
    staleTime: STALE.statis,
    queryFn: async () => toPageBlocks(await cmsGet<RawPage>(`/pages/${slug}`)),
  });
}

/** Daftar berita (artikel published) → kartu Berita. */
export function useBerita(params?: Record<string, unknown>): UseQueryResult<Berita[]> {
  return useQuery({
    queryKey: qk.berita(params),
    staleTime: STALE.konten,
    queryFn: async () =>
      (await cmsList<RawArticle>("/articles", { status: "published", ...params })).map(toBerita),
  });
}

/** Daftar artikel (kartu) untuk laman berita — body kosong, dipakai untuk grid. */
export function useArtikelList(params?: Record<string, unknown>): UseQueryResult<Artikel[]> {
  return useQuery({
    queryKey: qk.artikelList(params),
    staleTime: STALE.konten,
    queryFn: async () =>
      (await cmsList<RawArticle>("/articles", { status: "published", ...params })).map(toArtikel),
  });
}

/** Satu artikel lengkap by slug. */
export function useArtikel(slug: string): UseQueryResult<Artikel> {
  return useQuery({
    queryKey: qk.artikel(slug),
    enabled: !!slug,
    staleTime: STALE.konten,
    queryFn: async () => toArtikel(await cmsGet<RawArticle>(`/articles/${slug}`)),
  });
}

/** Pohon komentar APPROVED untuk sebuah artikel. */
export function useKomentar(slug: string): UseQueryResult<Komentar[]> {
  return useQuery({
    queryKey: qk.komentar(slug),
    enabled: !!slug,
    staleTime: STALE.konten,
    queryFn: async () =>
      (await cmsList<RawComment>(`/articles/${slug}/comments`)).map(toKomentar),
  });
}

/** Galeri foto publik. */
export function useGaleri(params?: Record<string, unknown>): UseQueryResult<Foto[]> {
  return useQuery({
    queryKey: qk.galeri(params),
    staleTime: STALE.konten,
    queryFn: async () => (await cmsList<RawGalleryPhoto>("/gallery", params)).map(toFoto),
  });
}

/** Siaran langsung: saklar + daftar kanal. */
export function useStreaming(): UseQueryResult<StreamingState> {
  return useQuery({
    queryKey: qk.streaming,
    staleTime: STALE.konten,
    queryFn: () => cmsGet<RawLiveStreamsResponse>("/live-streams"),
    select: (res) => ({
      enabled: !!res.streaming_enabled,
      channels: (res.channels ?? []).map(toLiveChannel),
    }),
  });
}

/** Enrichment venue (deskripsi + foto) by ref venue simpora. */
export function useVenueContent(ref: string): UseQueryResult<RawVenueContent> {
  return useQuery({
    queryKey: qk.venueContent(ref),
    enabled: !!ref,
    staleTime: STALE.statis,
    queryFn: () => cmsGet<RawVenueContent>(`/venue-content/${encodeURIComponent(ref)}`),
  });
}

/* --------------------------- Mutasi (tulis publik) --------------------------- */

/** Payload kirim komentar publik (parentId untuk balasan). */
export interface KirimKomentarInput {
  authorName: string;
  authorEmail: string;
  body: string;
  parentId?: string;
}

/** Kirim komentar (status PENDING moderasi) untuk sebuah artikel. */
export function useKirimKomentar(slug: string): UseMutationResult<unknown, Error, KirimKomentarInput> {
  return useMutation({
    mutationFn: (input: KirimKomentarInput) => cmsPost(`/articles/${slug}/comments`, input),
  });
}

/** Suka satu komentar (dedup device di backend). */
export function useSukaKomentar(): UseMutationResult<unknown, Error, string> {
  return useMutation({
    mutationFn: (id: string) => cmsPost(`/comments/${id}/like`),
  });
}

/** Payload kirim pesan kontak (`website` = honeypot, harus kosong). */
export interface KirimKontakInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

/** Kirim pesan kontak ke inbox cms. */
export function useKirimKontak(): UseMutationResult<unknown, Error, KirimKontakInput> {
  return useMutation({
    mutationFn: (input: KirimKontakInput) => cmsPost("/contact", input),
  });
}
