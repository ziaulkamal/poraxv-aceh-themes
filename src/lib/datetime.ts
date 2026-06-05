/**
 * src/lib/datetime.ts — utilitas tanggal/waktu locale id-ID.
 * Aturan WALL-CLOCK: `scheduled_at` simpora2026 di-parse literal (tanpa zona),
 * JANGAN `new Date(ISO)` agar tidak bergeser +7 WIB. Instant nyata (created_at) boleh.
 */

const BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
] as const;

const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Komponen tanggal-waktu hasil parse wall-clock (semua literal, tanpa zona). */
export interface WallClock {
  tahun: number;
  bulan: number; // 1-12
  tanggal: number; // 1-31
  jam: number; // 0-23
  menit: number;
}

/**
 * Parse `Y-M-D[ T]H:M` sebagai waktu dinding (literal), mengabaikan offset zona.
 * Kembalikan null bila format tak dikenali.
 */
export function parseWallClock(input: string | null | undefined): WallClock | null {
  if (!input) return null;
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
  if (!m) return null;
  return {
    tahun: Number(m[1]),
    bulan: Number(m[2]),
    tanggal: Number(m[3]),
    jam: m[4] ? Number(m[4]) : 0,
    menit: m[5] ? Number(m[5]) : 0,
  };
}

/** Tanggal singkat "12 Sep" dari wall-clock simpora. */
export function formatTanggalSingkat(input: string | null | undefined): string {
  const wc = parseWallClock(input);
  if (!wc) return "";
  return `${wc.tanggal} ${BULAN_SINGKAT[wc.bulan - 1] ?? ""}`.trim();
}

/** Jam "09:00" dari wall-clock simpora (literal, tanpa konversi zona). */
export function formatJam(input: string | null | undefined): string {
  const wc = parseWallClock(input);
  if (!wc) return "";
  return `${pad2(wc.jam)}:${pad2(wc.menit)}`;
}

/** Tanggal panjang "12 September 2026" dari wall-clock. */
export function formatTanggalPanjang(input: string | null | undefined): string {
  const wc = parseWallClock(input);
  if (!wc) return "";
  return `${wc.tanggal} ${BULAN_PANJANG[wc.bulan - 1] ?? ""} ${wc.tahun}`.trim();
}

/** Waktu relatif "2 jam lalu" dari instant nyata (created_at). */
export function formatWaktuRelatif(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const menit = Math.round((Date.now() - then) / 60000);
  if (menit < 1) return "Baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.round(jam / 24);
  if (hari < 7) return `${hari} hari lalu`;
  return formatTanggalPanjang(iso);
}
