import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Radio, Phone, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { SearchModal } from "./SearchModal";
import { MenuLink } from "./MenuLink";
import { useBranding, useMenus } from "../../lib/api/hooks";
import type { MenuLinkType, MenuNode } from "../../lib/api/types";

/** Bangun node menu fallback (dipakai saat API CMS belum tersedia). */
const fb = (label: string, type: MenuLinkType, url: string, i: number): MenuNode => ({
  id: `fb-main-${i}`,
  location: "MAIN",
  parentId: null,
  label,
  type,
  url,
  openInNewTab: false,
  position: i,
  isVisible: true,
  children: [],
});

/** Menu utama fallback: 6 anchor section + 1 route. */
const FALLBACK_MAIN: MenuNode[] = [
  fb("Beranda", "ANCHOR", "beranda", 0),
  fb("Tentang", "ANCHOR", "tentang", 1),
  fb("Jadwal", "ANCHOR", "jadwal", 2),
  fb("Klasemen", "ANCHOR", "klasemen", 3),
  fb("Venue", "ANCHOR", "venue", 4),
  fb("Berita", "ANCHOR", "berita", 5),
  fb("Galeri", "ROUTE", "/galeri", 6),
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
  const [cariBuka, setCariBuka] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: menus } = useMenus();
  const mainMenu = menus?.main?.length ? menus.main : FALLBACK_MAIN;
  const branding = useBranding();
  const brandLogo = dark ? branding.logoMainDark : branding.logoMainLight;

  /** Pergi ke section landing; bila sedang di laman lain, pulang dulu ke "/". */
  const goSection = (id: string, after?: () => void) => {
    after?.();
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        onClick={() => { opts?.onNavigate?.(); setCariBuka(true); }}
        aria-label="Cari"
        title="Cari"
        className={iconBtn}
      >
        <Search className="size-5" />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Ganti mode gelap/terang"
        title="Mode gelap / terang"
        className={iconBtn}
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>

      <Link
        to="/live"
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
      </Link>

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
          "transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          scrolled ? "px-0 pt-0" : "px-3 pt-3 sm:px-5 sm:pt-5"
        )}
      >
        {/* Bar: lebar, bentuk & bayangan beralih mulus mengikuti status scroll.
            max-w-full (bukan max-w-none) agar lebar ikut ter-animasi. */}
        <div
          className={cn(
            "mx-auto overflow-hidden bg-surface/95 backdrop-blur-md transition-[max-width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled
              ? "max-w-full rounded-b-[1.75rem] rounded-t-none shadow-[0_14px_34px_-14px_hsl(320_5%_9%/0.4)]"
              : "max-w-6xl rounded-[1.75rem] shadow-panel ring-1 ring-ink/5"
          )}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => goSection("beranda")}
              className="flex items-center gap-2"
            >
              <img
                src={brandLogo}
                alt="Logo PORA Aceh Jaya"
                className="h-10 w-auto shrink-0"
              />
              <span className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                PORA <span className="text-merah">XV</span>
              </span>
            </button>

            {/* Navigasi desktop */}
            <nav className="hidden items-center gap-7 lg:flex xl:gap-8">
              {mainMenu.map((item) => (
                <MenuLink
                  key={item.id}
                  item={item}
                  className={(active) =>
                    cn(
                      "text-sm font-medium transition hover:text-merah",
                      active ? "text-merah" : "text-ink-soft",
                    )
                  }
                />
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
          <button
            type="button"
            onClick={() => goSection("beranda", () => setIsOpen(false))}
            className="flex items-center gap-2"
          >
            <img
              src={brandLogo}
              alt="Logo PORA Aceh Jaya"
              className="h-10 w-auto shrink-0"
            />
            <span className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              PORA <span className="text-merah">XV</span>
            </span>
          </button>
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
          {mainMenu.map((item) => (
            <MenuLink
              key={item.id}
              item={item}
              onNavigate={() => setIsOpen(false)}
              className={(active) =>
                cn(
                  "rounded-md px-3 py-3 text-left text-base font-medium transition hover:bg-surface-soft hover:text-merah",
                  active ? "text-merah" : "text-ink-soft",
                )
              }
            />
          ))}
        </nav>

        <div className="border-t border-ink/5 px-5 py-4">
          {actions({ className: "justify-center gap-3", onNavigate: () => setIsOpen(false) })}
        </div>
      </aside>

      <SearchModal open={cariBuka} onClose={() => setCariBuka(false)} />
    </header>
  );
}
