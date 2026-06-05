/** src/lib/api/config.ts — sumber tunggal URL backend (dari Vite env, fallback localhost dev). */

/** Buang trailing slash agar penggabungan path konsisten. */
const trim = (url: string): string => url.replace(/\/+$/, "");

/** URL kedua backend + gateway socket; isi via `.env` (lihat .env.example). */
export const API_CONFIG = {
  simporaUrl: trim(import.meta.env.VITE_SIMPORA_API_URL ?? "http://localhost:8000/api/v1"),
  cmsUrl: trim(import.meta.env.VITE_CMS_API_URL ?? "http://localhost:3000/api/v1"),
  cmsWsUrl: trim(import.meta.env.VITE_CMS_WS_URL ?? "http://localhost:3000"),
} as const;
