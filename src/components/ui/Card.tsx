import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Pembungkus generik rounded + shadow; konteks isi diserahkan ke pemanggil. */
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg bg-surface shadow-card dark:ring-1 dark:ring-white/10", className)}>{children}</div>
  );
}
