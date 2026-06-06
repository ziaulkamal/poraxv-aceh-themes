import { useMemo, useState } from "react";
import { Search, Medal, ArrowUpDown } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Seo } from "../components/Seo";
import { PageHeader } from "../components/ui/PageHeader";
import { cn } from "../lib/cn";
import { useEventInfo, useKlasemenList } from "../lib/api/hooks";

type SortKey = "peringkat" | "emas" | "perak" | "perunggu" | "total";

const kolom = [
  { key: "emas" as const, label: "Emas", dot: "bg-emas-medali" },
  { key: "perak" as const, label: "Perak", dot: "bg-perak" },
  { key: "perunggu" as const, label: "Perunggu", dot: "bg-perunggu" },
];

/** Laman klasemen lengkap: podium tiga besar + tabel medali sortir & cari. */
export function KlasemenPage() {
  const klasemenList = useKlasemenList();
  const event = useEventInfo();
  const host = event.tuanRumah.split(" ").pop() ?? "";
  const [cari, setCari] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("peringkat");
  const [asc, setAsc] = useState(true);

  const baris = useMemo(() => {
    const withTotal = klasemenList.map((r) => ({ ...r, total: r.emas + r.perak + r.perunggu }));
    const tersaring = withTotal.filter((r) =>
      r.kontingen.toLowerCase().includes(cari.toLowerCase()),
    );
    return tersaring.sort((a, b) => {
      const d = a[sortKey] - b[sortKey];
      return asc ? d : -d;
    });
  }, [cari, sortKey, asc, klasemenList]);

  const podium = useMemo(
    () =>
      [...klasemenList]
        .map((r) => ({ ...r, total: r.emas + r.perak + r.perunggu }))
        .sort((a, b) => a.peringkat - b.peringkat)
        .slice(0, 3),
    [klasemenList],
  );

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(key === "peringkat");
    }
  };

  return (
    <>
      <Seo title="Klasemen Medali" description="Rekap perolehan medali seluruh kontingen kabupaten/kota se-Aceh di PORA Aceh Jaya." />
      <PageHeader
        breadcrumb="Klasemen"
        eyebrow="Perolehan Medali"
        title="Klasemen Medali"
        description="Rekap perolehan medali seluruh kontingen kabupaten/kota se-Aceh. Klik kolom untuk mengurutkan."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {/* Podium tiga besar */}
          <div className="grid gap-4 sm:grid-cols-3">
            {podium.map((r, i) => (
              <div
                key={r.kontingen}
                className={cn(
                  "relative overflow-hidden rounded-lg p-5 shadow-card ring-1 dark:ring-white/10",
                  i === 0 && "bg-gradient-to-br from-emas/20 to-surface ring-emas/30 dark:from-emas/20 dark:to-white/[0.03] sm:-mt-2",
                  i === 1 && "bg-surface ring-ink/5 dark:bg-white/[0.03]",
                  i === 2 && "bg-surface ring-ink/5 dark:bg-white/[0.03]",
                )}
              >
                <Medal
                  className={cn(
                    "absolute right-3 top-3 size-10 opacity-20",
                    i === 0 && "text-emas-medali",
                    i === 1 && "text-perak",
                    i === 2 && "text-perunggu",
                  )}
                />
                <span className="font-display text-4xl font-bold text-ink/15">#{r.peringkat}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{r.kontingen}</h3>
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="font-semibold text-ink">{r.emas} <span className="text-ink-muted">E</span></span>
                  <span className="text-ink-soft">{r.perak} <span className="text-ink-muted">P</span></span>
                  <span className="text-ink-soft">{r.perunggu} <span className="text-ink-muted">Pr</span></span>
                  <span className="ml-auto font-bold text-merah">{r.total}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pencarian */}
          <div className="mt-8 flex items-center gap-2 rounded-pill bg-surface-soft px-4 py-2.5 ring-1 ring-ink/5 dark:bg-white/5 dark:ring-white/10 sm:max-w-sm">
            <Search className="size-4 text-ink-muted" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari kontingen…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
          </div>

          {/* Tabel */}
          <div className="mt-6 overflow-x-auto rounded-lg shadow-card dark:ring-1 dark:ring-white/10">
            <table className="w-full min-w-[620px] border-collapse bg-surface text-left">
              <thead>
                <tr className="bg-ink text-surface">
                  <th className="px-4 py-3 text-sm font-semibold">
                    <button onClick={() => toggleSort("peringkat")} className="inline-flex items-center gap-1 hover:text-emas">
                      # <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Kontingen</th>
                  {kolom.map((k) => (
                    <th key={k.key} className="px-4 py-3 text-center text-sm font-semibold">
                      <button onClick={() => toggleSort(k.key)} className="inline-flex items-center gap-1.5 hover:text-emas">
                        <span className={cn("size-2.5 rounded-full", k.dot)} /> {k.label}
                        <ArrowUpDown className="size-3" />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    <button onClick={() => toggleSort("total")} className="inline-flex items-center gap-1 hover:text-emas">
                      Total <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {baris.map((row) => {
                  const isHost = row.kontingen.includes(host);
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
                      <td className="px-4 py-3 text-center font-bold text-ink">{row.total}</td>
                    </tr>
                  );
                })}
                {baris.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-muted">
                      Kontingen tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
