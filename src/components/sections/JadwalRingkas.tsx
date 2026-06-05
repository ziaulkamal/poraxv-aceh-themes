import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { jadwalList } from "../../data/content";

/** Section cuplikan jadwal: daftar agenda terdekat, stack di mobile & sebaris di sm ke atas. */
export function JadwalRingkas() {
  return (
    <section
      id="jadwal"
      className="relative isolate overflow-hidden bg-gradient-to-b from-page-bg via-page-bg to-surface py-16 dark:bg-page-bg dark:bg-none sm:py-20"
    >
      <SectionGlow tone="hijau" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Agenda Terdekat"
              title="Jadwal Pertandingan"
              description="Sorotan laga dan final pada hari-hari pertama PORA XV."
            />
            <Button variant="outline" size="sm">
              Jadwal Lengkap <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {jadwalList.map((item, i) => (
            <Reveal key={i} delay={i * 80} direction="left">
            <div
              className="flex flex-col gap-3 rounded-md bg-surface p-4 shadow-card transition dark:ring-1 dark:ring-white/10 sm:flex-row sm:items-center sm:gap-5"
            >
              {/* Tanggal & waktu */}
              <div className="flex shrink-0 items-center gap-3 sm:w-32 sm:flex-col sm:items-start sm:gap-0">
                <span className="font-display text-lg font-bold text-merah">
                  {item.tanggal}
                </span>
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  <Clock className="size-3.5" /> {item.waktu}
                </span>
              </div>

              {/* Cabor & acara */}
              <div className="min-w-0 flex-1">
                <Badge tone="outline" className="mb-1">{item.cabor}</Badge>
                <p className="truncate font-semibold text-ink">{item.acara}</p>
              </div>

              {/* Venue */}
              <p className="flex items-center gap-1 text-sm text-ink-soft sm:w-56 sm:justify-end">
                <MapPin className="size-4 shrink-0 text-hijau" />
                <span className="truncate">{item.venue}</span>
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
