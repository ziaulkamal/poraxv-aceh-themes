import type { ReactNode } from "react";

/** Bingkai aplikasi: latar surface penuh; tiap section mengatur warna latarnya sendiri. */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen overflow-x-hidden bg-surface">{children}</div>;
}
