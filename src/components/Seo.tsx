import { useEffect } from "react";
import { useSeoConfig } from "../lib/api/hooks";

type SeoProps = {
  /** Judul halaman (tanpa sufiks nama situs). */
  title?: string;
  description?: string;
  /** URL gambar share; default ke OG default situs. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Structured data schema.org (object atau array). */
  jsonLd?: object | object[];
};

/** Set/replace satu <meta> di <head>. */
function setMeta(attr: "name" | "property", key: string, content: string): void {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set/replace <link rel> di <head>. */
function setLink(rel: string, href: string): void {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Kelola metadata <head> per halaman: title, description, Open Graph, Twitter
 * Card, canonical, dan JSON-LD schema.org. Render null (efek samping ke head).
 *
 * Catatan: WEB ini CSR (HashRouter) — crawler sosmed yang tak menjalankan JS
 * hanya melihat tag statis di index.html. Untuk pratinjau share per-artikel
 * yang andal, perlu SSR/prerender (lihat catatan di PR).
 */
export function Seo({ title, description, image, type = "website", publishedTime, jsonLd }: SeoProps) {
  const cfg = useSeoConfig();
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = title ? `${title} — ${cfg.siteName}` : cfg.siteName;
    const desc = description ?? "";
    const img = image || cfg.defaultImage;
    const url = typeof window !== "undefined" ? window.location.href : cfg.baseUrl;

    setMeta("name", "description", desc);
    setLink("canonical", url);

    setMeta("property", "og:title", title || cfg.siteName);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", cfg.siteName);
    setMeta("property", "og:image", img);
    if (publishedTime) setMeta("property", "article:published_time", publishedTime);

    setMeta("name", "twitter:card", img ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", title || cfg.siteName);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);
    if (cfg.twitterHandle) setMeta("name", "twitter:site", cfg.twitterHandle);

    const id = "seo-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (ld) {
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = ld;
    } else if (script) {
      script.remove();
    }
  }, [title, description, image, type, publishedTime, ld, cfg.siteName, cfg.defaultImage, cfg.baseUrl, cfg.twitterHandle]);

  return null;
}
