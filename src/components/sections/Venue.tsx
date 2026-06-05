import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { VenueCard } from "./VenueCard";
import { venueList } from "../../data/content";

/** Section venue: galeri arena pertandingan di Aceh Jaya dalam grid auto-fit. */
export function Venue() {
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
      </Container>
    </section>
  );
}
