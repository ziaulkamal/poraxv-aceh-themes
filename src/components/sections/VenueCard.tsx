import { MapPin } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { Venue } from "../../types";

/** Kartu venue: foto arena dengan overlay nama, lokasi, dan cabor yang digelar. */
export function VenueCard({ item }: { item: Venue }) {
  return (
    <article className="group relative min-h-[260px] overflow-hidden rounded-lg shadow-card dark:ring-1 dark:ring-white/10">
      {item.image ? (
        <img
          src={item.image}
          alt={item.nama}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-dark" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-surface">
        <h3 className="font-display text-lg font-semibold uppercase">{item.nama}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-surface/80">
          <MapPin className="size-4 text-emas" /> {item.lokasi}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.cabor.map((c) => (
            <Badge key={c} tone="soft">{c}</Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
