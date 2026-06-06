import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { NO_IMAGE } from "../../lib/noImage";
import type { Berita } from "../../types";

/**
 * Kartu berita: gambar & judul menuju DETAIL (/berita/:slug);
 * tombol "Baca selengkapnya" menuju daftar (/berita).
 */
export function BeritaCard({ item }: { item: Berita }) {
  const detail = item.slug ? `/berita/${item.slug}` : "/berita";
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-surface shadow-card transition hover:-translate-y-1 hover:shadow-panel dark:ring-1 dark:ring-white/10">
      <Link to={detail} className="block aspect-[16/10] overflow-hidden">
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
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="hijau">{item.kategori}</Badge>
          <span className="text-xs text-ink-muted">{item.tanggal}</span>
        </div>
        <Link to={detail}>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink transition group-hover:text-merah">
            {item.judul}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{item.ringkasan}</p>
      </div>
    </article>
  );
}
