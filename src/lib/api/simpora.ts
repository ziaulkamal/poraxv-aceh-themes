/** src/lib/api/simpora.ts — client read-only simpora2026 (data olahraga); ekstraksi paginator defensif. */
import axios from "axios";
import type { AxiosInstance } from "axios";
import { API_CONFIG } from "./config";

/** Envelope respons simpora2026 (Laravel); `data` bisa objek atau paginator. */
export interface SimporaEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
}

/** Instance axios simpora2026 (read-only). */
export const simporaClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.simporaUrl,
  timeout: 12000,
  headers: { Accept: "application/json" },
});

/** GET objek tunggal simpora → `data`. */
export async function simporaGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await simporaClient.get<SimporaEnvelope<T>>(url, { params });
  return res.data.data;
}

/**
 * GET daftar simpora dengan ekstraksi defensif: dukung `data` array langsung
 * maupun paginator Laravel (`data.data`). Selalu kembalikan array.
 */
export async function simporaList<T>(url: string, params?: Record<string, unknown>): Promise<T[]> {
  const res = await simporaClient.get<SimporaEnvelope<unknown>>(url, { params });
  const raw = res.data?.data;
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: T[] }).data;
  }
  return [];
}
