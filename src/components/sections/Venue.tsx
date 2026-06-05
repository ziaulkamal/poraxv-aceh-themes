import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { VenueCard } from "./VenueCard";
import { useVenueList } from "../../lib/api/hooks";

/** Section venue: galeri arena pertandingan di Aceh Jaya dalam grid auto-fit. */
export function Venue() {
  const venueList = useVenueList();
  return (
    <section
      id="venue"
      className="relative isolate overflow-hidden bg-gradient-to-b from-page-bg via-page-bg to-surface py-16 dark:bg-page-bg dark:bg-none sm:py-20"
    >
      <SectionGlow tone="emas" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Lokasi Pertandingan"
            title="Venue & Arena"
            description="Tersebar di Calang dan sekitarnya, arena-arena ini siap menjadi saksi perjuangan para atlet."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {venueList.map((venue, i) => (
            <Reveal key={venue.nama} delay={(i % 3) * 110} direction="up">
              <VenueCard item={venue} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link to="/venue" className={button({ variant: "outline" })}>
            Jelajahi Semua Venue
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
