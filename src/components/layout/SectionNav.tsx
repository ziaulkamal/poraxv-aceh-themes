import { useEffect, useState } from "react";
import { ChevronDown, ChevronsUp } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Urutan target navigasi antar-section (sesuai urutan DOM di App).
 * Footer ikut sebagai target terakhir agar bisa "turun" sampai dasar halaman.
 */
const targets = [
  { id: "beranda", label: "Beranda" },
  { id: "kontingen", label: "Kontingen" },
  { id: "tentang", label: "Tentang" },
  { id: "cabor", label: "Cabor" },
  { id: "jadwal", label: "Jadwal" },
  { id: "klasemen", label: "Klasemen" },
  { id: "venue", label: "Venue" },
  { id: "berita", label: "Berita" },
  { id: "footer", label: "Footer" },
];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/**
 * Stepper navigasi melayang (kanan-tengah): pindah satu section ke atas / bawah.
 * Saat menyentuh footer, tombol bawah berganti jadi "kembali ke paling atas",
 * sementara tombol atas tetap "naik satu tingkat". Tampil di desktop & mobile.
 */
export function SectionNav() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Garis acuan di 35% tinggi viewport menentukan section "aktif".
      const line = window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < targets.length; i++) {
        const el = document.getElementById(targets[i].id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      }
      // Footer pendek: top-nya mungkin tak pernah melewati garis acuan, jadi
      // saat halaman benar-benar mentok ke dasar, paksa footer sebagai aktif.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) idx = targets.length - 1;
      setActive(idx);
      setVisible(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const atFooter = active === targets.length - 1;

  const btn =
    "inline-flex size-10 items-center justify-center text-ink transition " +
    "hover:bg-ink/5 hover:text-merah focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-merah/40 disabled:pointer-events-none disabled:opacity-30 sm:size-11";

  return (
    <nav
      aria-label="Navigasi antar-bagian"
      className={cn(
        "fixed right-3 top-1/2 z-40 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:right-5",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-4 opacity-0"
      )}
    >
      <div className="flex flex-col overflow-hidden rounded-pill bg-surface/90 shadow-panel ring-1 ring-ink/10 backdrop-blur-md">
        {/* Langsung ke puncak halaman (Hero), seperti tombol footer. Selalu aktif
            selagi nav tampil — nav baru muncul setelah halaman tergulir. */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke paling atas"
          title="Kembali ke paling atas"
          className={btn}
        >
          <ChevronsUp className="size-5" />
        </button>

        <span aria-hidden className="mx-auto h-px w-5 bg-ink/10" />

        {/* Di footer: kembali ke paling atas. Selain itu: turun satu section. */}
        <button
          type="button"
          onClick={() =>
            atFooter ? scrollToTop() : scrollToId(targets[active + 1]?.id ?? "footer")
          }
          aria-label={atFooter ? "Kembali ke paling atas" : "Bagian berikutnya"}
          title={atFooter ? "Kembali ke paling atas" : "Bagian berikutnya"}
          className={btn}
        >
          {atFooter ? <ChevronsUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
      </div>
    </nav>
  );
}
