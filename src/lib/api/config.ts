/** src/lib/api/config.ts — sumber tunggal URL backend (dari Vite env, fallback localhost dev). */

/** Buang trailing slash agar penggabungan path konsisten. */
const trim = (url: string): string => url.replace(/\/+$/, "");

const simporaUrl = trim(import.meta.env.VITE_SIMPORA_API_URL ?? "http://localhost:8000/api/v1");

/** URL kedua backend + gateway socket; isi via `.env` (lihat .env.example). */
export const API_CONFIG = {
  simporaUrl,
  cmsUrl: trim(import.meta.env.VITE_CMS_API_URL ?? "http://localhost:3000/api/v1"),
  cmsWsUrl: trim(import.meta.env.VITE_CMS_WS_URL ?? "http://localhost:3000"),
  // Base URL file ikon (maskot) cabor. Field `icon` API hanya nama file, file fisik
  // disajikan app admin Simpora di /images/maskot (host bisa beda dari API!).
  // WAJIB di-set via VITE_SIMPORA_ICON_BASE; default origin API hanya tebakan dev.
  // Bila 404, FE jatuh ke ikon bundel (lihat useCaborList).
  simporaIconBase: trim(
    import.meta.env.VITE_SIMPORA_ICON_BASE ??
      `${simporaUrl.replace(/\/api\/v\d+$/, "")}/images/maskot`
  ),
  // Real-time hanya aktif bila WS di-set eksplisit (gateway tersedia) — hindari retry sia-sia.
  wsEnabled: !!import.meta.env.VITE_CMS_WS_URL,
} as const;
