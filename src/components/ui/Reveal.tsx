import type { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";
import { cn } from "../../lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Jeda mulai animasi (ms) untuk efek bertahap antar kartu. */
  delay?: number;
  /** Arah munculnya konten. */
  direction?: "up" | "left" | "right" | "zoom";
  className?: string;
}

/** Posisi awal tersembunyi per arah; ditranslasi balik ke nol saat masuk viewport. */
const hidden: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  zoom: "scale-95",
};

/** Bungkus apa pun agar ber-transisi halus (fade + geser) saat tergulir ke layar. */
export function Reveal({ children, delay = 0, direction = "up", className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
        inView ? "opacity-100 translate-x-0 translate-y-0 scale-100" : cn("opacity-0", hidden[direction]),
        className,
      )}
    >
      {children}
    </div>
  );
}
