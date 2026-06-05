import type { CSSProperties } from "react";
import { Trophy, Users, MapPin, Flame } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { IconBox } from "../ui/IconBox";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { caborList, klasemenList, venueList } from "../../data/content";
import { useSocialLinks } from "../../lib/api/hooks";

/** Angka ringkas dirakit dari data agar selalu konsisten dengan konten. */
const statistik = [
  { icon: Trophy, value: `${caborList.length}`, label: "Cabang Olahraga", tone: "merah" as const, glow: "bg-merah/25" },
  { icon: Users, value: `${klasemenList.length}+`, label: "Kontingen Kab/Kota", tone: "hijau" as const, glow: "bg-hijau/30" },
  { icon: MapPin, value: `${venueList.length}`, label: "Venue Pertandingan", tone: "emas" as const, glow: "bg-emas/30" },
  { icon: Flame, value: "2.500+", label: "Atlet Bertanding", tone: "ink" as const, glow: "bg-ink/15" },
];

/**
 * Section Tentang: ringkas makna event + profil tuan rumah + statistik kunci.
 * Latar bergradasi page-bg → surface agar menyatu dengan pita Kontingen di atas
 * dan section Cabang Olahraga (putih) di bawah.
 */
export function TentangPora() {
  const socials = useSocialLinks();
  return (
    <section
      id="tentang"
      className="relative isolate overflow-hidden bg-gradient-to-b from-page-bg via-page-bg to-surface py-20 dark:bg-page-bg dark:bg-none sm:py-24"
    >
      <SectionGlow tone="merah" />

      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal direction="left">
          <SectionHeading
            eyebrow="Tentang PORA"
            title="Pesta Olahraga & Persaudaraan Rakyat Aceh"
            description="Pekan Olahraga Aceh (PORA) adalah ajang multi-cabang empat tahunan yang mempertemukan atlet terbaik dari seluruh kabupaten/kota di Aceh. Tahun ini Kabupaten Aceh Jaya dipercaya menjadi tuan rumah, menghadirkan semangat sportivitas sekaligus memperkenalkan pesona Bumi Teungku."
          />
          <p className="mt-4 max-w-xl text-ink-soft">
            Lebih dari sekadar kompetisi, PORA menjadi panggung pembibitan atlet
            menuju ajang nasional dan perekat persaudaraan antardaerah di Aceh.
          </p>

          {/* Kanal sosial resmi — tile hover terisi warna merek. */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Ikuti PORA Aceh Jaya
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.nama}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.nama}
                    title={s.nama}
                    style={{ "--brand": s.brand } as CSSProperties}
                    className="group inline-flex size-11 items-center justify-center rounded-md bg-surface text-ink shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:bg-[var(--brand)] hover:text-white hover:ring-transparent dark:ring-white/10"
                  >
                    <Icon className="size-5 transition duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Kartu statistik: grid 2 kolom yang tetap rapi saat di-drag. */}
        <div className="grid grid-cols-2 gap-4">
          {statistik.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 100} direction="right">
                <div className="group relative h-full overflow-hidden rounded-lg bg-surface p-5 shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-panel dark:ring-white/10">
                  {/* Sheen tipis di tepi atas. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/50 to-transparent"
                  />
                  {/* Glow warna peran muncul saat hover. */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-2xl opacity-0 transition duration-300 group-hover:opacity-100 ${item.glow}`}
                  />
                  <IconBox tone={item.tone} className="transition duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </IconBox>
                  <p className="relative mt-4 font-display text-4xl font-bold leading-none text-ink">
                    {item.value}
                  </p>
                  <p className="relative mt-1.5 text-sm text-ink-muted">{item.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
