# Pimpinan Daerah Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Section foto pimpinan daerah (3 varian, default A via konstanta) di atas pita Kontingen, lalu deploy ke poraxv.id.

**Architecture:** Data + konstanta di `src/data/pimpinan.ts`; komponen `PimpinanDaerah` merender varian dari konstanta, bisa dioverride `?pimpinan=`. Spike di branch `spike/pimpinan-preview` dipoles, digabung ke `main`, dideploy via `deploy-app.sh landing`.

**Tech Stack:** React 19 + TS + Vite + Tailwind 3 (token tema PORA). Repo landing tidak punya test runner → verifikasi = `tsc -b`, `npm run build`, screenshot Chrome headless.

**Spec:** `docs/superpowers/specs/2026-11-20-pimpinan-daerah-design.md`

## Global Constraints
- Tanpa database/CMS; varian = `export const VARIAN_PIMPINAN: VarianPimpinan = "a";`
- Komponen tidak menulis hex; pakai token (bg-surface-dark, text-emas, bg-merah, bg-hijau).
- Foto hanya WebP di `src/assets/pimpinan/` (~70 KB); PNG mentah tidak di-commit.
- Urutan protokol: Gubernur dulu, lalu Bupati.

## Review Focus
- Lebar 320–390 px: tidak ada scroll horizontal, nama tidak terpotong.
- Mode terang & gelap: keterangan tetap terbaca (panel memaksa `--surface` putih).
- `?pimpinan=` bernilai asing (mis. `x`) → jatuh ke konstanta, bukan crash.
- Varian C: tak ada garis/sambungan latar terlihat antara Hero dan section.
- Varian B: interval dibersihkan saat unmount; tombol titik punya aria-label.

---

### Task 1: Data, konstanta, dan poles komponen

**Files:**
- Create: `src/data/pimpinan.ts`
- Modify: `src/components/sections/PimpinanDaerah.tsx`, `src/pages/Home.tsx` (sudah di-wire), `.gitignore`

**Interfaces:**
- Produces: `type VarianPimpinan = "a" | "b" | "c"`, `VARIAN_PIMPINAN`, `interface PaketPimpinan { foto; jabatan; wilayah; nama: [string, string] }`, `paketPimpinan: PaketPimpinan[]`; `PimpinanDaerah()` tanpa props.

- [ ] Pindahkan data PAKET ke `src/data/pimpinan.ts` + konstanta `VARIAN_PIMPINAN = "a"`.
- [ ] `PimpinanDaerah`: baca `?pimpinan=`, terima hanya a|b|c, selain itu pakai konstanta. Hapus komentar "SPIKE".
- [ ] Varian C: hapus `-mt-12` + bagian fade; ganti dengan latar yang menyambung mulus dari fade Hero; keterangan tanpa kotak terlihat.
- [ ] `.gitignore`: tambah `/bupati-dan-wakil.png`, `/gubernur-dan-wakil.png`.
- [ ] Run `npx tsc -b && npm run build` → tanpa error.
- [ ] Screenshot a/b/c di 1440 & 390 (light + dark), periksa Review Focus.
- [ ] Commit di branch spike, merge fast-forward/no-ff ke `main`, push `origin main`.

### Task 2: Deploy prod

- [ ] Di tm: cek `cat deploy-app.status` bukan BERJALAN.
- [ ] `git -C landing pull` → HEAD = commit baru.
- [ ] `setsid nohup ./deploy-app.sh landing </dev/null >/dev/null 2>&1 &`; pantau sampai `SELESAI`.
- [ ] `curl -s https://poraxv.id/ ` 200 dan bundle JS memuat "Wakil Gubernur"; screenshot https://poraxv.id/ dan `?pimpinan=b`, `?pimpinan=c`.
