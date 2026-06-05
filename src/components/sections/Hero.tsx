import type { CSSProperties } from "react";
import { CalendarDays, MapPin, ArrowRight, Flame } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Reveal } from "../ui/Reveal";
import { CountdownTimer } from "../ui/CountdownTimer";
import { event, caborList, venueList } from "../../data/content";
import { kontingenList } from "../../data/kontingen";

/** Format rentang tanggal event jadi "12 – 22 September 2026". */
function rentangTanggal(): string {
  const mulai = new Date(event.tanggalMulai);
  const selesai = new Date(event.tanggalSelesai);
  const bulan = selesai.toLocaleDateString("id-ID", { month: "long" });
  return `${mulai.getDate()} – ${selesai.getDate()} ${bulan} ${selesai.getFullYear()}`;
}

/** Ringkasan angka penting event untuk strip kepercayaan di bawah CTA. */
const stats = [
  { value: kontingenList.length, label: "Kontingen" },
  { value: caborList.length, label: "Cabang Olahraga" },
  { value: venueList.length, label: "Venue" },
];

/** Hero pembuka: identitas event, hitung mundur, dan CTA di atas latar gelap. */
export function Hero() {
  return (
    <section
      id="beranda"
      // Hero selalu berlatar gelap di kedua tema; kunci --surface ke putih agar
      // semua warna turunannya (teks, border, panel) tetap terang di mode gelap.
      style={{ "--surface": "0 0% 100%" } as CSSProperties}
      className="relative isolate overflow-hidden bg-surface-dark text-surface"
    >
      {/* Grid halus bertekstur, memudar ke tepi via mask radial. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(0 0% 100% / 0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 80%)",
        }}
      />

      {/* Spotlight lembut dari atas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[420px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, hsl(35 82% 57% / 0.16), transparent 70%)",
        }}
      />

      {/* Glow aksen warna brand yang mengambang lembut. */}
      <div className="pointer-events-none absolute -right-24 -top-28 size-[460px] rounded-full bg-merah/25 blur-3xl animate-[hero-float_11s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-36 -left-20 size-[420px] rounded-full bg-hijau/20 blur-3xl animate-[hero-float_13s_ease-in-out_infinite] [animation-delay:-3s]" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 size-[260px] rounded-full bg-emas/15 blur-3xl animate-[hero-float_9s_ease-in-out_infinite] [animation-delay:-5s]" />

      {/* Flame raksasa samar sebagai aksen tematik. */}
      <Flame
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 size-[520px] text-merah/[0.06] [transform:rotate(8deg)]"
        strokeWidth={1}
      />

      <Container className="relative grid items-center gap-10 pb-24 pt-32 sm:pt-36 lg:grid-cols-[1.15fr_1fr] lg:pb-28 lg:pt-44">
        <Reveal direction="left">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="emas" className="uppercase tracking-widest">
              <Flame className="size-3.5" /> {event.edisi} · {event.tuanRumah}
            </Badge>
            <span className="inline-flex items-center gap-2 rounded-pill bg-surface/5 px-3 py-1 text-xs font-medium text-surface/80 ring-1 ring-surface/10 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-hijau animate-[hero-pulse_1.6s_ease-in-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-hijau" />
              </span>
              Pendaftaran dibuka
            </span>
          </div>

          {/* Wordmark menyesuaikan lebar layar secara kontinu (clamp), bukan menunggu breakpoint. */}
          <h1 className="mt-5 font-display font-bold uppercase leading-[0.9] [font-size:clamp(2.75rem,8vw,5.5rem)]">
            Pekan Olahraga
            <span className="block bg-gradient-to-r from-merah via-emas to-merah bg-clip-text pb-1 text-transparent">
              Aceh
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-surface/75 sm:text-lg">
            {event.tagline}. Pesta olahraga terbesar se-Aceh kembali digelar,
            kali ini di {event.tuanRumah}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-sm text-surface/85">
            <span className="inline-flex items-center gap-2 rounded-pill bg-surface/5 px-3.5 py-1.5 ring-1 ring-surface/10">
              <CalendarDays className="size-4 text-emas" /> {rentangTanggal()}
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill bg-surface/5 px-3.5 py-1.5 ring-1 ring-surface/10">
              <MapPin className="size-4 text-merah" /> {event.kota}, Aceh Jaya
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              Daftar Kontingen <ArrowRight className="size-4" />
            </Button>
            <Button variant="ghost" size="lg">
              Lihat Jadwal
            </Button>
          </div>

          {/* Strip statistik ringkas */}
          <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-surface/10 pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 text-xs uppercase tracking-wide text-surface/55">
                  {s.label}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold leading-none text-surface">
                  {s.value}
                  <span className="text-emas">+</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Panggung maskot: cincin dekoratif, sorotan, dan kartu hitung mundur mengambang */}
        <Reveal direction="right" delay={150}>
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            {/* Sorotan & cincin konsentris di belakang maskot (mengingat cincin pada logo). */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[42%] size-[min(80vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emas/30 via-merah/10 to-transparent blur-2xl" />
              <div className="absolute left-1/2 top-[42%] aspect-square w-[min(72vw,27rem)] -translate-x-1/2 -translate-y-1/2 animate-[ring-spin_40s_linear_infinite] rounded-full border border-dashed border-surface/15" />
              <div className="absolute left-1/2 top-[42%] aspect-square w-[min(58vw,21rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-surface/10" />
            </div>

            {/* Maskot — fokus visual hero, mengambang lembut. */}
            <img
              src="/images/maskot.png"
              alt="Maskot harimau PORA Aceh Jaya membawa obor"
              loading="eager"
              className="relative z-10 mx-auto w-[min(78vw,24rem)] animate-[maskot-float_6s_ease-in-out_infinite] drop-shadow-[0_34px_55px_rgba(0,0,0,0.55)]"
            />

            {/* Chip identitas mengambang di sudut kanan atas maskot. */}
            <div className="absolute right-1 top-4 z-20 hidden items-center gap-2 rounded-pill bg-surface-dark/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-emas ring-1 ring-emas/30 backdrop-blur sm:inline-flex">
              <Flame className="size-3.5" /> {event.edisi}
            </div>

            {/* Kartu hitung mundur mengambang, menumpuk di kaki maskot. */}
            <div className="relative z-20 mx-auto -mt-8 w-[min(94%,23rem)] rounded-lg bg-gradient-to-br from-emas/40 via-surface/10 to-merah/30 p-px shadow-panel sm:-mt-10">
              <div className="relative overflow-hidden rounded-[calc(var(--radius-lg)-1px)] bg-surface-dark/85 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-emas/20 blur-2xl"
                />
                <p className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-widest text-emas sm:text-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-emas animate-[hero-pulse_1.6s_ease-in-out_infinite]" />
                    <span className="relative inline-flex size-2 rounded-full bg-emas" />
                  </span>
                  Menuju Pembukaan
                </p>
                <p className="mt-1 text-xs text-surface/65 sm:text-sm">
                  Upacara pembukaan di Stadion Utama Calang.
                </p>
                <div className="mt-4">
                  <CountdownTimer targetDate={event.tanggalMulai} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Fade ke warna latar halaman agar transisi ke section berikut mulus. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[hsl(var(--page-bg))]"
      />
    </section>
  );
}
