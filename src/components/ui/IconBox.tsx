import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/** Kotak ikon brand; isi berupa satu ikon lucide. */
const iconBox = cva("inline-flex items-center justify-center rounded-md", {
  variants: {
    tone: {
      merah: "bg-merah text-surface",
      emas: "bg-emas text-ink",
      hijau: "bg-hijau text-ink",
      ink: "bg-ink text-surface",
      soft: "bg-merah/10 text-merah",
    },
    size: {
      md: "size-12",
      lg: "size-14",
    },
  },
  defaultVariants: { tone: "merah", size: "md" },
});

interface IconBoxProps extends VariantProps<typeof iconBox> {
  children: ReactNode;
  className?: string;
}

/** Pembungkus ikon dengan latar warna peran tertentu. */
export function IconBox({ children, tone, size, className }: IconBoxProps) {
  return <span className={cn(iconBox({ tone, size }), className)}>{children}</span>;
}
