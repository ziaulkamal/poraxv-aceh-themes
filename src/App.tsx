import { PageShell } from "./components/layout/PageShell";
import { Navbar } from "./components/layout/Navbar";
import { SectionNav } from "./components/layout/SectionNav";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Kontingen } from "./components/sections/Kontingen";
import { TentangPora } from "./components/sections/TentangPora";
import { CabangOlahraga } from "./components/sections/CabangOlahraga";
import { JadwalRingkas } from "./components/sections/JadwalRingkas";
import { KlasemenMedali } from "./components/sections/KlasemenMedali";
import { Venue } from "./components/sections/Venue";
import { Berita } from "./components/sections/Berita";

/** Halaman utama PORA — merakit seluruh section beranda di atas page shell. */
export default function App() {
  return (
    <PageShell>
      <Navbar />
      <main>
        <Hero />
        <Kontingen />
        <TentangPora />
        <CabangOlahraga />
        <JadwalRingkas />
        <KlasemenMedali />
        <Venue />
        <Berita />
      </main>
      <Footer />
      <SectionNav />
    </PageShell>
  );
}
