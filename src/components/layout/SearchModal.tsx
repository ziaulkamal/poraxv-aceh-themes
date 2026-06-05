import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { caborList, jadwalList, venueList } from "../../data/content";
import { artikelList, pertandinganList, liveChannels } from "../../data/pages";

type Tipe = "Berita" | "Jadwal" | "Live" | "Siaran" | "Venue" | "Cabor";

interface Hasil {
  tipe: Tipe;
  judul: string;
  sub: string;
  to: string;
  section?: string;
  streamId?: string;
  key: string;
}

/** Warna lencana per jenis hasil pencarian. */
const tagWarna: Record<Tipe, string> = {
  Berita: "bg-hijau/15 text-hijau-deep",
  Jadwal: "bg-merah/15 text-merah",
  Live: "bg-merah text-surface",
  Siaran: "bg-[#FF0000] text-white",
  Venue: "bg-emas/20 text-emas",
  Cabor: "bg-ink/10 text-ink-soft dark:bg-white/10 dark:text-surface/70",
};

const pintasan = [
  { label: "Berita", to: "/berita" },
  { label: "Klasemen", to: "/klasemen" },
  { label: "Live Skor", to: "/live" },
  { label: "Venue", to: "/venue" },
  { label: "Galeri", to: "/galeri" },
];

/** Modal pencarian global (gaya command-palette) lintas konten situs. */
export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  // Indeks gabungan seluruh konten yang dapat dicari.
  const indeks = useMemo<Hasil[]>(() => {
    const items: Hasil[] = [];
    artikelList.forEach((a) =>
      items.push({
        tipe: "Berita",
        judul: a.judul,
        sub: `${a.kategori} · ${a.tanggal}`,
        to: `/berita/${a.slug}`,
        key: `${a.judul} ${a.ringkasan} ${a.kategori}`.toLowerCase(),
      }),
    );
    venueList.forEach((v) =>
      items.push({
        tipe: "Venue",
        judul: v.nama,
        sub: `${v.lokasi} · ${v.cabor.join(", ")}`,
        to: "/venue",
        key: `${v.nama} ${v.lokasi} ${v.cabor.join(" ")}`.toLowerCase(),
      }),
    );
    jadwalList.forEach((j) =>
      items.push({
        tipe: "Jadwal",
        judul: j.acara,
        sub: `${j.tanggal} ${j.waktu} · ${j.venue}`,
        to: "/",
        section: "jadwal",
        key: `${j.acara} ${j.cabor} ${j.venue}`.toLowerCase(),
      }),
    );
    pertandinganList.forEach((m) =>
      items.push({
        tipe: "Live",
        judul: `${m.a.nama} vs ${m.b.nama}`,
        sub: `${m.cabor} · ${m.babak}`,
        to: "/live",
        key: `${m.a.nama} ${m.b.nama} ${m.cabor} ${m.babak}`.toLowerCase(),
      }),
    );
    liveChannels.forEach((c) =>
      items.push({
        tipe: "Siaran",
        judul: `${c.cabor} — ${c.judul}`,
        sub: `Siaran langsung · ${c.venue}`,
        to: "/live",
        streamId: c.id,
        key: `${c.cabor} ${c.judul} ${c.venue} siaran live streaming youtube`.toLowerCase(),
      }),
    );
    caborList.forEach((c) =>
      items.push({
        tipe: "Cabor",
        judul: c.nama,
        sub: `${c.jumlahNomor} nomor pertandingan`,
        to: "/",
        section: "cabor",
        key: c.nama.toLowerCase(),
      }),
    );
    return items;
  }, []);

  const kueri = q.trim().toLowerCase();
  const hasil = kueri ? indeks.filter((i) => i.key.includes(kueri)).slice(0, 8) : [];

  // Reset kueri & kunci scroll saat modal dibuka/ditutup; Esc untuk menutup.
  useEffect(() => {
    if (!open) return;
    setQ("");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/60 p-4 backdrop-blur-sm sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-panel ring-1 ring-ink/10 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kotak input */}
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3.5">
          <Search className="size-5 shrink-0 text-ink-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari berita, jadwal, venue, cabor…"
            className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="inline-flex size-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hasil */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!kueri && (
            <div className="p-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">Akses cepat</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pintasan.map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    onClick={onClose}
                    className="rounded-pill bg-surface-soft px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-merah/10 hover:text-merah dark:bg-white/5"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {kueri && hasil.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-ink-muted">
              Tidak ada hasil untuk “{q}”.
            </p>
          )}

          {hasil.map((h, i) => (
            <Link
              key={`${h.tipe}-${i}`}
              to={h.to}
              state={
                h.streamId
                  ? { openStream: h.streamId }
                  : h.section
                    ? { scrollTo: h.section }
                    : undefined
              }
              onClick={onClose}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-surface-soft dark:hover:bg-white/5"
            >
              <span className={cn("shrink-0 rounded-md px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider", tagWarna[h.tipe])}>
                {h.tipe}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{h.judul}</span>
                <span className="block truncate text-xs text-ink-muted">{h.sub}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-merah" />
            </Link>
          ))}
        </div>

        {/* Kaki */}
        <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2.5 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft className="size-3.5" /> pilih
          </span>
          <span>Esc untuk menutup</span>
        </div>
      </div>
    </div>
  );
}
