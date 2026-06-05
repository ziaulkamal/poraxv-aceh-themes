/** src/components/ui/BlokKonten.tsx — render blok isi (paragraf/subjudul/kutipan) dari cms. */
import type { Artikel } from "../../data/pages";

type Blok = Artikel["isi"][number];

/** Render daftar blok konten kaya (artikel/halaman) dengan gaya konsisten. */
export function BlokKonten({ blocks }: { blocks: Blok[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((blok, i) => {
        if (blok.tipe === "subjudul") {
          return (
            <h2 key={i} className="font-display text-lg font-bold text-ink sm:text-xl">
              {blok.teks}
            </h2>
          );
        }
        if (blok.tipe === "kutipan") {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-merah bg-surface-soft py-4 pl-5 pr-4 font-display text-lg italic text-ink dark:bg-white/5"
            >
              “{blok.teks}”
            </blockquote>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-ink-soft">
            {blok.teks}
          </p>
        );
      })}
    </div>
  );
}
