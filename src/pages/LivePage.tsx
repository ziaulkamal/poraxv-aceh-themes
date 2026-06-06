import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, MapPin, Medal, Play, Radio, Star, Trophy } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { LiveStreaming, StreamModal } from "../components/sections/LiveStreaming";
import { cn } from "../lib/cn";
import type { LiveChannel, Pertandingan, Peserta } from "../data/pages";
import { useLiveSkorList, useStreamingState } from "../lib/api/hooks";
import { kontingenList } from "../data/kontingen";

const logoFor = (nama: string) => kontingenList.find((k) => k.nama === nama)?.logo;

const statusFilter = [
  { key: "semua", label: "Semua" },
  { key: "live", label: "Live" },
  { key: "akan", label: "Akan Datang" },
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

/** Lambang satu kontingen (ikon saja; nama hanya tooltip). Sorot bila menang. */
function IkonPeserta({ peserta, menang = false }: { peserta: Peserta; menang?: boolean }) {
  const logo = peserta.logo || logoFor(peserta.kontingen);
  return (
    <div
      title={peserta.kontingen}
      className={cn(
        "flex size-14 items-center justify-center overflow-hidden rounded-full bg-surface ring-1 ring-ink/10",
        menang && "ring-2 ring-merah",
      )}
    >
      {logo ? (
        <img src={logo} alt={peserta.kontingen} className="size-11 object-contain" />
      ) : (
        <Trophy className="size-6 text-ink-muted" />
      )}
    </div>
  );
}

/** Thumbnail YouTube (maxres; fallback ke hqdefault saat 404). */
const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/** Lambang kontingen di kartu sorotan (latar gelap → ring putih). */
function SorotanLogo({ peserta }: { peserta: Peserta }) {
  const logo = peserta.logo || logoFor(peserta.kontingen);
  return (
    <span
      title={peserta.kontingen}
      className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/90 ring-2 ring-white/60 sm:size-14"
    >
      {logo ? (
        <img src={logo} alt={peserta.kontingen} className="size-10 object-contain sm:size-12" />
      ) : (
        <Trophy className="size-5 text-ink-muted" />
      )}
    </span>
  );
}

/**
 * Kartu sorotan bergaya siaran: thumbnail YouTube + overlay (LIVE, logo/skor,
 * tombol play, judul, venue). Klik → buka modal pemutar. Match opsional
 * (sorotan bisa siaran non-pertandingan).
 */
function SorotanCard({
  channel,
  match,
  onTonton,
}: {
  channel: LiveChannel;
  match?: Pertandingan;
  onTonton: () => void;
}) {
  const multi = (match?.peserta?.length ?? 2) > 2;
  const live = match ? match.status === "live" : true;
  return (
    <button
      type="button"
      onClick={onTonton}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl text-left shadow-card ring-1 ring-ink/10 transition hover:shadow-panel dark:ring-white/10"
    >
      <img
        src={ytThumb(channel.youtubeId)}
        alt={channel.judul}
        onError={(e) => {
          e.currentTarget.src = `https://img.youtube.com/vi/${channel.youtubeId}/hqdefault.jpg`;
        }}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

      {/* Atas: LIVE + penonton */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        {live && (
          <span className="inline-flex items-center gap-1 rounded-pill bg-[#FF0000] px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-white">
            <span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 rounded-pill bg-ink/60 px-2 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur">
          <Eye className="size-3" /> {channel.penonton}
        </span>
      </div>

      {/* Tengah: logo + skor (bila match) + tombol play */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
        {match &&
          (multi ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {match.peserta!.map((p, i) => (
                <SorotanLogo key={i} peserta={p} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-5">
              <SorotanLogo peserta={match.a} />
              <span className="font-display text-3xl font-bold tabular-nums text-white drop-shadow sm:text-4xl">
                {match.status === "akan" ? "VS" : `${match.skorA} : ${match.skorB}`}
              </span>
              <SorotanLogo peserta={match.b} />
            </div>
          ))}
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#FF0000]/90 text-white shadow-lg transition group-hover:scale-110">
          <Play className="size-6 translate-x-0.5 fill-white" />
        </span>
      </div>

      {/* Bawah: judul + cabor/venue */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="line-clamp-1 font-semibold text-white sm:text-lg">{channel.judul}</p>
        <p className="line-clamp-1 text-xs text-white/70 sm:text-sm">
          {[channel.cabor || match?.cabor, channel.venue || match?.venue].filter(Boolean).join(" · ")}
        </p>
      </div>
    </button>
  );
}

/** Kartu skor satu pertandingan (beregu maupun perorangan). */
function MatchCard({ m, onTonton }: { m: Pertandingan; onTonton?: () => void }) {
  // >2 peserta = basis multi-kontingen: ikon saja, area nilai disembunyikan.
  const multi = (m.peserta?.length ?? 2) > 2;
  const aMenang = !multi && m.status !== "akan" && m.skorA > m.skorB;
  const bMenang = !multi && m.status !== "akan" && m.skorB > m.skorA;
  return (
    <article className="flex flex-col rounded-lg bg-surface p-5 shadow-card ring-1 ring-ink/5 dark:bg-white/[0.03] dark:ring-white/10">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wide text-ink">
          {m.babak || m.cabor}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {onTonton && (
            <button
              type="button"
              onClick={onTonton}
              title="Tonton Live"
              aria-label="Tonton Live"
              className="inline-flex size-7 items-center justify-center rounded-full bg-merah text-white transition hover:bg-merah-deep"
            >
              <Play className="size-3.5 fill-white" />
            </button>
          )}
          <StatusBadge status={m.status} klok={m.klok} />
        </div>
      </div>

      {multi ? (
        /* Basis multi-kontingen: deret ikon kontingen, tanpa area nilai. */
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {m.peserta!.map((p, i) => (
            <IkonPeserta key={i} peserta={p} />
          ))}
        </div>
      ) : (
        /* Head-to-head: dua ikon + nilai (tanpa nama kontingen). */
        <div className="mt-5 flex items-center gap-3">
          <div className="flex flex-1 justify-center">
            <IkonPeserta peserta={m.a} menang={aMenang} />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 font-display text-3xl font-bold tabular-nums">
              <span className={aMenang ? "text-ink" : "text-ink-soft"}>{m.skorA}</span>
              <span className="text-ink-muted">:</span>
              <span className={bMenang ? "text-ink" : "text-ink-soft"}>{m.skorB}</span>
            </div>
            <span className="mt-1 rounded-pill bg-surface-soft px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-ink-muted dark:bg-white/5">
              {m.jenis === "tim" ? "Beregu" : "Perorangan"}
            </span>
          </div>
          <div className="flex flex-1 justify-center">
            <IkonPeserta peserta={m.b} menang={bMenang} />
          </div>
        </div>
      )}

      {/* Rincian set untuk perorangan (hanya head-to-head) */}
      {!multi && m.set && m.set.length > 0 && (
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

      {/* Footer kartu: cabor + venue, ditempel ke bawah agar sejajar antar-kartu */}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/5 pt-3 text-xs text-ink-muted dark:border-white/10">
        <span className="flex min-w-0 items-center gap-1.5">
          <Medal className="size-3.5 shrink-0 text-merah" />
          <span className="truncate font-medium text-ink-soft">{m.cabor}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-emas" />
          <span className="truncate">{m.venue}</span>
        </span>
      </div>
    </article>
  );
}

/** Pagination lembut & modern: pill bulat, prev/next, nomor halaman. */
function Pagination({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
}) {
  if (total <= 1) return null;
  const nav =
    "flex size-9 items-center justify-center rounded-full bg-surface-soft text-ink-soft transition hover:bg-merah/10 hover:text-merah disabled:opacity-40 disabled:hover:bg-surface-soft disabled:hover:text-ink-soft dark:bg-white/5 dark:text-ink-soft";
  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button type="button" aria-label="Sebelumnya" className={nav} disabled={page === 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          className={cn(
            "size-9 rounded-full text-sm font-semibold tabular-nums transition",
            p === page
              ? "bg-merah text-white shadow-card"
              : "bg-surface-soft text-ink-soft hover:bg-merah/10 hover:text-merah dark:bg-white/5 dark:text-ink-soft",
          )}
        >
          {p}
        </button>
      ))}
      <button type="button" aria-label="Berikutnya" className={nav} disabled={page === total} onClick={() => onPage(page + 1)}>
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

/** Laman live skor: filter status & jenis, sorotan laga berlangsung + grid. */
export function LivePage() {
  const [status, setStatus] = useState<(typeof statusFilter)[number]["key"]>("semua");
  const [jenis, setJenis] = useState<(typeof jenisFilter)[number]["key"]>("semua");
  const autoOpenStream = (useLocation().state as { openStream?: string } | null)?.openStream;
  const pertandinganList = useLiveSkorList();
  const { enabled: streamingAktif, channels } = useStreamingState();
  const [streamIdx, setStreamIdx] = useState<number | null>(null);

  // Peta id pertandingan → indeks kanal siaran (hanya saat siaran aktif).
  const streamByMatch = useMemo(() => {
    const map = new Map<string, number>();
    if (streamingAktif) {
      channels.forEach((c, i) => {
        if (c.matchRef) map.set(c.matchRef, i);
      });
    }
    return map;
  }, [streamingAktif, channels]);

  /** Handler buka modal siaran utk laga (undefined bila tak ada kanal tertaut). */
  const tontonHandler = (m: Pertandingan) => {
    const idx = streamByMatch.get(m.id);
    return idx != null ? () => setStreamIdx(idx) : undefined;
  };

  // Halaman live fokus laga berjalan/akan datang — laga selesai disembunyikan.
  const aktifList = useMemo(
    () => pertandinganList.filter((m) => m.status !== "selesai"),
    [pertandinganList],
  );

  const tersaring = useMemo(
    () =>
      aktifList.filter(
        (m) =>
          (status === "semua" || m.status === status) &&
          (jenis === "semua" || m.jenis === jenis),
      ),
    [status, jenis, aktifList],
  );

  // Sorotan dari CMS (kanal ber-flag), maks 2 — ditampilkan sbg kartu siaran.
  const matchById = useMemo(
    () => new Map(pertandinganList.map((m) => [m.id, m])),
    [pertandinganList],
  );
  const sorotanChannels = useMemo(
    () => (streamingAktif ? channels.filter((c) => c.sorotan) : []).slice(0, 2),
    [streamingAktif, channels],
  );
  const sorotanIds = useMemo(() => sorotanChannels.map((c) => c.id), [sorotanChannels]);
  const sorotanMatchRefs = new Set(
    sorotanChannels.map((c) => c.matchRef).filter(Boolean) as string[],
  );
  const openChannel = (c: LiveChannel) => {
    const idx = channels.findIndex((x) => x.id === c.id);
    if (idx >= 0) setStreamIdx(idx);
  };

  const sisanya = tersaring.filter((m) => !sorotanMatchRefs.has(m.id));
  const jumlahLive = aktifList.filter((m) => m.status === "live").length;

  // Muat 9 jadwal teratas per halaman; reset ke halaman 1 saat filter berganti.
  const PER_PAGE = 9;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [status, jenis]);
  const totalPages = Math.max(1, Math.ceil(sisanya.length / PER_PAGE));
  const pageAman = Math.min(page, totalPages);
  const halaman = sisanya.slice((pageAman - 1) * PER_PAGE, pageAman * PER_PAGE);

  return (
    <>
      <PageHeader breadcrumb="Live Skor" eyebrow="Pusat Pertandingan" title="Live Skor">
        <p className="mt-4 inline-flex items-center gap-2 rounded-pill bg-merah/20 px-4 py-2 text-sm font-semibold text-white">
          <Radio className="size-4" /> {jumlahLive} pertandingan sedang berlangsung
        </p>
      </PageHeader>

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Sorotan siaran (maks 2): 1 = besar terpusat, 2 = bersisian */}
          {sorotanChannels.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-widest text-ink-muted">
                <Star className="size-4 fill-emas text-emas" /> Sorotan
              </h2>
              <div
                className={cn(
                  "grid gap-5",
                  sorotanChannels.length === 2 ? "lg:grid-cols-2" : "mx-auto max-w-3xl",
                )}
              >
                {sorotanChannels.map((c) => (
                  <SorotanCard
                    key={c.id}
                    channel={c}
                    match={c.matchRef ? matchById.get(c.matchRef) : undefined}
                    onTonton={() => openChannel(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Saluran siaran lain (di luar sorotan) */}
          <div className="mb-10">
            <LiveStreaming autoOpenId={autoOpenStream} hideIds={sorotanIds} />
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
                      ? "bg-merah text-white"
                      : "bg-surface-soft text-ink-soft hover:bg-merah/10 hover:text-merah dark:bg-white/5 dark:text-ink-soft",
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

          {/* Sisa pertandingan (9 teratas per halaman) */}
          <div className="mt-8 grid items-stretch gap-5 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
            {halaman.map((m) => (
              <MatchCard key={m.id} m={m} onTonton={tontonHandler(m)} />
            ))}
          </div>

          <Pagination page={pageAman} total={totalPages} onPage={setPage} />

          {tersaring.length === 0 && (
            <p className="py-16 text-center text-sm text-ink-muted">
              Tidak ada pertandingan untuk filter ini.
            </p>
          )}
        </Container>
      </section>

      {/* Modal siaran dari tombol "Tonton Live" pada kartu laga tertaut. */}
      {streamIdx !== null && channels[streamIdx] && (
        <StreamModal
          channels={channels}
          awal={streamIdx}
          onClose={() => setStreamIdx(null)}
        />
      )}
    </>
  );
}
