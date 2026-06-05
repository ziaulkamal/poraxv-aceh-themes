import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { Berita } from "../../types";

/** Kartu berita: foto + kategori + judul + ringkasan; foto ber-aspect tetap agar grid rapi. */
export function BeritaCard({ item }: { item: Berita }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-surface shadow-card transition hover:-translate-y-1 hover:shadow-panel dark:ring-1 dark:ring-white/10">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.judul}
          loading="lazy"
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
        <p className="mt-2 flex-1 text-sm text-ink-soft">{item.ringkasan}</p>
        <Link
          to="/berita"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-merah hover:gap-2"
        >
          Baca selengkapnya <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
