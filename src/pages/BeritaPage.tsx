import { useMemo, useState } from "react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { ArtikelCard } from "../components/sections/ArtikelCard";
import { cn } from "../lib/cn";
import { artikelList } from "../data/pages";

/** Laman daftar berita: filter kategori + grid artikel menuju laman detail. */
export function BeritaPage() {
  const kategoriList = useMemo(
    () => ["Semua", ...Array.from(new Set(artikelList.map((a) => a.kategori)))],
    [],
  );
  const [aktif, setAktif] = useState("Semua");

  const tersaring =
    aktif === "Semua" ? artikelList : artikelList.filter((a) => a.kategori === aktif);

  return (
    <>
      <PageHeader
        breadcrumb="Berita"
        eyebrow="Kabar Terbaru"
        title="Berita & Informasi"
        description="Liputan, kabar, dan informasi resmi seputar gelaran PORA XV di Kabupaten Aceh Jaya."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Filter kategori */}
          <div className="flex flex-wrap gap-2">
            {kategoriList.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setAktif(k)}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition",
                  aktif === k
                    ? "bg-merah text-surface"
                    : "bg-surface-soft text-ink-soft hover:bg-merah/10 hover:text-merah dark:bg-white/5 dark:text-surface/70",
                )}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
            {tersaring.map((artikel, i) => (
              <Reveal key={artikel.slug} delay={(i % 3) * 110} direction="up">
                <ArtikelCard item={artikel} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
