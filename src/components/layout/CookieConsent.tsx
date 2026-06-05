import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const KEY = "pora-cookie-consent";

/** Banner persetujuan cookie; pilihan disimpan agar tak muncul lagi. */
export function CookieConsent() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    // Tunda sedikit agar tidak muncul bersamaan dengan animasi muat awal.
    const t = setTimeout(() => {
      if (!localStorage.getItem(KEY)) setTampil(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const putuskan = (nilai: "diterima" | "ditolak") => {
    localStorage.setItem(KEY, nilai);
    setTampil(false);
  };

  if (!tampil) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] p-3 sm:p-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl bg-surface-dark p-5 text-surface shadow-panel ring-1 ring-white/10 sm:flex-row sm:items-center">
        <Cookie className="size-8 shrink-0 text-emas" />
        <p className="flex-1 text-sm leading-relaxed text-surface/80">
          Kami menggunakan cookie untuk meningkatkan pengalaman Anda di situs PORA XV. Dengan
          melanjutkan, Anda menyetujui{" "}
          <Link to="/kebijakan-cookie" className="font-semibold text-emas hover:underline">
            Kebijakan Cookie
          </Link>{" "}
          kami.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => putuskan("ditolak")}
            className="rounded-pill border border-surface/30 px-4 py-2 text-sm font-semibold text-surface transition hover:bg-surface/10"
          >
            Tolak
          </button>
          <button
            type="button"
            onClick={() => putuskan("diterima")}
            className="rounded-pill bg-merah px-5 py-2 text-sm font-semibold text-surface transition hover:bg-merah-deep"
          >
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}
