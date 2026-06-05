import type { CSSProperties } from "react";
import { Container } from "../ui/Container";
import { cn } from "../../lib/cn";
import { useInView } from "../../hooks/useInView";
import { useMarqueeScroll } from "../../hooks/useMarqueeScroll";
import { kontingenList, type Kontingen } from "../../data/kontingen";

/** Banyak logo per kelompok kemunculan (entrance bertahap 4-5 logo). */
const GROUP = 5;

/**
 * Satu lambang bulat dalam pita: wrapper luar mengatur entrance bertahap (delay per grup),
 * kartu dalam menangani hover agar kedua transisi tak saling mengunci.
 */
function LogoItem({ item, order, show }: { item: Kontingen; order: number; show: boolean }) {
  const delay = Math.floor(order / GROUP) * 130;
  return (
    <div
      style={{ transitionDelay: `${show ? delay : 0}ms` }}
      className={cn(
        // Mobile: tiap slot = setengah lebar pita (container query) agar pas 2 logo tampak.
        // sm+: kembali ke lebar alami dengan jarak antar-logo tetap.
        "flex w-[calc(100cqw/2)] shrink-0 justify-center sm:mr-10 sm:block sm:w-auto",
        "transition-all duration-500 ease-out motion-reduce:transition-none",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
    >
      <div
        data-marquee-item
        title={item.nama}
        className="group relative flex size-[5.5rem] items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:ring-2 hover:ring-emas/60"
      >
        {/* Sheen kaca di sisi atas untuk kesan futuristik. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-1/2 left-0 h-full w-full bg-gradient-to-b from-white/80 to-transparent opacity-60"
        />
        {/* Glow brand halus saat hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-merah/10 via-transparent to-emas/15 opacity-0 transition duration-300 group-hover:opacity-100"
        />
        <img
          src={item.logo}
          alt={`Lambang ${item.nama}`}
          loading="lazy"
          className="relative z-10 max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

/** Pita satu baris digerakkan JS: laju dasar + reaksi kecepatan/arah scroll. */
function MarqueeRow({ show }: { show: boolean }) {
  const ref = useMarqueeScroll<HTMLDivElement>(100);
  return (
    <div className="flex min-w-0 flex-1 overflow-hidden [container-type:inline-size] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
      <div ref={ref} className="flex w-max will-change-transform">
        {[...kontingenList, ...kontingenList].map((k, i) => (
          <LogoItem key={`${k.nama}-${i}`} item={k} order={i % kontingenList.length} show={show} />
        ))}
      </div>
    </div>
  );
}

/** Band peserta: penanda total kontingen se-Aceh + pita logo bulat berjalan + CTA. */
export function Kontingen() {
  const { ref, inView } = useInView<HTMLElement>(0.2);

  return (
    <section id="kontingen" ref={ref} className="bg-page-bg pb-6 pt-3 sm:pb-8 sm:pt-4">
      <Container>
        {/* Rail gelap glassy: menjembatani nuansa Hero, tile putih jadi menonjol.
            --surface dikunci putih agar teks & tile tetap terang di kedua tema. */}
        <div
          style={{ "--surface": "0 0% 100%" } as CSSProperties}
          className="relative isolate overflow-hidden rounded-lg bg-surface-dark px-5 py-5 text-surface shadow-panel ring-1 ring-surface/10 sm:px-7"
        >
          {/* Glow brand di dalam rail. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-merah/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/4 size-52 rounded-full bg-hijau/15 blur-3xl"
          />
          {/* Garis sheen tipis di tepi atas rail. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/50 to-transparent"
          />

          <div className="relative flex items-center gap-4 lg:gap-8">
            {/* Penanda total kontingen se-Aceh — selalu di sisi pita logo */}
            <div className="flex shrink-0 items-center gap-3 text-left">
              <span className="bg-gradient-to-br from-merah via-emas to-merah bg-clip-text font-display text-5xl font-bold leading-none text-transparent">
                {kontingenList.length}
              </span>
              <span className="border-l border-surface/20 pl-3">
                <span className="block font-display text-sm font-bold uppercase tracking-wide text-surface">
                  Kontingen
                </span>
                <span className="block text-xs text-surface/60">se-Aceh bergabung</span>
              </span>
            </div>

            {/* Pita logo berjalan */}
            <MarqueeRow show={inView} />
          </div>
        </div>
      </Container>
    </section>
  );
}
