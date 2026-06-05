import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Eye, VideoOff, ExternalLink, Play, X, Radio } from "lucide-react";
import { cn } from "../../lib/cn";
import type { LiveChannel } from "../../data/pages";
import { useStreamingState } from "../../lib/api/hooks";

/** Logo YouTube (lucide build ini tak menyertakan ikon Youtube). */
function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

const thumbnail = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/** Lencana LIVE merah berdenyut. */
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-pill bg-[#FF0000] px-2 py-0.5 text-[0.6rem] font-bold tracking-wider text-white">
      <span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE
    </span>
  );
}

/** Popup pemutar multi-saluran: embed autoplay + pengalih antar siaran. */
function StreamModal({
  channels,
  awal,
  onClose,
}: {
  channels: LiveChannel[];
  awal: number;
  onClose: () => void;
}) {
  const [aktif, setAktif] = useState(awal);
  const ch = channels[aktif];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-surface/10 text-surface transition hover:bg-surface/20"
      >
        <X className="size-5" />
      </button>

      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 pb-3 text-surface">
          <LiveBadge />
          <p className="truncate text-sm font-semibold">
            <span className="text-emas">{ch.cabor}</span> · {ch.judul}
          </p>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-panel ring-1 ring-white/10">
          <iframe
            key={ch.id}
            src={`https://www.youtube.com/embed/${ch.youtubeId}?autoplay=1`}
            title={ch.judul}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>

        {/* Pengalih saluran */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {channels.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setAktif(i)}
                className={cn(
                  "group relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                  i === aktif ? "ring-[#FF0000]" : "ring-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={thumbnail(c.youtubeId)} alt={c.cabor} className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-ink/70 px-1.5 py-0.5 text-[0.6rem] font-semibold text-surface">
                  {c.cabor}
                </span>
              </button>
            ))}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${ch.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-surface/80 transition hover:text-surface"
          >
            YouTube <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Hub siaran langsung: beberapa cabang tayang bersamaan sebagai grid kartu.
 * Tentatif — hanya tampil saat Panitia Besar mengaktifkan mode streaming.
 */
export function LiveStreaming({ autoOpenId }: { autoOpenId?: string }) {
  const { enabled: streamingAktif, channels: liveChannels } = useStreamingState();
  const [buka, setBuka] = useState<number | null>(null);
  // Lebih dari 4 saluran: gulir mendatar agar tidak menumpuk ke bawah.
  const scroll = liveChannels.length > 4;

  // Buka modal otomatis bila diarahkan dari pencarian (klik hasil "Siaran").
  useEffect(() => {
    if (!autoOpenId) return;
    const idx = liveChannels.findIndex((c) => c.id === autoOpenId);
    if (idx >= 0) setBuka(idx);
  }, [autoOpenId]);

  // Geser-tarik dengan mouse (sentuh sudah didukung native oleh overflow-x).
  const rowRef = useRef<HTMLDivElement>(null);
  const tarik = useRef({ aktif: false, mulaiX: 0, scrollAwal: 0, geser: false });

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !rowRef.current) return;
    tarik.current = { aktif: true, mulaiX: e.clientX, scrollAwal: rowRef.current.scrollLeft, geser: false };
    rowRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!tarik.current.aktif || !rowRef.current) return;
    const dx = e.clientX - tarik.current.mulaiX;
    if (Math.abs(dx) > 4) tarik.current.geser = true;
    rowRef.current.scrollLeft = tarik.current.scrollAwal - dx;
  };
  const onPointerUp = () => {
    tarik.current.aktif = false;
  };

  /** Buka popup, kecuali bila barusan menggeser (drag) — bukan klik. */
  const bukaSaluran = (i: number) => {
    if (tarik.current.geser) return;
    setBuka(i);
  };

  if (!streamingAktif || liveChannels.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 bg-surface-soft py-12 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5">
          <VideoOff className="size-6 text-ink-muted" />
        </span>
        <p className="font-semibold text-ink">Siaran langsung belum aktif</p>
        <p className="max-w-sm text-sm text-ink-soft">
          Saluran streaming YouTube akan muncul di sini saat Panitia Besar memulai siaran pertandingan.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#FF0000]">
          <YoutubeGlyph className="size-5 text-white" />
        </span>
        <div>
          <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink">
            Saluran Langsung <LiveBadge />
          </h2>
          <p className="text-xs text-ink-muted">
            {liveChannels.length} cabang tayang bersamaan · klik untuk menonton
          </p>
        </div>
      </div>

      <div
        ref={rowRef}
        onPointerDown={scroll ? onPointerDown : undefined}
        onPointerMove={scroll ? onPointerMove : undefined}
        onPointerUp={scroll ? onPointerUp : undefined}
        className={cn(
          scroll
            ? "no-scrollbar flex gap-4 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] cursor-grab select-none active:cursor-grabbing"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {liveChannels.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => bukaSaluran(i)}
            className={cn(
              "group relative block overflow-hidden rounded-xl text-left shadow-card ring-1 ring-ink/5 transition hover:shadow-panel dark:ring-white/10",
              scroll && "w-[280px] shrink-0 sm:w-[300px]",
            )}
          >
            <div className="aspect-video w-full">
              <img
                src={thumbnail(c.youtubeId)}
                alt={c.judul}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
              <LiveBadge />
              <span className="inline-flex items-center gap-1 rounded-pill bg-ink/65 px-2 py-0.5 text-[0.6rem] font-semibold text-surface backdrop-blur">
                <Eye className="size-3" /> {c.penonton}
              </span>
            </div>

            <span className="absolute left-1/2 top-1/2 inline-flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF0000]/90 text-white shadow-lg transition group-hover:scale-110">
              <Play className="size-5 translate-x-0.5 fill-white" />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-emas">
                <Radio className="size-3" /> {c.cabor}
              </span>
              <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-surface">{c.judul}</p>
              <p className="text-xs text-surface/60">{c.venue}</p>
            </div>
          </button>
        ))}
      </div>

      {buka !== null && (
        <StreamModal channels={liveChannels} awal={buka} onClose={() => setBuka(null)} />
      )}
    </>
  );
}
