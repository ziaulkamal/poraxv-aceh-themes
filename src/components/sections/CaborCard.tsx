import type { Cabor } from "../../types";

/** Kartu satu cabang olahraga: ikon gambar + nama + jumlah nomor yang diperebutkan. */
export function CaborCard({ item }: { item: Cabor }) {
  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-lg bg-surface p-4 shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-panel hover:ring-merah/30 dark:ring-white/10">
      {/* Aksen gradien tipis di tepi atas, tersingkap saat hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-merah via-emas to-hijau transition-transform duration-300 group-hover:scale-x-100"
      />

      {/* Tile ikon: latar putih (ikon punya background putih, bukan transparan)
          agar menyatu mulus jadi thumbnail berbingkai rapi di kedua tema. */}
      <span className="inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-ink/10 transition group-hover:ring-merah/40">
        {item.iconSrc ? (
          <img
            src={item.iconSrc}
            alt={`Ikon ${item.nama}`}
            loading="lazy"
            width={64}
            height={64}
            onError={(e) => {
              // URL ikon Simpora 404 → jatuh ke ikon bundel FE sekali saja (cegah loop).
              const img = e.currentTarget;
              if (img.dataset.fellBack || !item.iconFallback) return;
              img.dataset.fellBack = "1";
              img.src = item.iconFallback;
            }}
            className="size-full object-contain p-1 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-xl font-bold text-merah">
            {item.nama.charAt(0)}
          </span>
        )}
      </span>

      <div className="min-w-0">
        <h3 className="truncate font-display text-base font-semibold uppercase text-ink">
          {item.nama}
        </h3>
      </div>
    </div>
  );
}
