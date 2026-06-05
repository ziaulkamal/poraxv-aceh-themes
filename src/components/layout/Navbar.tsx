import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon, Radio, Phone } from "lucide-react";
import { cn } from "../../lib/cn";

const links = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Cabor", href: "#cabor" },
  { label: "Jadwal", href: "#jadwal" },
  { label: "Klasemen", href: "#klasemen" },
  { label: "Venue", href: "#venue" },
  { label: "Berita", href: "#berita" },
];

const iconBtn =
  "inline-flex size-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-surface-soft hover:text-merah";

/**
 * Navbar utama.
 * - Di puncak halaman: kartu "pill" mengambang dengan sudut membulat penuh.
 * - Saat di-scroll: menempel ke tepi atas, melebar penuh, hanya sudut
 *   bawah yang membulat dengan bayangan halus agar terlihat timbul.
 * - Di mobile: menu berbentuk off-canvas yang meluncur dari kanan.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kunci scroll halaman saat off-canvas terbuka.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Inisialisasi mode gelap/terang: ikuti pilihan tersimpan, default ke GELAP.
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Tiga aksi ikon: mode gelap/terang, live pertandingan, dan kontak.
  const actions = (opts?: { className?: string; onNavigate?: () => void }) => (
    <div className={cn("flex items-center gap-1", opts?.className)}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Ganti mode gelap/terang"
        title="Mode gelap / terang"
        className={iconBtn}
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>

      <a
        href="#live"
        onClick={opts?.onNavigate}
        aria-label="Live pertandingan"
        title="Live pertandingan"
        className={cn(iconBtn, "relative")}
      >
        <Radio className="size-5" />
        <span className="absolute right-2 top-2 flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-merah opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-merah" />
        </span>
      </a>

      <a
        href="#kontak"
        onClick={opts?.onNavigate}
        aria-label="Kontak"
        title="Kontak"
        className={iconBtn}
      >
        <Phone className="size-5" />
      </a>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Padding luar memberi jarak tepi saat mengambang, hilang saat scroll. */}
      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          scrolled ? "px-0 pt-0" : "px-3 pt-3 sm:px-5 sm:pt-5"
        )}
      >
        {/* Bar: bentuk & bayangan berubah mengikuti status scroll. */}
        <div
          className={cn(
            "mx-auto overflow-hidden bg-surface/95 backdrop-blur-md transition-all duration-300 ease-out",
            scrolled
              ? "max-w-none rounded-b-[1.75rem] shadow-[0_14px_34px_-14px_hsl(320_5%_9%/0.4)]"
              : "max-w-6xl rounded-[1.75rem] shadow-panel ring-1 ring-ink/5"
          )}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <a href="#beranda" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Logo PORA Aceh Jaya"
                className="h-10 w-auto shrink-0"
              />
              <span className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                PORA <span className="text-merah">Aceh Jaya</span>
              </span>
            </a>

            {/* Navigasi desktop */}
            <nav className="hidden items-center gap-6 lg:flex">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-ink-soft transition hover:text-merah"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {actions({ className: "hidden lg:flex" })}

            {/* Tombol hamburger hanya tampil di bawah lg */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Buka menu"
              className="text-ink lg:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* === Off-canvas mobile === */}
      {/* Lapisan gelap di belakang panel */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Panel yang meluncur dari kanan */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-surface shadow-panel transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
          <a
            href="#beranda"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <img
              src="/images/logo.png"
              alt="Logo PORA Aceh Jaya"
              className="h-10 w-auto shrink-0"
            />
            <span className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              PORA <span className="text-merah">Aceh Jaya</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu"
            className="text-ink"
          >
            <X className="size-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-ink-soft transition hover:bg-surface-soft hover:text-merah"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-ink/5 px-5 py-4">
          {actions({ className: "justify-center gap-3", onNavigate: () => setIsOpen(false) })}
        </div>
      </aside>
    </header>
  );
}
