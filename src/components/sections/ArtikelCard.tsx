import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "../ui/Badge";
import { NO_IMAGE } from "../../lib/noImage";
import type { Artikel } from "../../data/pages";

/** Kartu artikel yang menautkan ke laman detail /berita/:slug. */
export function ArtikelCard({ item }: { item: Artikel }) {
  return (
    <Link
      to={`/berita/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface shadow-card transition hover:-translate-y-1 hover:shadow-panel dark:ring-1 dark:ring-white/10"
    >
      <div className="aspect-[16/10] overflow-hidden">
        {/* Tanpa gambar → pakai no-image.png; juga jaga-jaga bila URL rusak. */}
        <img
          src={item.image || NO_IMAGE}
          alt={item.judul}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== NO_IMAGE) e.currentTarget.src = NO_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="hijau">{item.kategori}</Badge>
          <span className="text-xs text-ink-muted">{item.tanggal}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          {item.judul}
        </h3>
        <p className="mt-2 flex-1 text-sm text-ink-soft line-clamp-3">{item.ringkasan}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="size-3.5" /> {item.durasiBaca}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-merah transition group-hover:gap-2">
            Baca <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
