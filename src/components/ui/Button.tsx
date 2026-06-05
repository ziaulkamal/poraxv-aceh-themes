import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/** Tombol berbentuk pill dengan varian warna brand PORA & ukuran konsisten. */
export const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-merah/40 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-merah text-surface hover:bg-merah-deep",
        emas: "bg-emas text-ink hover:brightness-95",
        ghost: "border border-surface/70 text-surface hover:bg-surface/10",
        dark: "bg-ink text-surface hover:bg-surface-dark",
        outline: "border border-merah/30 text-merah hover:bg-merah/10",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

/** Tombol aksi serba-guna; varian & ukuran lewat props, bukan className mentah. */
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
