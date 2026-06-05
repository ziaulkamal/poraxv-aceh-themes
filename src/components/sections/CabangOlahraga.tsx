import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { Button } from "../ui/Button";
import { CaborCard } from "./CaborCard";
import { caborList } from "../../data/content";

/** Berapa kartu yang tampil sebelum tombol "Lihat semua" ditekan. */
const PREVIEW = 8;

/** Section daftar cabang olahraga: pratinjau ringkas + expand agar tak menutupi konten penting di bawahnya. */
export function CabangOlahraga() {
  const [expanded, setExpanded] = useState(false);

  const totalCabor = caborList.length;
  const totalNomor = caborList.reduce((acc, c) => acc + c.jumlahNomor, 0);
  const sisa = totalCabor - PREVIEW;
  const visible = expanded ? caborList : caborList.slice(0, PREVIEW);

  return (
    <section
      id="cabor"
      className="relative isolate overflow-hidden bg-gradient-to-b from-surface via-surface to-page-bg py-16 dark:bg-page-bg dark:bg-none sm:py-20"
    >
      <SectionGlow tone="emas" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Yang Dipertandingkan"
            title="Cabang Olahraga"
            description={`${totalCabor} cabang olahraga memperebutkan ratusan medali sepanjang gelaran PORA XV.`}
          />
        </Reveal>

        {/* Strip ringkas: total cabang & total nomor medali. */}
        <Reveal delay={80}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-pill bg-merah/10 px-4 py-1.5 text-sm font-semibold text-merah">
              <span className="font-display text-base">{totalCabor}</span> Cabang Olahraga
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill bg-emas/15 px-4 py-1.5 text-sm font-semibold text-ink dark:text-surface">
              <span className="font-display text-base text-emas">{totalNomor}</span> Nomor Medali
            </span>
          </div>
        </Reveal>

        {/* Grid auto-fit: 1 kolom di mobile, mengisi kolom seperlunya di layar lebih lebar. */}
        <div className="mt-10 grid gap-3 sm:gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
          {visible.map((cabor, i) => (
            <Reveal key={cabor.nama} delay={(i % 4) * 70} direction="zoom">
              <CaborCard item={cabor} />
            </Reveal>
          ))}
        </div>

        {/* Tombol expand: sembunyikan sisa kartu agar konten penting di bawah cepat terjangkau. */}
        {sisa > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="group"
            >
              {expanded ? "Tampilkan lebih sedikit" : `Lihat semua ${totalCabor} cabang`}
              <ChevronDown
                className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
