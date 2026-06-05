# PRD — Backend & Admin PORA XV Aceh Jaya

> **Product Requirements Document** — pemetaan seluruh fitur **frontend publik** (`PoraAcehJaya-FE`)
> ke modul **backend + admin** pada ekosistem yang sudah ada.
> Tujuan: dokumen ini cukup detail untuk dieksekusi **sekali jalan** saat di-prompt ke agent.

| Versi | Tanggal | Status | Owner |
|-------|---------|--------|-------|
| v2.0.0 | 2026-06-06 | Final (pasca penegasan arsitektur) | Product / Ziaul Kamal |

Dokumen pendamping:
- **[TODO-BACKEND.txt](TODO-BACKEND.txt)** — checklist pengerjaan bertahap (FE).
- **[ALUR-KERJA.md](ALUR-KERJA.md)** — alur kerja admin → trigger → frontend.
- **todos per repo**: `cms-media/todos.txt` (FASE 10), `simpora2026/todos.txt`, `starter-laravel-tailwindcss/todos.txt`.

---

## 0. Aturan Arsitektur yang Mengikat (penegasan user 2026-06-06)

1. **`PoraAcehJaya-FE` = lapisan presentasi murni.** Hanya menerima, routing, dan sync data dari 2 core.
   Tidak ada business logic / DB di sini.
2. **`cms-media` = rumah semua penyesuaian demi FE.** Fitur baru (Gallery, Kontak, Live Streaming,
   komentar thread+like, **layer real-time**, enrichment venue) **ditaruh di cms-media**, bukan simpora2026.
3. **`simpora2026` = API murni.** Hanya peduli pada API yang dikeluarkan & dipakai oleh
   `starter-laravel-tailwindcss` dan `PoraAcehJaya-FE`. **DILARANG menambah modul** di sini tanpa approval.
   Hasil keputusan: simpora2026 **tidak diubah** kecuali **menambah origin FE ke CORS allowlist**.
4. **`starter-laravel-tailwindcss` = admin olahraga.** **Tidak diubah** untuk integrasi FE ini.
5. Setiap perubahan di simpora2026 (di luar CORS) atau starter-laravel **wajib di-flag & disetujui** dulu.

> Keputusan penempatan (terkonfirmasi): Live Streaming → **cms-media**; Real-time (live skor/klasemen) →
> **gateway WebSocket di cms-media** yang poll API publik simpora2026; Deskripsi+foto venue → **enrichment di cms-media**.

---

## 1. Ringkasan Eksekutif

Frontend publik PORA XV (React 19 + Vite + React Router) saat ini **100% data statis** (`src/data/*.ts`). Sasaran:

1. **Menyambungkan** FE ke dua backend yang **sudah ada & matang** (read + tulis publik terbatas + real-time).
2. **Mengisi gap di cms-media**: Live Streaming, gateway real-time, galeri publik, komentar berjenjang+suka,
   inbox kontak, enrichment venue, key setting event/sosial.
3. **simpora2026 dipakai apa adanya** (API publik yang sudah ada) — hanya tambah CORS untuk origin FE.

> **Temuan audit kode (2026-06-06):**
> - **simpora2026** (Laravel/MySQL) sudah punya endpoint **baca-publik**: `/matches`(+`/result`,`/medals`),
>   `/leaderboard`(+`/by-sport`), `/sports`(+`{id}`), `/sport-categories`(+`/standings`,`/bracket`), `/venues`(+`{id}`).
> - **cms-media** (NestJS/PostgreSQL) **Fase 0–8 selesai**: Articles (workflow editorial), Categories, Tags, Media,
>   Comments (moderasi, **flat**), Pages (statis), Settings, Ads, Auth/RBAC.
> - **Belum ada (akan dibangun di cms-media)**: Live Streaming, gateway WebSocket, Gallery publik
>   (caption/kategori/orientasi), komentar berjenjang+suka, inbox kontak, enrichment venue.

---

## 2. Arsitektur Ekosistem (final)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PoraAcehJaya-FE  — React 19 + Vite + React Router  (REPO INI, presentasi) │
│   • HTTP read  → simpora2026 (data olahraga)  +  cms-media (media & dst.)   │
│   • HTTP write → cms-media (komentar, suka, kontak)                         │
│   • WebSocket  → cms-media gateway (socket.io): skor/klasemen/streaming     │
└───────┬───────────────────────────────┬───────────────────────────────────┘
        │ REST (read, langsung)          │ REST (read+write) + WebSocket
        ▼                                ▼
┌───────────────────────────┐   ┌──────────────────────────────────────────┐
│ simpora2026 (Laravel/MySQL)│   │ cms-media (NestJS/PostgreSQL)             │
│ API MURNI — TIDAK DIUBAH   │   │ RUMAH KONTEN + PENYESUAIAN FE             │
│ (kecuali CORS allow FE)    │   │                                          │
│  Sports, SportCategories,  │   │  Articles, Categories, Tags, Media,      │
│  Venues(core), Matches,    │   │  Comments(+thread+like), Pages, Settings,│
│  Results, Leaderboard,     │   │  Ads                                     │
│  Medals, Lineups, Judges   │   │  + [BARU] Gallery                        │
│                            │   │  + [BARU] ContactMessage (inbox)         │
│ ADMIN ▲ starter-laravel-   │   │  + [BARU] LiveStream (kanal+toggle+view) │
│   tailwindcss (TAK DIUBAH) │   │  + [BARU] VenueContent (deskripsi+foto)  │
│                            │   │  + [BARU] Realtime Gateway (socket.io)   │
│                            │   │            └ poll API simpora2026 → relay │
│                            │   │  ADMIN ▲ cms-media/admin                  │
└───────────────────────────┘   └──────────────────────────────────────────┘
        ▲ server-to-server poll (gateway cms-media → API publik simpora2026)
        └───────────────────────────────────────────────────────────────────┘
```

**SSOT (sumber kebenaran):**

| Domain | Pemilik data | Catatan |
|---|---|---|
| Cabor, sub-cabor, kontingen, venue-core, jadwal, skor, klasemen, medali, atlet, juri | **simpora2026** | dibaca FE & gateway cms-media |
| Berita, kategori, tag, media, komentar, halaman, setting, iklan, **galeri, kontak, live stream, enrichment venue** | **cms-media** | |
| Logo + nama 23 kab/kota (referensi statis) | **FE (bundle)** | data tetap; tak perlu endpoint |

---

## 3. Prinsip Integrasi Frontend ↔ Backend

### 3.1 Lapisan data FE baru (`src/lib/api/`)

```
src/lib/api/
├── simpora.ts      # client read-only ke VITE_SIMPORA_API_URL (envelope {success,message,data,meta})
├── cms.ts          # client ke VITE_CMS_API_URL (envelope {success,data,meta})
├── socket.ts       # socket.io-client → VITE_CMS_WS_URL (real-time dari gateway cms-media)
├── adapters/
│   ├── sports.ts   # simpora → Cabor, Venue(core), JadwalItem, MedaliKontingen, Pertandingan
│   └── media.ts    # cms → Berita, Artikel, Komentar, Foto, LiveChannel, VenueContent
└── hooks/          # React Query: useCabor(), useKlasemen(), useArtikel(slug), useStreaming()…
```

- **Envelope adapter wajib** (beda antar backend):
  - simpora2026: `{success,message,data,meta}`; list = paginator → ekstraksi defensif:
    ```ts
    const raw = res.data?.data;
    const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    ```
  - cms-media: `{success,data,meta?}`.
- Adapter memetakan ke **tipe FE yang sudah ada** (`src/types/index.ts`) → komponen nyaris tak berubah.

### 3.2 State, caching, real-time

- **TanStack Query** untuk fetch/cache/retry. `staleTime`: statis (cabor/venue/pages/settings) 5–30 mnt;
  berita 1–2 mnt; data live → **tanpa polling di FE**, di-*invalidate* oleh event socket.
- **socket.io-client** mendengar gateway cms-media → `invalidateQueries`/`setQueryData`.

### 3.3 `.env` frontend

```
VITE_SIMPORA_API_URL=https://api-simpora.pora-acehjaya.id   # read data olahraga (langsung)
VITE_CMS_API_URL=https://api-cms.pora-acehjaya.id           # read+write media/konten
VITE_CMS_WS_URL=https://api-cms.pora-acehjaya.id            # socket.io gateway (real-time)
```

> Dependency FE baru: `@tanstack/react-query`, `axios`, `socket.io-client`.
> (Bukan `laravel-echo`/`pusher-js` — real-time kini via Socket.IO cms-media, bukan Reverb.)

### 3.4 CORS

- **simpora2026**: tambah origin FE (prod + `http://localhost:5173`) ke allowlist. **Ini satu-satunya sentuhan ke simpora2026.**
- **cms-media**: whitelist origin FE untuk REST + Socket.IO.

---

## 4. Peta Modul: Fitur Frontend → Backend (final)

| # | Fitur Frontend | Pemilik | Modul | Status | Pekerjaan |
|---|---|---|---|---|---|
| 1 | Info event + countdown | cms-media | **Settings** | ✅ ada | + key publik + wiring FE |
| 2 | Kanal sosial | cms-media | **Settings** | ✅ ada | + key publik + wiring FE |
| 3 | Cabang Olahraga (29 cabor) | simpora2026 | **Sports** | ✅ publik | wiring FE (read) |
| 4 | Kontingen (23 kab/kota + logo) | **FE (statis)** | — | ✅ bundle | tetap statis / nama via leaderboard |
| 5 | Klasemen Medali | simpora2026 | **Leaderboard** | ✅ publik | wiring + **real-time (gateway)** |
| 6 | Jadwal | simpora2026 | **Matches** | ✅ publik | wiring FE (wall-clock) |
| 7 | Live Skor | simpora2026 | **Matches+Results** | ✅ publik | wiring + **real-time (gateway)** |
| 8 | Venue (core: nama/lokasi/kapasitas/peta) | simpora2026 | **Venues** | ✅ publik | wiring FE (read) |
| 8b | Venue (deskripsi + foto) | **cms-media** | **VenueContent (BARU)** | ❌ gap | bangun enrichment + gabung di FE |
| 9 | Live Streaming (kanal+toggle+penonton) | **cms-media** | **LiveStream (BARU)** | ❌ gap | bangun modul + real-time |
| 10 | Berita & Artikel (blok isi) | cms-media | **Articles** | ✅ publik | wiring + serializer blok |
| 11 | Komentar (berjenjang+suka+badge) | cms-media | **Comments** | ⚠️ flat | **tambah thread+like** + wiring |
| 12 | Galeri Foto | cms-media | **Gallery (BARU)** | ❌ gap | bangun modul + wiring |
| 13 | Kontak (form → inbox) | cms-media | **ContactMessage (BARU)** | ❌ gap | bangun modul + inbox admin |
| 14 | Halaman statis (Syarat, Kebijakan Cookie) | cms-media | **Pages** | ✅ ada | isi konten + wiring |
| 15 | Pencarian global | both | **Search (agregasi FE)** | ⚠️ wiring | gabung cms + simpora di FE |
| 16 | Cookie consent | — | (klien) | — | localStorage, tanpa BE |
| 17 | Statistik "Tentang" | **FE (derive)** | — | ⚠️ derive | hitung dari list yang sudah di-fetch |

Legenda: ✅ cukup · ⚠️ perlu penyesuaian · ❌ bangun baru.

---

## 5. Domain Olahraga (simpora2026) — DIPAKAI APA ADANYA

> **Tidak ada modul baru. Tidak ada perubahan kode.** FE & gateway cms-media mengonsumsi endpoint publik
> yang sudah ada. Satu-satunya penyesuaian: **CORS allowlist origin FE**. (Kontrak ada di `simpora2026/todos.txt`.)

| Fitur FE | Endpoint publik dipakai | Adapter → tipe FE |
|---|---|---|
| Cabor | `GET /sports`, `/sports/{id}`, `/sport-categories?sport_id` | `Cabor{nama←name, iconSrc←maskot/fallback FE by code, jumlahNomor←count sub-cabor}` |
| Venue core | `GET /venues`, `/venues/{id}` | `Venue{nama←name, lokasi←address/wilayah, cabor[]←sub-cabor, kapasitas←capacity}` (image/deskripsi dari cms VenueContent) |
| Jadwal | `GET /matches?from&to&sport_id&status` | `JadwalItem{tanggal/waktu←scheduled_at WALL-CLOCK, cabor←sport.name, acara, venue}` |
| Live skor | `GET /matches?status=ongoing`, `/matches/{id}/result` | `Pertandingan{status: ongoing→live/finished→selesai/…, a/b←participants, set←result_data.sets}` |
| Klasemen | `GET /leaderboard`, `/leaderboard/by-sport` | `MedaliKontingen{peringkat←rank, kontingen←contingent.name, emas/perak/perunggu←gold/silver/bronze}` |

> ⚠️ **Wall-clock**: `scheduled_at` di-parse literal (`Y-M-D H:M`), jangan `new Date(ISO)` (geser +7 WIB).
> ⚠️ Verifikasi nama field medali (`gold/silver/bronze`) di `LeaderboardController` saat wiring.
> **Kontingen**: 23 kab/kota = referensi statis (logo bundel di `src/assets/kontingen`). Tak perlu endpoint baru.
> **Stats "Tentang"**: derive di FE dari panjang list (cabor/venue) + (opsional) angka manual atlet.

---

## 6. Domain Media (cms-media) — RUMAH SEMUA PEKERJAAN

> NestJS, Prisma, PostgreSQL. Admin `cms-media/admin`. Envelope `{success,data,meta?}`, prefix `/api/v1`.
> Detail tugas terurut → `cms-media/todos.txt` (FASE 10).

### 6.1 Settings (Event + Sosial) — ✅ ada, + key

Key publik baru (`isPublic=true`): `event_edisi, event_nama_panjang, event_tuan_rumah, event_kota,
event_tanggal_mulai, event_tanggal_selesai, event_tagline, social_facebook, social_instagram,
social_threads, social_tiktok, social_x`. **`streaming_enabled`** (master saklar siaran) juga di sini.
`GET /settings/public` → map `{key:value}`. FE ganti objek `event` & `socials`.

### 6.2 Articles (Berita & Artikel) — ✅ ada

- `body` artikel dikembalikan sebagai **blok kompatibel FE**: `[{tipe:paragraf|subjudul|kutipan, teks}]` (sediakan serializer di response publik).
- Publik: `GET /articles?status=published&category&tag&q&page`, `GET /articles/:slug` (increment `viewCount`).
- Adapter: `kategori←category.name, tanggal←publishedAt, image←featuredMedia.url, ringkasan←excerpt,
  penulis←author.name, durasiBaca←kata/200wpm, isi←body`.

### 6.3 Comments — ⚠️ PERLUAS: berjenjang + suka

- Migration: `+ parentId (uuid? FK self), + likeCount (int 0), + authorEmail (string?)`.
- Service: build **tree** APPROVED (root + `balasan[]`), badge `isAdmin = userId ada & role staf`, **email tak dibalikan**.
- Publik: `GET /articles/:slug/comments` (tree), `POST /articles/:slug/comments {authorName,authorEmail,body,parentId?}` (PENDING, rate-limit 5/mnt), `POST /comments/:id/like` (dedup device).
- FE: setelah submit tampilkan "menunggu moderasi" (bukan optimistik tampil).

### 6.4 Gallery — ❌ BANGUN BARU (di atas Media)

- Model `GalleryPhoto { id, mediaId→media, caption, category, orientation enum(POTRET/LANSKAP/KOTAK), albumId?, sortOrder, isPublished }` (orientasi auto dari `media.width/height` bila kosong).
- Publik: `GET /gallery?category&album&page` → `[{id, src←media.url, caption, kategori←category, orientasi}]`.
- Admin: upload via Media → set caption/kategori/orientasi/urutan.

### 6.5 ContactMessage — ❌ BANGUN BARU (inbox)

- Model `ContactMessage { id, name, email, subject, message, status enum(NEW/READ/REPLIED/SPAM/ARCHIVED), ipAddress?, userAgent?, createdAt }`.
- Publik: `POST /contact {name,email,subject,message}` (validasi + rate-limit 3/mnt + honeypot).
- Admin: `GET /contact` (filter+paginate), `PATCH /contact/:id` (status), `DELETE`; opsional email ke `info@pora-acehjaya.id`.
- Admin UI: **Inbox Kontak** (badge NEW, detail, tandai dibaca/dibalas/spam).

### 6.6 LiveStream — ❌ BANGUN BARU (kanal + toggle + penonton)

- Model `LiveStream { id, youtubeId, sportName?, matchRef?, title, venueName?, viewerCount int 0, isLive bool, sortOrder, createdAt, updatedAt }`.
  (Referensi cabor/venue **by nama** — loose; tak perlu FK ke simpora2026.)
- Master saklar = Setting `streaming_enabled`.
- Publik: `GET /live-streams` → `{ streaming_enabled, channels:[{id, youtubeId, cabor←sportName, judul←title, venue←venueName, penonton←viewerCount}] }`.
- Admin: `POST/PUT/DELETE /live-streams`, `PATCH /live-streams/:id/toggle`, `PATCH /settings streaming_enabled`. Helper ekstrak `youtubeId` dari URL paste.
- **Real-time**: mutasi → emit event socket (lihat §7). Penonton: cron cms-media (opsional YouTube Data API) update `viewerCount` → emit.

### 6.7 VenueContent (enrichment venue) — ❌ BANGUN BARU

- Model `VenueContent { id, venueRef (id/slug venue simpora2026), description text, imageMediaId?→media, gallery?[], updatedAt }`.
- Publik: `GET /venue-content?ref=…` atau `GET /venue-content/:ref`.
- FE menggabungkan: **core** (nama/lokasi/kapasitas/peta) dari simpora2026 + **deskripsi/foto** dari cms-media (by `venueRef`).
- Admin: form kelola deskripsi + upload foto per venue (dropdown venue di-fetch dari API simpora2026 read-only).

### 6.8 Pages — ✅ ada

`GET /pages/:slug` (PUBLISHED). Isi `syarat-ketentuan`, `kebijakan-cookie` (`isMandatory=true`). FE render `body` blok.

### 6.9 Realtime Gateway (socket.io) — ❌ BANGUN BARU

Modul NestJS yang **menyatukan real-time** untuk FE (lihat §7). Dua sumber:
- **Poll** API publik simpora2026 (`/matches?status=ongoing`, `/leaderboard`) tiap 3–5 dtk → diff → emit skor/status/klasemen.
- **Native** dari mutasi cms-media (LiveStream toggle/CRUD, viewer cron) → emit streaming/penonton.

---

## 7. Arsitektur Real-time (Gateway socket.io di cms-media)

### 7.1 Kenapa di cms-media

simpora2026 = API murni (tak boleh tambah broadcasting). Maka real-time ditangani **gateway cms-media** yang
**poll** endpoint publik simpora2026 (server-to-server) lalu **relay** ke FE via Socket.IO. Stream & komentar
disiarkan native karena datanya milik cms-media.

### 7.2 Room & event (namespace publik, read-only)

| Room | Event | Payload | Sumber |
|---|---|---|---|
| `live-scores` | `match.score.updated` | `{matchId, skorA, skorB, set?, klok}` | poll simpora `/matches?status=ongoing` (+`/result`) |
| `live-scores` | `match.status.updated` | `{matchId, status}` | poll perubahan status |
| `match:{id}` | `match.score.updated`/`status.updated` | detail 1 match | poll/diff |
| `standings` | `leaderboard.updated` | `{updatedAt}` (FE refetch) | poll simpora `/leaderboard` (hash berubah) |
| `streaming` | `streaming.toggled` | `{enabled}` | mutasi Setting cms |
| `streaming` | `stream.updated` | `{channels:[…]}` / `{streamId,isLive}` | mutasi LiveStream cms |
| `stream:{id}` | `stream.viewers` | `{streamId, penonton}` | cron viewer cms |

### 7.3 Poller (NestJS @nestjs/schedule)

```ts
@Interval(4000)
async pollLiveScores() {
  const matches = await this.simpora.get('/matches?status=ongoing'); // axios server-side
  const next = normalize(matches);
  diff(this.prevScores, next).forEach(d =>
    this.gateway.server.to('live-scores').to(`match:${d.matchId}`).emit('match.score.updated', d));
  // leaderboard: bandingkan hash → emit 'leaderboard.updated' ke room 'standings'
  this.prevScores = next;
}
```

### 7.4 Konsumsi FE (socket.io-client + React Query)

```ts
const socket = io(import.meta.env.VITE_CMS_WS_URL, { transports: ['websocket'] });
socket.on('match.score.updated', e => {
  queryClient.setQueryData(['match', e.matchId], o => ({ ...o, ...e }));
  queryClient.invalidateQueries({ queryKey: ['matches','live'] });
});
socket.on('leaderboard.updated', () => queryClient.invalidateQueries({ queryKey: ['leaderboard'] }));
socket.on('streaming.toggled', e => queryClient.setQueryData(['streaming'], o => ({ ...o, enabled: e.enabled })));
```
Berlangganan di: `LivePage`, `KlasemenPage`, `KlasemenMedali`, `LiveStreaming`, `JadwalRingkas` (status).

### 7.5 Catatan

- Latensi ≈ interval poll (3–5 dtk) — memadai untuk skor pertandingan.
- simpora2026 menerima **1 poller** (gateway), bukan ribuan klien → beban kecil & stabil.
- Bila gateway/socket mati: React Query tetap menyajikan data cache + `refetchOnReconnect`.

---

## 8. Pencarian Global (agregasi di FE)

`SearchModal` menggabungkan: `GET cms /articles?q` (Berita) + `GET simpora /sports,/venues,/matches` +
`GET cms /live-streams` (Siaran). Map ke `Hasil{tipe,judul,sub,to,section?,streamId?}`; debounce 250ms; maks 8.
(BFF tunggal opsional di kemudian hari.)

---

## 9. Keamanan & Non-Fungsional

- **RBAC cms-media** (ADMIN/EDITOR/AUTHOR/CONTRIBUTOR): moderasi komentar & inbox kontak = EDITOR+; galeri & live stream = EDITOR/AUTHOR.
- **simpora2026** RBAC tak berubah.
- **Endpoint baca-publik** (dikonsumsi FE):
  - simpora2026: `/sports(+{id})`, `/sport-categories(+standings/bracket)`, `/venues(+{id})`, `/matches(+{id}/result,/medals)`, `/leaderboard(+by-sport)`.
  - cms-media: `/settings/public`, `/articles(+:slug)`, `/articles/:slug/comments`, `/gallery`, `/pages/:slug`, `/live-streams`, `/venue-content`, `/ads/slots/:key/serve`; **POST** `/articles/:slug/comments`, `/comments/:id/like`, `/contact`.
- **Rate-limit tulis publik**: komentar 5/mnt, kontak 3/mnt, suka throttle+dedup; sanitasi anti-XSS.
- **Cache**: React Query + `Cache-Control: public, max-age=60, stale-while-revalidate` di endpoint baca.

---

## 10. Rencana Migrasi FE (statis → API)

Urutan aman (tiap entitas: hook → swap import → hapus statis), dengan loading/empty/error state:

1. **Infra FE**: `@tanstack/react-query`, `axios`, `socket.io-client`; `src/lib/api/*`; QueryClientProvider; `.env`.
2. **Settings/Event** (cms) → `event`, `socials`.
3. **Pages** (cms) → `SyaratKetentuanPage`, `KebijakanCookiePage`.
4. **Berita/Artikel** (cms) → `Berita`, `BeritaPage`, `ArtikelPage`.
5. **Komentar** (cms) → `KomentarSection` (kirim/suka).
6. **Galeri** (cms) → `GaleriPage`.
7. **Kontak** (cms) → `KontakPage`.
8. **Cabor/Venue/Jadwal/Klasemen/Live skor** (simpora read) → sections & pages terkait.
9. **Venue enrichment** (cms VenueContent) → gabung di `Venue`/`VenuePage`.
10. **Live Streaming** (cms) → `LiveStreaming`.
11. **Real-time** (socket cms) → listeners di `LivePage`, `KlasemenPage`, `KlasemenMedali`, `LiveStreaming`.
12. **Search** agregasi → `SearchModal`.
13. **Hapus** `src/data/*.ts` yang tak terpakai (kecuali `kontingen.ts` = referensi statis yang dipertahankan).

---

## 11. Catatan SEO / Hosting (opsional)

FE `HashRouter` + GitHub Pages (CSR). Untuk SEO berita: pertimbangkan SSR/pre-render + `BrowserRouter` +
`sitemap.xml` dinamis. Di luar jalur kritis fungsional.

---

## 12. Definition of Done (per modul)

- [ ] Endpoint mengembalikan bentuk yang **langsung** dipetakan adapter ke tipe FE.
- [ ] Komponen FE baca dari API (bukan `src/data`), dengan loading/empty/error.
- [ ] Tulis publik (komentar/suka/kontak) divalidasi + rate-limit + moderasi/inbox.
- [ ] Real-time: ubah di admin → tampil di FE tanpa reload (skor, klasemen, siaran, penonton).
- [ ] Admin cms-media punya CRUD/aksi + RBAC.
- [ ] **simpora2026 & starter-laravel tetap tak berubah** (kecuali CORS allowlist simpora2026).
