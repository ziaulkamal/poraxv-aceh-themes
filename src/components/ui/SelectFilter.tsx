/** src/components/ui/SelectFilter.tsx — dropdown gaya select2: searchable, dark-mode aware. */
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "../../lib/cn";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

/** Pilihan tunggal dengan panel pencarian; tutup saat klik luar / Escape. */
export function SelectFilter({
  value,
  onChange,
  options,
  placeholder = "Pilih…",
  searchable = true,
  className,
}: SelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [cari, setCari] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tersaring =
    searchable && cari
      ? options.filter((o) => o.toLowerCase().includes(cari.toLowerCase()))
      : options;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-pill bg-surface-soft px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/10 transition hover:ring-merah/40 dark:ring-white/15"
      >
        <span className={cn(!value && "text-ink-muted")}>{value || placeholder}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-ink-muted transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl bg-surface shadow-panel ring-1 ring-ink/10 dark:bg-surface dark:ring-white/15">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-ink/5 px-3 py-2 dark:border-white/10">
              <Search className="size-4 shrink-0 text-ink-muted" />
              <input
                autoFocus
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto py-1">
            {tersaring.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setCari("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm transition hover:bg-merah/10 hover:text-merah dark:hover:bg-white/5",
                    o === value ? "font-semibold text-merah" : "text-ink-soft",
                  )}
                >
                  {o}
                  {o === value && <Check className="size-4 shrink-0" />}
                </button>
              </li>
            ))}
            {tersaring.length === 0 && (
              <li className="px-4 py-3 text-center text-sm text-ink-muted">Tidak ada hasil.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
