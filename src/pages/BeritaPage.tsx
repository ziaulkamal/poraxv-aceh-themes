import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { SelectFilter } from "../components/ui/SelectFilter";
import { ArtikelCard } from "../components/sections/ArtikelCard";
import { useArtikelCards } from "../lib/api/hooks";

/** Laman daftar berita: cari judul + filter kategori (select2) menuju laman detail. */
export function BeritaPage() {
  const artikelList = useArtikelCards();
  const kategoriList = useMemo(
    () => ["Semua", ...Array.from(new Set(artikelList.map((a) => a.kategori)))],
    [artikelList],
  );
  const [kategori, setKategori] = useState("Semua");
  const [cari, setCari] = useState("");

  const tersaring = useMemo(
    () =>
      artikelList.filter(
        (a) =>
          (kategori === "Semua" || a.kategori === kategori) &&
          a.judul.toLowerCase().includes(cari.toLowerCase().trim()),
      ),
    [artikelList, kategori, cari],
  );

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
          {/* Cari judul + filter kategori (select2) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-pill bg-surface-soft px-4 py-2.5 ring-1 ring-ink/10 dark:ring-white/15">
              <Search className="size-4 shrink-0 text-ink-muted" />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari judul berita…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
            <SelectFilter
              value={kategori}
              onChange={setKategori}
              options={kategoriList}
              placeholder="Kategori"
              className="sm:w-60"
            />
          </div>

          <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
            {tersaring.map((artikel, i) => (
              <Reveal key={artikel.slug} delay={(i % 3) * 110} direction="up">
                <ArtikelCard item={artikel} />
              </Reveal>
            ))}
          </div>

          {tersaring.length === 0 && (
            <p className="py-16 text-center text-sm text-ink-muted">
              Tidak ada berita yang cocok dengan pencarian/filter.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
