import { useEffect, useState } from "react";

/** Hitung selisih waktu menuju tanggal target, dipotong agar tak negatif. */
function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const day = Math.floor(diff / 86_400_000);
  const jam = Math.floor((diff % 86_400_000) / 3_600_000);
  const menit = Math.floor((diff % 3_600_000) / 60_000);
  const detik = Math.floor((diff % 60_000) / 1000);
  return { day, jam, menit, detik };
}

/** Hitung mundur live menuju tanggal pembukaan event; berhenti otomatis di nol. */
export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime();
  const [time, setTime] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { label: "Hari", value: time.day },
    { label: "Jam", value: time.jam },
    { label: "Menit", value: time.menit },
    { label: "Detik", value: time.detik },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-[64px] flex-1 rounded-md bg-surface/10 px-3 py-2 text-center backdrop-blur sm:min-w-[80px]"
        >
          <div className="font-display text-2xl font-bold text-surface sm:text-3xl">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[0.65rem] uppercase tracking-widest text-surface/70">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
