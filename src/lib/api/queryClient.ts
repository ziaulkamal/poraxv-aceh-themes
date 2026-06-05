/** src/lib/api/queryClient.ts — instance & default TanStack Query untuk seluruh app. */
import { QueryClient } from "@tanstack/react-query";

/** staleTime per kelas data (ms): statis lama, konten sedang, live pendek (di-invalidate socket). */
export const STALE = {
  statis: 30 * 60 * 1000, // cabor, venue, pages, settings
  konten: 90 * 1000, // berita/artikel
  live: 15 * 1000, // skor/klasemen
} as const;

/** QueryClient global: retry hemat, refetch saat reconnect, tanpa refetch saat fokus. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE.konten,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
