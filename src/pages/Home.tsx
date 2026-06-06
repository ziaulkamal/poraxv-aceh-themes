import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/sections/Hero";
import { Kontingen } from "../components/sections/Kontingen";
import { TentangPora } from "../components/sections/TentangPora";
import { CabangOlahraga } from "../components/sections/CabangOlahraga";
import { JadwalRingkas } from "../components/sections/JadwalRingkas";
import { KlasemenMedali } from "../components/sections/KlasemenMedali";
import { Venue } from "../components/sections/Venue";
import { Berita } from "../components/sections/Berita";
import { Seo } from "../components/Seo";
import { useEventInfo, useSeoConfig } from "../lib/api/hooks";

/** Landing PORA: merakit seluruh section beranda. */
export function Home() {
  const { state } = useLocation();
  const event = useEventInfo();
  const cfg = useSeoConfig();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: cfg.siteName,
      url: cfg.baseUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: cfg.siteName,
      url: cfg.baseUrl,
      ...(cfg.defaultImage && { logo: cfg.defaultImage }),
      ...(event.tagline && { slogan: event.tagline }),
    },
  ];

  // Datang dari halaman lain dengan minta scroll ke section tertentu.
  useEffect(() => {
    const id = (state as { scrollTo?: string } | null)?.scrollTo;
    if (!id) return;
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, [state]);

  return (
    <>
      <Seo
        description={`${event.namaPanjang} — Tuan Rumah ${event.tuanRumah}. ${event.tagline}.`}
        jsonLd={jsonLd}
      />
      <Hero />
      <Kontingen />
      <TentangPora />
      <CabangOlahraga />
      <JadwalRingkas />
      <KlasemenMedali />
      <Venue />
      <Berita />
    </>
  );
}
