import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset scroll ke puncak setiap ganti rute — kecuali saat navigasi membawa
 * permintaan scroll ke section tertentu (ditangani halaman tujuan).
 */
export function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if ((state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, state]);

  return null;
}
