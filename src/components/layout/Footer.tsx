import type { CSSProperties } from "react";
import { Mail, Phone, MapPin, Globe, Send, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";
import { event } from "../../data/content";

const navKolom = [
  { judul: "Event", items: ["Tentang PORA", "Cabang Olahraga", "Jadwal", "Klasemen"] },
  { judul: "Informasi", items: ["Venue & Arena", "Berita", "Panduan Kontingen", "Volunteer"] },
];

const kontak = [
  { Icon: MapPin, label: "Kantor Bupati Aceh Jaya, Calang", href: undefined },
  { Icon: Phone, label: "(0654) 000-1234", href: "tel:06540001234" },
  { Icon: Mail, label: "info@pora-acehjaya.id", href: "mailto:info@pora-acehjaya.id" },
];

const sosial = [Globe, Send, Mail];

/** Footer: identitas event, navigasi ringkas, kontak panitia, dan kanal sosial. */
export function Footer() {
  return (
    <footer
      // Footer selalu berlatar gelap di kedua tema; kunci --surface ke putih agar
      // semua warna turunannya (teks, border, ikon) tetap terang di mode gelap.
      style={{ "--surface": "0 0% 100%" } as CSSProperties}
      className="relative overflow-hidden bg-surface-dark text-surface"
    >
      {/* Garis aksen gradien tipis di tepi atas — kesan finishing premium. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/70 to-transparent"
      />
      {/* Glow brand lembut sebagai kedalaman latar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-merah/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-72 w-80 rounded-full bg-emas/10 blur-[120px]"
      />

      <Container className="relative grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        {/* Identitas */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo PORA Aceh Jaya"
              className="h-12 w-auto shrink-0"
            />
            <div>
              <span className="block font-display text-2xl font-bold uppercase leading-none tracking-wide">
                {event.edisi}
              </span>
              <span className="mt-1.5 block text-[0.65rem] uppercase tracking-[0.3em] text-emas/80">
                {event.namaPanjang}
              </span>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-surface/55">
            {event.namaPanjang} — Tuan Rumah {event.tuanRumah}. {event.tagline}.
          </p>
        </div>

        {/* Kolom navigasi */}
        {navKolom.map((kolom) => (
          <div key={kolom.judul}>
            <h4 className="relative inline-block font-display text-sm font-semibold uppercase tracking-widest text-surface after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-7 after:rounded-full after:bg-emas">
              {kolom.judul}
            </h4>
            <ul className="mt-7 space-y-3 text-sm text-surface/55">
              {kolom.items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-surface"
                  >
                    <span className="h-px w-0 bg-emas transition-all duration-300 group-hover:w-4" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Kontak */}
        <div>
          <h4 className="relative inline-block font-display text-sm font-semibold uppercase tracking-widest text-surface after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-7 after:rounded-full after:bg-emas">
            Sekretariat Panitia
          </h4>
          <ul className="mt-7 space-y-4 text-sm text-surface/55">
            {kontak.map(({ Icon, label, href }) => {
              const isi = (
                <>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface/5 ring-1 ring-surface/10 transition group-hover:ring-emas/40">
                    <Icon className="size-3.5 text-merah" />
                  </span>
                  <span className="pt-1.5 leading-snug">{label}</span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="group flex items-start gap-3 transition-colors hover:text-surface">
                      {isi}
                    </a>
                  ) : (
                    <div className="group flex items-start gap-3">{isi}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex gap-2.5">
            {sosial.map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex size-9 items-center justify-center rounded-lg bg-surface/5 ring-1 ring-surface/10 transition hover:-translate-y-0.5 hover:bg-merah hover:ring-merah"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="relative border-t border-surface/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-surface/45 sm:flex-row">
          <p>© 2026 Panitia Besar {event.edisi} — {event.tuanRumah}.</p>
          <p className="inline-flex items-center gap-1.5">
            Dibuat untuk semangat sportivitas Aceh
            <ArrowUpRight className="size-3.5 text-emas/70" />
          </p>
        </Container>
      </div>
    </footer>
  );
}
