/** src/lib/api/cms.ts — client cms-media (read+write konten); unwrap envelope {success,data,meta}. */
import axios from "axios";
import type { AxiosInstance } from "axios";
import { API_CONFIG } from "./config";

/** Meta paginasi cms-media. */
export interface CmsMeta {
  total?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

/** Envelope respons cms-media. */
export interface CmsEnvelope<T> {
  success: boolean;
  data: T;
  meta?: CmsMeta;
  message?: string;
}

/** Instance axios cms-media (timeout + header default). */
export const cmsClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.cmsUrl,
  timeout: 12000,
  headers: { Accept: "application/json" },
});

/** GET cms-media → payload `data` (envelope di-unwrap). */
export async function cmsGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await cmsClient.get<CmsEnvelope<T>>(url, { params });
  return res.data.data;
}

/** GET cms-media yang juga butuh `meta` (paginasi). */
export async function cmsGetWithMeta<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<{ data: T; meta?: CmsMeta }> {
  const res = await cmsClient.get<CmsEnvelope<T>>(url, { params });
  return { data: res.data.data, meta: res.data.meta };
}

/** GET daftar cms-media; ekstraksi array defensif (data | data.items | data.data). */
export async function cmsList<T>(url: string, params?: Record<string, unknown>): Promise<T[]> {
  const res = await cmsClient.get<CmsEnvelope<unknown>>(url, { params });
  const raw = res.data?.data;
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as { items?: unknown; data?: unknown };
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

/** POST cms-media (tulis publik: komentar/suka/kontak) → payload `data`. */
export async function cmsPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await cmsClient.post<CmsEnvelope<T>>(url, body);
  return res.data.data;
}
