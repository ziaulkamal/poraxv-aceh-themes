import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { SocialIcon } from "../layout/SocialIcon";

/** Target share + warna brand saat hover. */
const TARGETS = [
  { platform: "whatsapp", label: "WhatsApp", hover: "hover:bg-[#25D366] hover:border-[#25D366]" },
  { platform: "telegram", label: "Telegram", hover: "hover:bg-[#229ED9] hover:border-[#229ED9]" },
  { platform: "facebook", label: "Facebook", hover: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
  { platform: "threads", label: "Threads", hover: "hover:bg-black hover:border-black" },
  { platform: "x", label: "X", hover: "hover:bg-black hover:border-black" },
] as const;

/** Bangun URL share per platform. */
function shareHref(platform: string, url: string, text: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${t}%20${u}`;
    case "telegram":
      return `https://t.me/share/url?url=${u}&text=${t}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "threads":
      return `https://www.threads.net/intent/post?text=${t}%20${u}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    default:
      return url;
  }
}

/** Tombol berbagi artikel ke sosial media + salin tautan.
 *  `url` opsional: pakai URL "jembatan" share CMS agar preview OG muncul di sosmed
 *  (SPA/HashRouter tak bisa menyajikan OG per-artikel ke crawler). */
export function ShareButtons({ title, url: urlProp }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const url = urlProp || (typeof window !== "undefined" ? window.location.href : "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* abaikan bila clipboard tak tersedia */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        <Share2 className="size-4 text-merah" /> Bagikan
      </span>
      {TARGETS.map((t) => (
        <a
          key={t.platform}
          href={shareHref(t.platform, url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${t.label}`}
          title={t.label}
          className={`inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface-soft text-ink-soft transition hover:-translate-y-0.5 hover:text-white dark:bg-white/5 ${t.hover}`}
        >
          <SocialIcon platform={t.platform} className="size-[18px]" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Salin tautan"
        title={copied ? "Tersalin!" : "Salin tautan"}
        className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface-soft text-ink-soft transition hover:-translate-y-0.5 hover:border-merah hover:text-merah dark:bg-white/5"
      >
        {copied ? <Check className="size-[18px] text-hijau" /> : <Link2 className="size-[18px]" />}
      </button>
    </div>
  );
}
