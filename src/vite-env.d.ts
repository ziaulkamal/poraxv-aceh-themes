/// <reference types="vite/client" />

/** Augmentasi env Vite: URL backend integrasi PORA XV (lihat .env.example). */
interface ImportMetaEnv {
  readonly VITE_SIMPORA_API_URL?: string;
  readonly VITE_CMS_API_URL?: string;
  readonly VITE_CMS_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
