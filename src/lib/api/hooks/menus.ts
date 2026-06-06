/**
 * src/lib/api/hooks/menus.ts — menu WEB dari cms-media (Main/Footer/Bawah Footer).
 * Dikelola via CMS; komponen tetap menyediakan fallback statis bila API kosong.
 */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { cmsGet } from "../cms";
import { qk } from "../queryKeys";
import type { MenusPayload } from "../types";

/** Ambil seluruh menu publik tergrup per lokasi (sekali fetch). */
export function useMenus(): UseQueryResult<MenusPayload> {
  return useQuery({
    queryKey: qk.menus,
    queryFn: () => cmsGet<MenusPayload>("/menus"),
    staleTime: 5 * 60 * 1000, // menu jarang berubah
  });
}
