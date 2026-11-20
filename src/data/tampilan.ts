import type { MenuNode } from "../lib/api/types";

/**
 * Saklar tampilan beranda (hardcode, tanpa database). Ubah lalu deploy ulang landing.
 * TAMPILKAN_TENTANG = false menyembunyikan section "Tentang PORA" beserta tautannya.
 */
export const TAMPILKAN_TENTANG = false;

/** Id section yang sedang disembunyikan (tautan ke sini ikut disaring). */
const SECTION_TERSEMBUNYI = new Set(TAMPILKAN_TENTANG ? [] : ["tentang"]);

/** True bila id/anchor section sedang disembunyikan ("tentang", "#tentang", "/#tentang"). */
export function sectionTersembunyi(target: string | null | undefined): boolean {
  if (!target) return false;
  return SECTION_TERSEMBUNYI.has(target.replace(/^\/?#?/, ""));
}

/** Buang node menu (rekursif) yang menunjuk ke section tersembunyi — juga untuk menu dari CMS. */
export function saringMenu(nodes: MenuNode[]): MenuNode[] {
  return nodes
    .filter((n) => !(n.type === "ANCHOR" && sectionTersembunyi(n.url)))
    .map((n) => (n.children.length ? { ...n, children: saringMenu(n.children) } : n));
}
