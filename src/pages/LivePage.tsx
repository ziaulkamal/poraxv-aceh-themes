import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, Radio, Trophy } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { LiveStreaming } from "../components/sections/LiveStreaming";
import { cn } from "../lib/cn";
import { pertandinganList, type Pertandingan } from "../data/pages";
import { kontingenList } from "../data/kontingen";

const logoFor = (nama: string) => kontingenList.find((k) => k.nama === nama)?.logo;

const statusFilter = [
  { key: "semua", label: "Semua" },
  { key: "live", label: "Live" },
  { key: "akan", label: "Akan Datang" },
  { key: "selesai", label: "Selesai" },
] as const;

const jenisFilter = [
  { key: "semua", label: "Semua" },
  { key: "tim", label: "Beregu" },
  { key: "tunggal", label: "Perorangan" },
] as const;

/** Lencana status pertandingan: live berdenyut, selesai abu, akan emas. */
function StatusBadge({ status, klok }: { status: Pertandingan["status"]; klok: string }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-merah/15 px-2.5 py-1 text-xs font-bold uppercase text-merah">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-merah opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-merah" />
        </span>
        Live · {klok}
      </span>
    );
  }
  if (status === "selesai") {
    return (
      <span className="rounded-pill bg-ink/10 px-2.5 py-1 text-xs font-bold uppercase text-ink-muted dark:bg-white/10 dark:text-surface/60">
        Selesai
      </span>
    );
  }
  return (
    <span className="rounded-pill bg-emas/15 px-2.5 py-1 text-xs font-bold uppercase text-emas">
      {klok}
    </span>
  );
}

/** Satu sisi peserta: logo kontingen (bila ada) + nama + asal. */
function Sisi({ nama, kontingen, menang }: { nama: string; kontingen: string; menang: boolean }) {
  const logo = logoFor(kontingen);
  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <div className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-surface ring-1 ring-ink/10">
        {logo ? (
          <img src={logo} alt={kontingen} className="size-11 object-contain" />
        ) : (
          <Trophy className="size-6 text-ink-muted" />
        )}
      </div>
      <div>
        <p className={cn("text-sm font-bold leading-tight", menang ? "text-ink" : "text-ink-soft")}>{nama}</p>
        {nama !== kontingen && <p className="text-xs text-ink-muted">{kontingen}</p>}
      </div>
    </div>
  );
}

/** Kartu skor satu pertandingan (beregu maupun perorangan). */
function MatchCard({ m, featured = false }: { m: Pertandingan; featured?: boolean }) {
  const aMenang = m.status !== "akan" && m.skorA > m.skorB;
  const bMenang = m.status !== "akan" && m.skorB > m.skorA;
  return (
    <article
      className={cn(
        "flex flex-col rounded-lg bg-surface p-5 shadow-card ring-1 ring-ink/5 dark:bg-white/[0.03] dark:ring-white/10",
        featured && "sm:p-7",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-merah">{m.cabor}</p>
          <p className="truncate text-xs text-ink-muted">{m.babak}</p>
        </div>
        <StatusBadge status={m.status} klok={m.klok} />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Sisi nama={m.a.nama} kontingen={m.a.kontingen} menang={aMenang} />
        <div className="flex flex-col items-center">
          <div className={cn("flex items-center gap-2 font-display font-bold tabular-nums", featured ? "text-5xl" : "text-3xl")}>
            <span className={aMenang ? "text-ink" : "text-ink-soft"}>{m.skorA}</span>
            <span className="text-ink-muted">:</span>
            <span className={bMenang ? "text-ink" : "text-ink-soft"}>{m.skorB}</span>
          </div>
          <span className="mt-1 rounded-pill bg-surface-soft px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-ink-muted dark:bg-white/5">
            {m.jenis === "tim" ? "Beregu" : "Perorangan"}
          </span>
        </div>
        <Sisi nama={m.b.nama} kontingen={m.b.kontingen} menang={bMenang} />
      </div>

      {/* Rincian set untuk perorangan */}
      {m.set && m.set.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {m.set.map(([a, b], i) => (
            <span
              key={i}
              className="rounded-md bg-surface-soft px-2 py-1 text-xs font-semibold tabular-nums text-ink-soft dark:bg-white/5"
            >
              {a}–{b}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-1.5 border-t border-ink/5 pt-3 text-xs text-ink-muted dark:border-white/10">
        <MapPin className="size-3.5 text-emas" /> {m.venue}
      </div>
    </article>
  );
}

/** Laman live skor: filter status & jenis, sorotan laga berlangsung + grid. */
export function LivePage() {
  const [status, setStatus] = useState<(typeof statusFilter)[number]["key"]>("semua");
  const [jenis, setJenis] = useState<(typeof jenisFilter)[number]["key"]>("semua");
  const autoOpenStream = (useLocation().state as { openStream?: string } | null)?.openStream;

  const tersaring = useMemo(
    () =>
      pertandinganList.filter(
        (m) =>
          (status === "semua" || m.status === status) &&
          (jenis === "semua" || m.jenis === jenis),
      ),
    [status, jenis],
  );

  const sorotan = tersaring.find((m) => m.status === "live");
  const sisanya = sorotan ? tersaring.filter((m) => m.id !== sorotan.id) : tersaring;
  const jumlahLive = pertandinganList.filter((m) => m.status === "live").length;

  return (
    <>
      <PageHeader breadcrumb="Live Skor" eyebrow="Pusat Pertandingan" title="Live Skor">
        <p className="mt-4 inline-flex items-center gap-2 rounded-pill bg-merah/20 px-4 py-2 text-sm font-semibold text-surface">
          <Radio className="size-4" /> {jumlahLive} pertandingan sedang berlangsung
        </p>
      </PageHeader>

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Siaran langsung YouTube (tentatif, dikendalikan panitia) */}
          <div className="mb-10">
            <LiveStreaming autoOpenId={autoOpenStream} />
          </div>

          {/* Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusFilter.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStatus(s.key)}
                  className={cn(
                    "rounded-pill px-4 py-2 text-sm font-medium transition",
                    status === s.key
                      ? "bg-merah text-surface"
                      : "bg-surface-soft text-ink-soft hover:bg-merah/10 hover:text-merah dark:bg-white/5 dark:text-surface/70",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-pill bg-surface-soft p-1 ring-1 ring-ink/5 dark:bg-white/5 dark:ring-white/10">
              {jenisFilter.map((j) => (
                <button
                  key={j.key}
                  type="button"
                  onClick={() => setJenis(j.key)}
                  className={cn(
                    "rounded-pill px-3.5 py-1.5 text-sm font-medium transition",
                    jenis === j.key ? "bg-ink text-surface" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorotan laga live */}
          {sorotan && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-ink-muted">
                Laga Sorotan
              </h2>
              <div className="mx-auto max-w-2xl">
                <MatchCard m={sorotan} featured />
              </div>
            </div>
          )}

          {/* Sisa pertandingan */}
          <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
            {sisanya.map((m) => (
              <MatchCard key={m.id} m={m} />
            ))}
          </div>

          {tersaring.length === 0 && (
            <p className="py-16 text-center text-sm text-ink-muted">
              Tidak ada pertandingan untuk filter ini.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
