import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Grid3x3, LayoutGrid } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Seo } from "../components/Seo";
import { PageHeader } from "../components/ui/PageHeader";
import { cn } from "../lib/cn";
import type { Foto } from "../data/pages";
import { useGaleriFoto } from "../lib/api/hooks";

const aspekKustom: Record<Foto["orientasi"], string> = {
  potret: "aspect-[3/4]",
  lanskap: "aspect-[4/3]",
  kotak: "aspect-square",
};

/** Lightbox sederhana: foto besar + caption, geser kiri/kanan, tutup. */
function Lightbox({
  foto,
  onClose,
  onPrev,
  onNext,
}: {
  foto: Foto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-surface/10 text-surface transition hover:bg-surface/20"
      >
        <X className="size-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Sebelumnya"
        className="absolute left-4 inline-flex size-11 items-center justify-center rounded-full bg-surface/10 text-surface transition hover:bg-surface/20"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Berikutnya"
        className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/10 text-surface transition hover:bg-surface/20"
      >
        <ChevronRight className="size-6" />
      </button>

      <figure className="max-h-[88vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {foto.src && (
          <img src={foto.src} alt={foto.caption} className="max-h-[78vh] w-auto rounded-lg object-contain" />
        )}
        <figcaption className="mt-3 text-center text-surface">
          <span className="text-xs font-semibold uppercase tracking-widest text-emas">{foto.kategori}</span>
          <p className="mt-1 text-sm text-surface/80">{foto.caption}</p>
        </figcaption>
      </figure>
    </div>
  );
}

/** Laman galeri dgn dua konsep: feed ala Instagram atau mosaic kustom PORA. */
export function GaleriPage() {
  const galeriFoto = useGaleriFoto();
  const [konsep, setKonsep] = useState<"ig" | "kustom">("kustom");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const buka = (i: number) => setLightbox(i);
  const tutup = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i === null ? i : (i - 1 + galeriFoto.length) % galeriFoto.length));
  const next = () => setLightbox((i) => (i === null ? i : (i + 1) % galeriFoto.length));

  return (
    <>
      <Seo title="Galeri Foto" description="Dokumentasi momen-momen terbaik PORA Aceh Jaya." />
      <PageHeader
        breadcrumb="Galeri"
        eyebrow="Dokumentasi"
        title="Galeri Foto"
        description="Momen-momen terbaik PORA XV. Pilih tampilan favoritmu: feed ala Instagram atau mosaic bergaya PORA."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Pemilih konsep */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-pill bg-surface-soft p-1 ring-1 ring-ink/5 dark:bg-white/5 dark:ring-white/10">
              <button
                type="button"
                onClick={() => setKonsep("kustom")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition",
                  konsep === "kustom" ? "bg-merah text-surface" : "text-ink-soft hover:text-merah",
                )}
              >
                <LayoutGrid className="size-4" /> Mosaic PORA
              </button>
              <button
                type="button"
                onClick={() => setKonsep("ig")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition",
                  konsep === "ig" ? "bg-ink text-surface" : "text-ink-soft hover:text-ink",
                )}
              >
                <Grid3x3 className="size-4" /> Feed Instagram
              </button>
            </div>
          </div>

          {/* Konsep 1: Feed Instagram — grid kotak rapat */}
          {konsep === "ig" && (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {galeriFoto.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => buka(i)}
                  className="group relative aspect-square overflow-hidden bg-surface-soft"
                >
                  {f.src && (
                    <img
                      src={f.src}
                      alt={f.caption}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-5 bg-ink/55 opacity-0 transition group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface">
                      <Heart className="size-4 fill-surface" /> {120 + i * 7}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface">
                      <MessageCircle className="size-4 fill-surface" /> {8 + i}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Konsep 2: Mosaic kustom — masonry via CSS columns, tile beragam ukuran */}
          {konsep === "kustom" && (
            <div className="[column-fill:balance] gap-4 columns-2 sm:columns-3">
              {galeriFoto.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => buka(i)}
                  className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl shadow-card ring-1 ring-ink/5 transition hover:ring-emas/50 dark:ring-white/10"
                >
                  <div className={cn("relative overflow-hidden bg-surface-soft dark:bg-white/5", aspekKustom[f.orientasi])}>
                    {f.src && (
                      <img
                        src={f.src}
                        alt={f.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-pill bg-emas px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
                      {f.kategori}
                    </span>
                    <p className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-medium text-surface">
                      {f.caption}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      {lightbox !== null && (
        <Lightbox foto={galeriFoto[lightbox]} onClose={tutup} onPrev={prev} onNext={next} />
      )}
    </>
  );
}
