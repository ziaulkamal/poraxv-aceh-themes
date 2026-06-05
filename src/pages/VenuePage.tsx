import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Users, Play, Pause } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/cn";
import { useVenueList } from "../lib/api/hooks";
import { venueDetail } from "../data/pages";

/** Laman venue: viewer besar yang bisa dikontrol — geser, autoplay, thumbnail. */
export function VenuePage() {
  const venueList = useVenueList();
  const [aktif, setAktif] = useState(0);
  const [main, setMain] = useState(true); // autoplay

  const total = venueList.length;
  const next = useCallback(() => setAktif((i) => (i + 1) % total), [total]);
  const prev = () => setAktif((i) => (i - 1 + total) % total);

  // Autoplay tiap 5 detik, jeda saat pengguna menonaktifkan.
  useEffect(() => {
    if (!main) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [main, next]);

  // Navigasi keyboard panah kiri/kanan.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  const venue = venueList[aktif];
  const detail = venueDetail[venue.nama];

  return (
    <>
      <PageHeader
        breadcrumb="Venue"
        eyebrow="Lokasi Pertandingan"
        title="Venue & Arena"
        description="Jelajahi arena-arena yang menjadi panggung perjuangan para atlet PORA XV. Geser untuk melihat lebih dekat."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Viewer utama */}
          <div className="relative overflow-hidden rounded-xl shadow-panel ring-1 ring-ink/5 dark:ring-white/10">
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              {venueList.map((v, i) => (
                <img
                  key={v.nama}
                  src={v.image}
                  alt={v.nama}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    i === aktif ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

              {/* Info overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-surface sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">{venue.nama}</h2>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-surface/80">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-emas" /> {venue.lokasi}</span>
                  {detail && <span className="inline-flex items-center gap-1.5"><Users className="size-4 text-emas" /> {detail.kapasitas}</span>}
                </div>
                {detail && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface/70">{detail.deskripsi}</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {venue.cabor.map((c) => (
                    <Badge key={c} tone="soft">{c}</Badge>
                  ))}
                </div>
              </div>

              {/* Kontrol panah */}
              <button
                type="button"
                onClick={prev}
                aria-label="Sebelumnya"
                className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink shadow-card backdrop-blur transition hover:bg-surface"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Berikutnya"
                className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink shadow-card backdrop-blur transition hover:bg-surface"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Tombol autoplay + counter */}
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMain((v) => !v)}
                  aria-label={main ? "Jeda" : "Putar"}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-surface-dark/60 text-surface backdrop-blur transition hover:bg-surface-dark/80"
                >
                  {main ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <span className="rounded-pill bg-surface-dark/60 px-3 py-1.5 text-xs font-semibold text-surface backdrop-blur">
                  {aktif + 1} / {total}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {venueList.map((v, i) => (
              <button
                key={v.nama}
                type="button"
                onClick={() => setAktif(i)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-md ring-2 transition",
                  i === aktif ? "ring-merah" : "ring-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img src={v.image} alt={v.nama} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
