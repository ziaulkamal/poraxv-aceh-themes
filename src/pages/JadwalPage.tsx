/**
 * src/pages/JadwalPage.tsx — laman jadwal keseluruhan (semua status, termasuk selesai).
 * Data dari core via useJadwalLengkap; dikelompokkan per tanggal (urutan dari API dipertahankan).
 */
import { useMemo } from "react";
import { Clock, MapPin } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Seo } from "../components/Seo";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { KontingenIcons } from "../components/ui/KontingenIcons";
import { cn } from "../lib/cn";
import { useJadwalLengkap } from "../lib/api/hooks";
import type { JadwalItem } from "../types";

/** Kelompokkan agenda per tanggal tanpa mengubah urutan kronologis dari API. */
function groupByTanggal(list: JadwalItem[]): Array<{ tanggal: string; items: JadwalItem[] }> {
  const groups: Array<{ tanggal: string; items: JadwalItem[] }> = [];
  for (const item of list) {
    const last = groups[groups.length - 1];
    if (last && last.tanggal === item.tanggal) last.items.push(item);
    else groups.push({ tanggal: item.tanggal, items: [item] });
  }
  return groups;
}

/** Label & warna pill status laga. */
function StatusPill({ status }: { status?: JadwalItem["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-merah px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase text-surface">
        <span className="size-1.5 animate-pulse rounded-full bg-surface" /> Live
      </span>
    );
  }
  if (status === "selesai") {
    return (
      <span className="rounded-pill bg-surface-soft px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase text-ink-muted dark:bg-white/5">
        Selesai
      </span>
    );
  }
  return (
    <span className="rounded-pill bg-hijau/10 px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase text-hijau">
      Akan Datang
    </span>
  );
}

/** Laman jadwal keseluruhan: agenda lengkap dikelompokkan per tanggal. */
export function JadwalPage() {
  const jadwal = useJadwalLengkap();
  const grup = useMemo(() => groupByTanggal(jadwal), [jadwal]);

  return (
    <>
      <Seo title="Jadwal Pertandingan" description="Seluruh agenda pertandingan PORA Aceh Jaya, dikelompokkan menurut tanggal." />
      <PageHeader
        breadcrumb="Jadwal"
        eyebrow="Agenda Pertandingan"
        title="Jadwal Keseluruhan"
        description="Seluruh agenda PORA XV — termasuk laga yang telah selesai. Dikelompokkan menurut tanggal."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          {grup.map((g) => (
            <div key={g.tanggal} className="mb-10 last:mb-0">
              <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-bold text-ink">
                <span className="rounded-md bg-merah px-3 py-1 text-surface">{g.tanggal}</span>
                <span className="h-px flex-1 bg-ink/10" />
              </h2>

              <div className="flex flex-col gap-3">
                {g.items.map((item, i) => (
                  <div
                    key={`${item.acara}-${i}`}
                    className={cn(
                      "flex flex-col gap-3 rounded-md bg-surface p-4 shadow-card transition dark:ring-1 dark:ring-white/10 sm:flex-row sm:items-center sm:gap-5",
                      item.status === "selesai" && "opacity-70",
                    )}
                  >
                    <div className="flex shrink-0 items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-1">
                      <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                        <Clock className="size-3.5 text-ink-muted" /> {item.waktu}
                      </span>
                      <StatusPill status={item.status} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        {item.kode && (
                          <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft dark:bg-white/10">
                            {item.kode}
                          </span>
                        )}
                        {item.cabor && <Badge tone="outline">{item.cabor}</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <KontingenIcons items={item.kontingen} />
                        <p className="truncate font-semibold text-ink">{item.acara}</p>
                      </div>
                    </div>

                    <p className="flex items-center gap-1 text-sm text-ink-soft sm:w-56 sm:justify-end">
                      <MapPin className="size-4 shrink-0 text-hijau" />
                      <span className="truncate">{item.venue}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {grup.length === 0 && (
            <p className="py-16 text-center text-sm text-ink-muted">Belum ada jadwal pertandingan.</p>
          )}
        </Container>
      </section>
    </>
  );
}
