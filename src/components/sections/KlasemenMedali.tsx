import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { useKlasemenList } from "../../lib/api/hooks";
import { cn } from "../../lib/cn";

/** Kepala kolom medali dengan titik warna emas/perak/perunggu. */
const kolomMedali = [
  { key: "emas", label: "Emas", dot: "bg-emas-medali" },
  { key: "perak", label: "Perak", dot: "bg-perak" },
  { key: "perunggu", label: "Perunggu", dot: "bg-perunggu" },
] as const;

/** Section klasemen: tabel perolehan medali per kontingen; baris tuan rumah disorot. */
export function KlasemenMedali() {
  const klasemenList = useKlasemenList();
  return (
    <section
      id="klasemen"
      className="relative isolate overflow-hidden bg-gradient-to-b from-surface via-surface to-page-bg py-16 dark:bg-page-bg dark:bg-none sm:py-20"
    >
      <SectionGlow tone="merah" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Perolehan Medali"
            title="Klasemen Sementara"
            description="Pemuncak perolehan medali sementara dari seluruh kontingen kabupaten/kota."
          />
        </Reveal>

        {/* Tabel digulung horizontal di layar sempit agar kolom tak terpotong. */}
        <Reveal direction="up" className="mt-10 overflow-x-auto rounded-lg shadow-card dark:ring-1 dark:ring-white/10">
          <table className="w-full min-w-[560px] border-collapse bg-surface text-left">
            <thead>
              <tr className="bg-ink text-surface">
                <th className="px-4 py-3 text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-sm font-semibold">Kontingen</th>
                {kolomMedali.map((k) => (
                  <th key={k.key} className="px-4 py-3 text-center text-sm font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={cn("size-2.5 rounded-full", k.dot)} />
                      {k.label}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {klasemenList.map((row) => {
                const total = row.emas + row.perak + row.perunggu;
                const isHost = !!row.tuanRumah;
                return (
                  <tr
                    key={row.kontingen}
                    className={cn(
                      "border-b border-ink/5 last:border-0 transition hover:bg-page-bg/60",
                      isHost && "bg-merah/5",
                    )}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex size-7 items-center justify-center rounded-full text-sm font-bold",
                          row.peringkat === 1 && "bg-emas-medali text-ink",
                          row.peringkat === 2 && "bg-perak text-ink",
                          row.peringkat === 3 && "bg-perunggu text-surface",
                          row.peringkat > 3 && "text-ink-muted",
                        )}
                      >
                        {row.peringkat}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {row.kontingen}
                      {isHost && (
                        <span className="ml-2 rounded-pill bg-merah px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-surface">
                          Tuan Rumah
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-ink">{row.emas}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.perak}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.perunggu}</td>
                    <td className="px-4 py-3 text-center font-bold text-ink">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <Link to="/klasemen" className={button({ variant: "outline" })}>
            Klasemen Lengkap
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
