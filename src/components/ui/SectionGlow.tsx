import { cn } from "../../lib/cn";

/**
 * Lapisan ambient khusus dark mode: garis sheen di tepi atas, tekstur grid
 * bermask radial, dan dua glow brand di sudut. Hanya tampil di `.dark`
 * (`hidden dark:block`) agar light mode tetap bersih. Statis — tanpa animasi.
 *
 * Section pemanggil HARUS `relative isolate overflow-hidden`; lapisan ini
 * dipasang pada `-z-10` agar berada di atas latar section namun di bawah konten.
 */
type Tone = "merah" | "emas" | "hijau";

/** Pasangan warna glow per nada — orb utama + aksen sekunder untuk variasi. */
const orbs: Record<Tone, { a: string; b: string }> = {
  merah: { a: "bg-merah/25", b: "bg-emas/15" },
  emas: { a: "bg-emas/25", b: "bg-hijau/12" },
  hijau: { a: "bg-hijau/15", b: "bg-merah/20" },
};

export function SectionGlow({ tone = "merah" }: { tone?: Tone }) {
  const { a, b } = orbs[tone];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {/* Tekstur grid halus, memudar ke tepi via mask radial dari atas. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.04) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(0 0% 100% / 0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(110% 80% at 50% 0%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(110% 80% at 50% 0%, #000 30%, transparent 78%)",
        }}
      />
      {/* Garis sheen tipis di tepi atas — pemisah section lewat cahaya. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/40 to-transparent" />
      {/* Glow brand di dua sudut berlawanan. */}
      <div className={cn("absolute -left-24 top-6 size-72 rounded-full blur-3xl", a)} />
      <div className={cn("absolute -right-20 bottom-0 size-72 rounded-full blur-3xl", b)} />
    </div>
  );
}
