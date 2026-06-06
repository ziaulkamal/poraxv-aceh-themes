import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { ScrollToTop } from "./ScrollToTop";
import { CookieConsent } from "./CookieConsent";
import { useRealtimeSync } from "../../lib/api/hooks";

/** Kerangka bersama semua rute: navbar + konten + footer. */
export function AppLayout() {
  const isHome = useLocation().pathname === "/";
  // Satu langganan real-time global (skor/klasemen/siaran) — dormant tanpa gateway.
  useRealtimeSync();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* Stepper antar-section hanya relevan di landing. */}
      {isHome && <SectionNav />}
      <CookieConsent />
    </>
  );
}
