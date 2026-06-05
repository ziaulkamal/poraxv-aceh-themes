/** src/lib/api/hooks/sports.ts — hooks React Query untuk data olahraga (simpora2026, read-only). */
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Cabor, JadwalItem, MedaliKontingen, Venue } from "../../../types";
import type { Pertandingan } from "../../../data/pages";
import { simporaGet, simporaList } from "../simpora";
import { STALE } from "../queryClient";
import { qk } from "../queryKeys";
import {
  toCabor,
  toJadwalItem,
  toMedaliKontingen,
  toPertandingan,
  toVenue,
} from "../adapters/sports";
import type {
  RawLeaderboardRow,
  RawMatch,
  RawMatchResult,
  RawSport,
  RawVenue,
} from "../types";

/** Daftar cabang olahraga. */
export function useCabor(): UseQueryResult<Cabor[]> {
  return useQuery({
    queryKey: qk.cabor,
    staleTime: STALE.statis,
    queryFn: async () => (await simporaList<RawSport>("/sports")).map(toCabor),
  });
}

/** Daftar venue core. */
export function useVenue(): UseQueryResult<Venue[]> {
  return useQuery({
    queryKey: qk.venue,
    staleTime: STALE.statis,
    queryFn: async () => (await simporaList<RawVenue>("/venues")).map(toVenue),
  });
}

/** Jadwal pertandingan (filter opsional: sport_id, date, venue_id, status). */
export function useJadwal(params?: Record<string, unknown>): UseQueryResult<JadwalItem[]> {
  return useQuery({
    queryKey: qk.jadwal(params),
    staleTime: STALE.konten,
    queryFn: async () => (await simporaList<RawMatch>("/matches", params)).map(toJadwalItem),
  });
}

/** Klasemen perolehan medali per kontingen. */
export function useKlasemen(params?: Record<string, unknown>): UseQueryResult<MedaliKontingen[]> {
  return useQuery({
    queryKey: qk.klasemen,
    staleTime: STALE.live,
    queryFn: async () =>
      (await simporaList<RawLeaderboardRow>("/leaderboard", params)).map(toMedaliKontingen),
  });
}

/**
 * Live skor: pertandingan + hasil. Hasil hanya di-ambil untuk laga ongoing/finished
 * (paralel), karena simpora tak punya endpoint bulk result. Skor live diperbarui socket.
 */
export function useLiveSkor(): UseQueryResult<Pertandingan[]> {
  return useQuery({
    queryKey: qk.liveSkor,
    staleTime: STALE.live,
    queryFn: async () => {
      const matches = await simporaList<RawMatch>("/matches", { per_page: 100 });
      const results = await Promise.all(
        matches.map(async (m) => {
          if (m.status !== "ongoing" && m.status !== "finished") return undefined;
          try {
            const r = await simporaGet<RawMatchResult>(`/matches/${m.id}/result`);
            return r?.result_data;
          } catch {
            return undefined;
          }
        }),
      );
      return matches.map((m, i) => toPertandingan(m, results[i]));
    },
  });
}
