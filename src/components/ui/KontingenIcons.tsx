/** src/components/ui/KontingenIcons.tsx — deret lambang kontingen yang bertanding (tanpa nama). */
import type { JadwalItem } from "../../types";

/** Tampilkan lambang kontingen saling tumpuk; nama hanya untuk alt/tooltip. */
export function KontingenIcons({
  items,
  size = 22,
}: {
  items?: JadwalItem["kontingen"];
  size?: number;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex shrink-0 items-center -space-x-1.5">
      {items.map((k, i) => (
        <img
          key={`${k.nama}-${i}`}
          src={k.logo}
          alt={k.nama}
          title={k.nama}
          style={{ width: size, height: size }}
          className="rounded-full bg-surface object-contain ring-2 ring-surface dark:ring-page-bg"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}
    </div>
  );
}
