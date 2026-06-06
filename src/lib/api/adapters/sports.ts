/**
 * src/lib/api/adapters/sports.ts — petakan respons MENTAH simpora2026 → tipe FE.
 * Wall-clock untuk jadwal/skor (lihat datetime.ts). Tak ada tulis: read-only.
 */
import type { Cabor, JadwalItem, MedaliKontingen, Venue } from "../../../types";
import type { Pertandingan, Peserta } from "../../../data/pages";
import { formatJam, formatTanggalSingkat } from "../../datetime";
import { logoKontingen } from "../../../data/kontingen";
import type {
  RawLeaderboardRow,
  RawMatch,
  RawMatchParticipant,
  RawMatchStatus,
  RawResultData,
  RawSport,
  RawVenue,
} from "../types";

/** Sport → Cabor. `iconSrc` pakai maskot API; fallback bundel FE ditangani saat wiring. */
export function toCabor(raw: RawSport): Cabor {
  return {
    nama: raw.name,
    iconSrc: raw.icon ?? "",
    jumlahNomor: raw.categories_count ?? 0,
  };
}

/** Venue core → Venue FE. `image` di-enrich dari cms VenueContent saat wiring. */
export function toVenue(raw: RawVenue): Venue {
  const cabor = raw.sportCategories?.map((c) => c.sport?.name ?? c.name) ?? [];
  return {
    nama: raw.name,
    lokasi: raw.address ?? raw.wilayah?.nama ?? "",
    cabor: [...new Set(cabor)],
    image: "",
    ref: String(raw.id),
  };
}

/** Ikon kontingen peserta (lewati yang tak punya lambang); nama hanya utk alt. */
function toKontingenIcons(participants: RawMatch["participants"]): JadwalItem["kontingen"] {
  return (participants ?? [])
    .map((p) => ({
      nama: p.contingent?.short_name ?? p.contingent?.name ?? "",
      logo: logoKontingen(p.contingent?.wilayah_kode),
    }))
    .filter((k) => k.logo);
}

/** Pertandingan → satu baris JadwalItem (waktu literal wall-clock). */
export function toJadwalItem(raw: RawMatch): JadwalItem {
  const cabor = raw.sportCategory?.sport?.name ?? raw.sportCategory?.name ?? "";
  return {
    tanggal: formatTanggalSingkat(raw.scheduled_at),
    waktu: formatJam(raw.scheduled_at),
    cabor,
    acara: raw.round ?? raw.sportCategory?.name ?? raw.match_code,
    venue: raw.venue?.name ?? "",
    status: toStatus(raw.status),
    kode: raw.match_code,
    kontingen: toKontingenIcons(raw.participants),
  };
}

/** Baris leaderboard → MedaliKontingen. */
export function toMedaliKontingen(raw: RawLeaderboardRow): MedaliKontingen {
  return {
    peringkat: raw.rank,
    kontingen: raw.contingent_name,
    emas: raw.gold,
    perak: raw.silver,
    perunggu: raw.bronze,
  };
}

/** Status simpora → status kartu FE. */
function toStatus(status: RawMatchStatus): Pertandingan["status"] {
  if (status === "ongoing") return "live";
  if (status === "finished") return "selesai";
  return "akan";
}

/** Label jam/klok kartu sesuai status. */
function toKlok(raw: RawMatch): string {
  if (raw.status === "ongoing") return "LIVE";
  if (raw.status === "finished") return "FT";
  return formatJam(raw.scheduled_at);
}

/** Satu peserta → Peserta FE; ikon kontingen dari wilayah_kode (tanpa tampil nama). */
function toPeserta(p: RawMatchParticipant | undefined): Peserta {
  const nama = p?.contingent?.name ?? "TBD";
  return {
    nama,
    kontingen: p?.contingent?.name ?? nama,
    logo: logoKontingen(p?.contingent?.wilayah_kode),
  };
}

/** Rincian set/game [a,b] bila ada (toleran dua bentuk payload). */
function toSets(data: RawResultData | undefined): Array<[number, number]> | undefined {
  const sets = data?.sets;
  if (!Array.isArray(sets) || sets.length === 0) return undefined;
  return sets.map((s): [number, number] =>
    Array.isArray(s) ? [s[0], s[1]] : [s.home, s.away],
  );
}

/** Pertandingan (+ hasil opsional) → kartu Pertandingan FE. */
export function toPertandingan(raw: RawMatch, result?: RawResultData): Pertandingan {
  const ptype = raw.sportCategory?.participant_type ?? "";
  const jenis: Pertandingan["jenis"] = /individu|tunggal|single/i.test(ptype) ? "tunggal" : "tim";
  return {
    id: String(raw.id),
    jenis,
    cabor: raw.sportCategory?.sport?.name ?? raw.sportCategory?.name ?? "",
    babak: raw.round ?? raw.sportCategory?.name ?? "",
    status: toStatus(raw.status),
    klok: toKlok(raw),
    venue: raw.venue?.name ?? "",
    a: toPeserta(raw.participants?.[0]),
    b: toPeserta(raw.participants?.[1]),
    skorA: Number(result?.home ?? 0),
    skorB: Number(result?.away ?? 0),
    set: toSets(result),
    peserta: (raw.participants ?? []).map(toPeserta),
  };
}
