import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { BeritaCard } from "./BeritaCard";
import { useBeritaCards } from "../../lib/api/hooks";

/** Section berita: kabar terbaru seputar event dalam grid responsif tiga kolom. */
export function Berita() {
  const beritaList = useBeritaCards(3);
  return (
    <section
      id="berita"
      className="relative isolate overflow-hidden bg-surface py-16 dark:bg-page-bg sm:py-20"
    >
      <SectionGlow tone="hijau" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Kabar Terbaru"
            title="Berita & Informasi"
            description="Ikuti perkembangan terkini menjelang dan selama gelaran PORA XV di Aceh Jaya."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {beritaList.map((berita, i) => (
            <Reveal key={berita.judul} delay={i * 120} direction="up">
              <BeritaCard item={berita} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link to="/berita" className={button({ variant: "outline" })}>
            Lihat Semua Berita
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
