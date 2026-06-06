import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { ScrollToTop } from "./ScrollToTop";
import { CookieConsent } from "./CookieConsent";
import { useBranding, useRealtimeSync } from "../../lib/api/hooks";

/** Kerangka bersama semua rute: navbar + konten + footer. */
export function AppLayout() {
  const isHome = useLocation().pathname === "/";
  // Satu langganan real-time global (skor/klasemen/siaran) — dormant tanpa gateway.
  useRealtimeSync();

  // Favicon dari CMS (branding) — set runtime bila diatur.
  const { favicon } = useBranding();
  useEffect(() => {
    if (!favicon) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = favicon;
  }, [favicon]);

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
