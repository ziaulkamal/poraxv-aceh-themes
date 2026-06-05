import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { ScrollToTop } from "./ScrollToTop";
import { CookieConsent } from "./CookieConsent";

/** Kerangka bersama semua rute: navbar + konten + footer. */
export function AppLayout() {
  const isHome = useLocation().pathname === "/";
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
