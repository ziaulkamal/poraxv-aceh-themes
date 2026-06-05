import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/** Chip kecil untuk label/status dengan beberapa nada warna brand. */
const badge = cva(
  "inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        merah: "bg-merah text-surface",
        emas: "bg-emas text-ink",
        hijau: "bg-hijau text-ink",
        soft: "bg-surface/90 text-ink shadow-card backdrop-blur",
        outline: "border border-ink/15 text-ink-soft",
      },
    },
    defaultVariants: { tone: "soft" },
  },
);

interface BadgeProps extends VariantProps<typeof badge> {
  children: ReactNode;
  className?: string;
}

/** Label ringkas (status cabor, kategori berita, tanggal). */
export function Badge({ children, tone, className }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)}>{children}</span>;
}
