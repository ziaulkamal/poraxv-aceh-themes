/** src/lib/tautan.ts — util tautan: slug anchor heading & tracker referrer keluar. */

/** Slug ringkas untuk id anchor heading (judul bagian → "judul-bagian"). */
export function slugAnchor(teks: string): string {
  const s = teks
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return s || "bagian";
}

/** True bila href menuju situs LUAR (http/https absolut dgn host berbeda). */
export function tautanKeluar(href: string, siteUrl?: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false; // anchor/relatif/mailto → internal
  try {
    const tujuan = new URL(href);
    const asal = siteUrl
      ? new URL(siteUrl).host
      : typeof window !== "undefined"
        ? window.location.host
        : "";
    return !!asal && tujuan.host !== asal;
  } catch {
    return false;
  }
}

/** Tambahkan tracker `?refferer=<situs>` pada tautan keluar; internal apa adanya. */
export function hrefDenganReferrer(href: string, siteUrl: string): string {
  if (!siteUrl || !tautanKeluar(href, siteUrl)) return href;
  try {
    const u = new URL(href);
    if (!u.searchParams.has("refferer")) u.searchParams.set("refferer", siteUrl);
    return u.toString();
  } catch {
    return href;
  }
}
