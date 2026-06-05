import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean; // teks terang untuk latar gelap
  className?: string;
}

/** Judul section seragam: eyebrow kecil + judul display + deskripsi opsional. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.2em]",
            invert ? "text-emas" : "text-merah",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl",
          invert ? "text-surface" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3", invert ? "text-surface/75" : "text-ink-soft")}>
          {description}
        </p>
      )}
    </div>
  );
}
