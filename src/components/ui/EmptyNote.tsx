import { cn } from "../../lib/cn";

/**
 * Keterangan "belum ada data" untuk section/halaman yang daftarnya kosong.
 * Di produksi data contoh tidak lagi dipakai (lihat resolvers.ts), jadi
 * setiap daftar dari API harus punya tampilan kosong yang wajar.
 */
export function EmptyNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("rounded-2xl border border-dashed border-ink/10 py-12 text-center text-sm text-ink-muted", className)}>
      {children}
    </p>
  );
}
