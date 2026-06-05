# Alur Kerja — Backend → Trigger → Frontend (PORA XV)

> Bagaimana admin bekerja, lalu perubahannya **sampai ke pengunjung** di FE publik.
> Arsitektur final (penegasan 2026-06-06): **cms-media = rumah kerja & real-time**; **simpora2026 = API murni**
> (dipoll oleh gateway cms-media, tidak diubah); **starter-laravel = admin olahraga (tak berubah)**.
> Acuan: [PRD-BACKEND-ADMIN.md](PRD-BACKEND-ADMIN.md) · [TODO-BACKEND.txt](TODO-BACKEND.txt)

---

## 0. Peta dua jalur data

```
   ADMIN OLAHRAGA                      ADMIN MEDIA
   starter-laravel-tailwindcss         cms-media/admin
        │ tulis (skor, jadwal, dst)         │ tulis (artikel, galeri, stream, dst)
        ▼                                    ▼
   simpora2026 (Laravel/MySQL)          cms-media (NestJS/PostgreSQL)
   API MURNI — simpan + sajikan REST    simpan + sajikan REST + Socket.IO
        ▲                                    │
        │ poll server-to-server (REST)       │ emit native (stream/komentar)
        └────────────► REALTIME GATEWAY (di cms-media) ◄──────┘
                              │ Socket.IO
                              ▼
                   FRONTEND PUBLIK (PoraAcehJaya-FE)
                   React Query (cache HTTP) + socket.io-client (real-time)
```

- **JALUR BACA (HTTP)**: FE menarik langsung — data olahraga dari simpora2026, konten dari cms-media.
- **JALUR REAL-TIME (Socket.IO via cms-media)**: skor/klasemen (hasil poll simpora2026) + streaming/penonton (native cms).

---

## 1. Live Skor (real-time) — alur utama

**Aktor**: Juri/Admin Penilaian (starter-laravel) → pengunjung `LivePage`. simpora2026 **tidak** broadcast;
gateway cms-media yang mem-poll lalu relay.

```
Juri        starter-admin      simpora2026 (API)      cms-media GATEWAY        FE (socket+Query)   Pengunjung
 │ input skor  │                    │                       │                       │                │
 │────────────>│ PUT /matches/{id}/result {skor,set}        │                       │                │
 │             │───────────────────>│ simpan match_results  │                       │                │
 │             │  200 OK             │ (TIDAK broadcast)     │                       │                │
 │             │<───────────────────│                       │                       │                │
 │             │                    │  ◄─── poll tiap 3-5s ──│ GET /matches?status=ongoing (+/result)│
 │             │                    │───────data────────────>│ diff vs snapshot      │                │
 │             │                    │                       │ emit 'match.score.updated'             │
 │             │                    │                       │──ws: live-scores──────>│                │
 │             │                    │                       │──ws: match:{id}───────>│ setQueryData   │
 │             │                    │                       │                       │ + invalidate   │
 │             │                    │                       │                       │ re-render skor─>│
```

**Gateway cms-media (NestJS):**
- `@Interval(4000)` poll `GET {SIMPORA}/matches?status=ongoing` (+ `/matches/{id}/result`).
- Diff terhadap snapshot terakhir → `server.to('live-scores').to('match:'+id).emit('match.score.updated', payload)`.
- Status berubah → `match.status.updated`.

**FE:** `socket.on('match.score.updated', e => { setQueryData(['match',e.matchId]); invalidate(['matches','live']) })`.

---

## 2. Klasemen Medali (real-time)

```
Admin Penilaian → starter-admin → simpora: PATCH status finished / POST medals  (simpora hitung agregasi)
cms-media gateway: poll GET /leaderboard tiap 3-5s → hash berubah → emit 'leaderboard.updated' (room standings)
FE: socket.on('leaderboard.updated') → invalidate(['leaderboard']) → refetch GET /leaderboard
KlasemenMedali & KlasemenPage re-render peringkat baru
```
Payload cukup `{updatedAt}`; FE refetch sumber kebenaran agar konsisten.

---

## 3. Live Streaming (real-time, native di cms-media)

```
(a) MASTER SAKLAR
Panitia → cms/admin: PATCH /settings streaming_enabled=true
        cms: simpan + gateway emit 'streaming.toggled' {enabled} (room streaming)
        FE: setQueryData(['streaming'], o=>({...o,enabled:true})) -> section muncul/hilang

(b) KANAL
Panitia → cms/admin: POST /live-streams {youtubeId,sportName,venueName,title} / PATCH /:id/toggle
        cms: simpan + emit 'stream.updated' (room streaming)
        FE: invalidate(['streaming']) -> refetch GET /live-streams -> grid YouTube diperbarui

(c) PENONTON
cron cms (opsional YouTube Data API tiap 15-30s) update viewerCount
        cms: emit 'stream.viewers' {streamId,penonton} (room stream:{id})
        FE: update angka penonton kartu terkait
```

---

## 4. Berita / Artikel (NON real-time)

```
Author → cms: DRAFT → submit (IN_REVIEW)
Editor → cms: PUBLISH/SCHEDULE  (transaksi: status=PUBLISHED, publishedAt, Revision)
        artikel muncul di GET /articles?status=published & /articles/:slug
FE: React Query staleTime pendek + refetchOnWindowFocus → pembaca lihat saat buka/refresh
SCHEDULED tampil otomatis saat publishedAt<=now.
```
Tanpa WebSocket — berita bukan data per-detik.

---

## 5. Komentar (tulis publik + moderasi)

```
Pembaca → FE: nama+email+isi (atau balas) → POST /articles/:slug/comments (rate-limit 5/mnt) -> status PENDING
FE: tampilkan "menunggu moderasi" (TIDAK langsung publik)
Editor → cms/admin: APPROVE / SPAM
Pembaca lain: GET /articles/:slug/comments -> tree APPROVED (root + balasan[]), email TIDAK dibalikan,
              badge "Panitia" bila dibuat user staf
SUKA: POST /comments/:id/like (dedup device/cookie) -> likeCount++ ; FE simpan set 'liked' lokal
```

---

## 6. Kontak (tulis publik → inbox)

```
Pengunjung → FE KontakPage → POST /contact (validasi + rate-limit 3/mnt + honeypot)
        cms: simpan ContactMessage status=NEW (+ip,ua) [+ opsional email ke info@pora-acehjaya.id]
        FE: "Pesan terkirim!"
Admin → cms/admin Inbox: badge NEW → buka → tandai READ/REPLIED/SPAM/ARCHIVED
```

---

## 7. Konten Statis & Setting + Venue Enrichment

```
Admin → cms: ubah Settings (event_*, social_*) / Page (syarat,kebijakan) / VenueContent (deskripsi+foto)
        GET /settings/public, /pages/:slug, /venue-content mengembalikan nilai baru
FE: useSettings()/usePage()/useVenueContent() (React Query) → terbarui saat refetch
Venue di FE = core (nama/lokasi/kapasitas/peta dari simpora) + deskripsi/foto (dari cms by venueRef)
```

---

## 8. Pencarian Global (agregasi saat diketik)

```
Pengunjung → SearchModal (debounce 250ms):
   GET cms /articles?q           -> Berita
   GET simpora /sports,/venues,/matches -> Cabor/Venue/Jadwal/Live
   GET cms /live-streams         -> Siaran
FE gabung + map Hasil{tipe,judul,sub,to} -> max 8 -> klik navigate
```

---

## 9. Aturan WAJIB FE (ringkas)

1. **Envelope adapter**: simpora `{success,message,data,meta}` (paginator, ekstraksi defensif); cms `{success,data,meta}`.
2. **WALL-CLOCK** `matches.scheduled_at`: parse literal Y-M-D H:M; JANGAN `new Date(ISO)` (geser +7 WIB).
   `created_at/updated_at` = instant nyata → boleh `new Date()`.
3. **Real-time = invalidasi**: event socket memicu `invalidate`/`setQueryData`, sumber kebenaran tetap REST.
4. **Tulis publik** (komentar/suka/kontak): rate-limit + moderasi/inbox; UI tampilkan status "menunggu".
5. **Fallback**: tiap fetch punya loading/empty/error; saat API/WS mati UI tetap hidup (cache + skeleton).
6. **simpora2026 hanya dibaca** (tak ada tulis dari FE). Tulis publik hanya ke cms-media.

---

## 10. Ringkas: fitur FE → jalur → pemilik → pemicu

| Fitur FE | Jalur | Pemilik | Pemicu update |
|---|---|---|---|
| Countdown, identitas, sosial | HTTP | cms Settings | edit setting (refetch) |
| Berita, Artikel | HTTP | cms Articles | publish/schedule (refetch) |
| Komentar baca | HTTP | cms Comments | approve moderasi (refetch) |
| Komentar tulis/suka | HTTP write | cms Comments | submit publik |
| Galeri | HTTP | cms Gallery | upload/publish (refetch) |
| Kontak | HTTP write | cms ContactMessage | submit publik (inbox) |
| Halaman legal | HTTP | cms Pages | edit halaman (refetch) |
| Venue deskripsi/foto | HTTP | cms VenueContent | edit (refetch) |
| Cabor, Venue core, Jadwal | HTTP | simpora | CRUD admin starter-laravel (refetch) |
| Kontingen (logo/nama) | statis/derive | FE / simpora leaderboard | — |
| **Live Skor** | **WS (gateway)** | simpora→gateway cms | simpan skor (poll→emit) |
| **Klasemen Medali** | **WS (gateway)** | simpora→gateway cms | finished/medali (poll→emit) |
| **Live Streaming** | **WS (native)** | cms LiveStream | toggle/CRUD kanal |
| **Jumlah Penonton** | **WS (native)** | cms LiveStream | cron/manual viewerCount |
| Pencarian | HTTP | both | saat diketik (agregasi) |
| Cookie consent | — | (klien) | localStorage |
