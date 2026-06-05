/** src/lib/api/queryKeys.ts — kunci query TanStack terpusat (dipakai hooks & listener socket). */

/** Factory kunci query; konsisten agar invalidasi dari socket tepat sasaran. */
export const qk = {
  settings: ["settings"] as const,
  page: (slug: string) => ["page", slug] as const,
  berita: (params?: Record<string, unknown>) => ["berita", params ?? {}] as const,
  artikel: (slug: string) => ["artikel", slug] as const,
  komentar: (slug: string) => ["komentar", slug] as const,
  cabor: ["cabor"] as const,
  venue: ["venue"] as const,
  venueContent: (ref: string) => ["venue-content", ref] as const,
  jadwal: (params?: Record<string, unknown>) => ["jadwal", params ?? {}] as const,
  klasemen: ["leaderboard"] as const,
  liveSkor: ["matches", "live"] as const,
  match: (id: string) => ["match", id] as const,
  streaming: ["streaming"] as const,
  galeri: (params?: Record<string, unknown>) => ["galeri", params ?? {}] as const,
} as const;
