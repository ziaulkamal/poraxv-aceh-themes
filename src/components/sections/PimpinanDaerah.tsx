import { useEffect, useState, type CSSProperties, type ReactElement } from "react";
import { Container } from "../ui/Container";
import { cn } from "../../lib/cn";
import {
  VARIAN_PIMPINAN,
  paketPimpinan as PAKET,
  type PaketPimpinan as Paket,
  type VarianPimpinan,
} from "../../data/pimpinan";

const darkVars = { "--surface": "0 0% 100%" } as CSSProperties;

/** Kartu satu paket: foto potongan berdiri di atas panggung bercahaya + keterangan. */
function PanelPaket({ p, tone }: { p: Paket; tone: "merah" | "hijau" }) {
  return (
    <figure
      style={darkVars}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-lg bg-surface-dark text-surface shadow-panel ring-1 ring-surface/10"
    >
      <div aria-hidden className={cn("pointer-events-none absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl", tone === "merah" ? "bg-merah/30" : "bg-hijau/25")} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[12%] aspect-square w-[70%] -translate-x-1/2 rounded-full border border-dashed border-surface/10" />
      <div className="relative flex flex-1 items-end justify-center px-4 pt-6">
        <img
          src={p.foto}
          alt={`${p.jabatan} ${p.wilayah}: ${p.nama.join(" dan ")}`}
          className="relative z-10 h-56 w-auto object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition duration-500 group-hover:scale-[1.03] sm:h-72"
        />
      </div>
      <figcaption className="relative z-20 -mt-10 bg-gradient-to-t from-surface-dark via-surface-dark/95 to-transparent px-5 pb-5 pt-12 text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-emas">
          {p.jabatan} {p.wilayah}
        </p>
        <p className="mt-1.5 font-display text-lg font-bold leading-tight sm:text-xl">
          {p.nama[0]} <span className="text-surface/40">·</span> {p.nama[1]}
        </p>
      </figcaption>
    </figure>
  );
}

/** A — dua panel berdampingan, tanpa gerak. */
function VarianA() {
  return (
    <section className="bg-page-bg pb-3 pt-6 sm:pt-8">
      <Container>
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">
          Didukung Pemerintah Aceh &amp; Pemerintah Kabupaten Aceh Jaya
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <PanelPaket p={PAKET[0]} tone="merah" />
          <PanelPaket p={PAKET[1]} tone="hijau" />
        </div>
      </Container>
    </section>
  );
}

/** B — satu panel lebar, crossfade bergantian tiap 6 detik. */
function VarianB() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % PAKET.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-page-bg pb-3 pt-6 sm:pt-8">
      <Container>
        <div style={darkVars} className="relative isolate h-[22rem] overflow-hidden rounded-lg bg-surface-dark text-surface shadow-panel ring-1 ring-surface/10 sm:h-80">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-20 size-72 rounded-full bg-merah/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 right-1/4 size-64 rounded-full bg-emas/15 blur-3xl" />
          {PAKET.map((p, idx) => (
            <div
              key={p.wilayah}
              className={cn(
                "absolute inset-0 grid items-end transition-opacity duration-700 sm:grid-cols-[1fr_1.1fr]",
                idx === i ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div className="relative z-20 order-2 px-6 pb-6 text-center sm:order-1 sm:self-center sm:pb-0 sm:pl-10 sm:text-left">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-emas">{p.jabatan}</p>
                <p className="font-display text-sm uppercase tracking-widest text-surface/60">{p.wilayah}</p>
                <p className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {p.nama[0]}
                  <span className="block text-surface/80">{p.nama[1]}</span>
                </p>
              </div>
              <img src={p.foto} alt={`${p.jabatan} ${p.wilayah}`} className="order-1 mx-auto h-48 w-auto self-end object-contain sm:order-2 sm:h-72" />
            </div>
          ))}
          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:left-10 sm:translate-x-0">
            {PAKET.map((p, idx) => (
              <button
                key={p.wilayah}
                aria-label={`Tampilkan ${p.jabatan} ${p.wilayah}`}
                onClick={() => setI(idx)}
                className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-8 bg-emas" : "w-3 bg-surface/30")}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** C — menyatu dengan kaki Hero: latar gelap bersambung, foto "berdiri" di tepi bawah. */
function VarianC() {
  return (
    <section style={darkVars} className="relative isolate -mt-12 bg-surface-dark pt-10 text-surface">
      {/* Selubung di atas fade Hero: gelap-ke-gelap agar tak ada garis sambungan. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-surface-dark" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(50%_70%_at_50%_100%,hsl(35_82%_57%/0.16),transparent)]" />
      <Container className="relative">
        <div className="grid grid-cols-2 items-end gap-3 sm:gap-8">
          {PAKET.map((p) => (
            <figure key={p.wilayah} className="flex flex-col items-center">
              <img
                src={p.foto}
                alt={`${p.jabatan} ${p.wilayah}: ${p.nama.join(" dan ")}`}
                className="h-36 w-auto object-contain [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] sm:h-80"
              />
              <figcaption className="relative -mt-2 px-1 pb-6 text-center sm:-mt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emas sm:text-xs sm:tracking-[0.2em]">
                  {p.jabatan} {p.wilayah}
                </p>
                <p className="mt-0.5 font-display text-sm font-bold leading-tight sm:text-lg">
                  {p.nama[0]} <span className="text-surface/40">·</span> {p.nama[1]}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

const VARIAN: Record<VarianPimpinan, () => ReactElement> = { a: VarianA, b: VarianB, c: VarianC };

/** Varian dari `?pimpinan=` (pratinjau) bila sah, selain itu konstanta VARIAN_PIMPINAN. */
function varianAktif(): VarianPimpinan {
  const q = new URLSearchParams(window.location.search).get("pimpinan");
  return q === "a" || q === "b" || q === "c" ? q : VARIAN_PIMPINAN;
}

/** Section foto pimpinan daerah di atas pita Kontingen. */
export function PimpinanDaerah() {
  const Varian = VARIAN[varianAktif()];
  return <Varian />;
}
