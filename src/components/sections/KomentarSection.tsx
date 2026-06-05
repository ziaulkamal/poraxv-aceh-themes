import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, Heart, CornerDownRight, Send, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { komentarList, type Komentar } from "../../data/pages";
import { useKirimKomentar, useKomentar, useSukaKomentar } from "../../lib/api/hooks";

/* ----------------------------- util ----------------------------- */

const gradien = [
  "from-merah to-emas",
  "from-hijau-deep to-hijau",
  "from-emas to-merah",
  "from-sky-500 to-indigo-500",
  "from-fuchsia-500 to-merah",
  "from-amber-500 to-emas",
];

/** Pilih gradien avatar konsisten berdasarkan nama. */
function gradienDari(nama: string) {
  const h = nama.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradien[h % gradien.length];
}

const inisial = (nama: string) =>
  nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/** Sisipkan balasan ke komentar ber-id tertentu (rekursif, immutable). */
function sisipBalasan(list: Komentar[], parentId: string, baru: Komentar): Komentar[] {
  return list.map((k) =>
    k.id === parentId
      ? { ...k, balasan: [...k.balasan, baru] }
      : { ...k, balasan: sisipBalasan(k.balasan, parentId, baru) },
  );
}

function buatKomentar(nama: string, email: string, isi: string): Komentar {
  return {
    id: crypto.randomUUID(),
    nama,
    email,
    waktu: "Baru saja",
    isi,
    suka: 0,
    balasan: [],
  };
}

/* --------------------------- form --------------------------- */

function KomentarForm({
  onKirim,
  onBatal,
  ringkas = false,
  fokusAwal = false,
}: {
  onKirim: (nama: string, email: string, isi: string) => void;
  onBatal?: () => void;
  ringkas?: boolean;
  fokusAwal?: boolean;
}) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [isi, setIsi] = useState("");
  const [sentuhEmail, setSentuhEmail] = useState(false);

  const emailError = sentuhEmail && email.length > 0 && !emailValid(email);
  const valid = nama.trim().length > 1 && emailValid(email) && isi.trim().length > 0;

  const lapangan =
    "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted dark:bg-white/5";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onKirim(nama.trim(), email.trim(), isi.trim());
    setNama("");
    setEmail("");
    setIsi("");
    setSentuhEmail(false);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-xl ring-1 ring-ink/5 dark:ring-white/10",
        ringkas ? "bg-surface p-4 dark:bg-white/[0.04]" : "bg-surface-soft p-5 dark:bg-white/[0.03]",
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Nama lengkap <span className="text-merah">*</span></span>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama lengkap"
            className={cn(lapangan, "border-ink/10 focus:border-merah/50")}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Email <span className="text-merah">*</span></span>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setSentuhEmail(true)}
            placeholder="email@contoh.com"
            className={cn(lapangan, emailError ? "border-merah/60 focus:border-merah" : "border-ink/10 focus:border-merah/50")}
          />
        </label>
      </div>
      {emailError && <p className="mt-1.5 text-xs text-merah">Format email tidak valid.</p>}

      <textarea
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        rows={ringkas ? 2 : 3}
        autoFocus={fokusAwal}
        placeholder={ringkas ? "Tulis balasan…" : "Bagikan pendapatmu…"}
        className={cn(lapangan, "mt-3 resize-y border-ink/10 focus:border-merah/50")}
      />

      <div className="mt-3 flex items-center justify-end gap-2">
        <p className="mr-auto text-xs text-ink-muted">Email tidak akan dipublikasikan.</p>
        {onBatal && (
          <button
            type="button"
            onClick={onBatal}
            className="inline-flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-ink/5"
          >
            <X className="size-4" /> Batal
          </button>
        )}
        <button
          type="submit"
          disabled={!valid}
          className="inline-flex items-center gap-2 rounded-pill bg-merah px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-merah-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {ringkas ? "Balas" : "Kirim Komentar"} <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}

/* --------------------------- item --------------------------- */

function KomentarItem({
  komentar,
  onBalas,
  liked,
  onSuka,
}: {
  komentar: Komentar;
  onBalas: (parentId: string, nama: string, email: string, isi: string) => void;
  liked: Set<string>;
  onSuka: (id: string) => void;
}) {
  const [balasTerbuka, setBalasTerbuka] = useState(false);
  const disukai = liked.has(komentar.id);
  const isAdmin = komentar.nama.toLowerCase().includes("admin");

  return (
    <li>
      <div className="flex gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-sm",
            gradienDari(komentar.nama),
          )}
        >
          {inisial(komentar.nama)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl rounded-tl-sm bg-surface-soft px-4 py-3 dark:bg-white/[0.04]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink">{komentar.nama}</span>
              {isAdmin && (
                <span className="rounded-pill bg-merah px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-surface">
                  Panitia
                </span>
              )}
              <span className="text-xs text-ink-muted">· {komentar.waktu}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{komentar.isi}</p>
          </div>

          {/* Aksi */}
          <div className="mt-1.5 flex items-center gap-4 pl-2">
            <button
              type="button"
              onClick={() => onSuka(komentar.id)}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold transition",
                disukai ? "text-merah" : "text-ink-muted hover:text-merah",
              )}
            >
              <Heart className={cn("size-4", disukai && "fill-merah")} />
              {komentar.suka + (disukai ? 1 : 0)}
            </button>
            <button
              type="button"
              onClick={() => setBalasTerbuka((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition hover:text-ink"
            >
              <CornerDownRight className="size-4" /> Balas
            </button>
          </div>

          {/* Form balasan */}
          {balasTerbuka && (
            <div className="mt-3">
              <KomentarForm
                ringkas
                fokusAwal
                onKirim={(nama, email, isi) => {
                  onBalas(komentar.id, nama, email, isi);
                  setBalasTerbuka(false);
                }}
                onBatal={() => setBalasTerbuka(false)}
              />
            </div>
          )}

          {/* Balasan bertingkat */}
          {komentar.balasan.length > 0 && (
            <ul className="mt-4 space-y-4 border-l-2 border-ink/5 pl-4 dark:border-white/10 sm:pl-5">
              {komentar.balasan.map((b) => (
                <KomentarItem key={b.id} komentar={b} onBalas={onBalas} liked={liked} onSuka={onSuka} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

/* --------------------------- section --------------------------- */

/** Hitung total komentar termasuk balasan bertingkat. */
function hitung(list: Komentar[]): number {
  return list.reduce((n, k) => n + 1 + hitung(k.balasan), 0);
}

/** Section komentar artikel: baca tree cms (fallback demo), kirim → moderasi, suka. */
export function KomentarSection({ slug }: { slug?: string }) {
  const { data: live, isSuccess } = useKomentar(slug ?? "");
  const kirim = useKirimKomentar(slug ?? "");
  const suka = useSukaKomentar();
  const [daftar, setDaftar] = useState<Komentar[]>(komentarList);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [moderasi, setModerasi] = useState(false);

  // Pakai tree komentar dari API bila berhasil; jika tidak, pertahankan demo lokal.
  useEffect(() => {
    if (isSuccess && live) setDaftar(live);
  }, [isSuccess, live]);

  // Live: kirim ke moderasi (tak langsung tampil). Backend mati: tambah lokal (demo).
  const tambahUtama = (nama: string, email: string, isi: string) => {
    if (!slug) return setDaftar((d) => [buatKomentar(nama, email, isi), ...d]);
    kirim.mutate(
      { authorName: nama, authorEmail: email, body: isi },
      {
        onSuccess: () => setModerasi(true),
        onError: () => setDaftar((d) => [buatKomentar(nama, email, isi), ...d]),
      },
    );
  };

  const tambahBalasan = (parentId: string, nama: string, email: string, isi: string) => {
    if (!slug) return setDaftar((d) => sisipBalasan(d, parentId, buatKomentar(nama, email, isi)));
    kirim.mutate(
      { authorName: nama, authorEmail: email, body: isi, parentId },
      {
        onSuccess: () => setModerasi(true),
        onError: () => setDaftar((d) => sisipBalasan(d, parentId, buatKomentar(nama, email, isi))),
      },
    );
  };

  const toggleSuka = (id: string) => {
    if (slug && !liked.has(id)) suka.mutate(id);
    setLiked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <section className="mx-auto mt-12 max-w-3xl border-t border-ink/10 pt-10">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink sm:text-2xl">
        <MessageCircle className="size-5 text-merah" />
        Komentar
        <span className="rounded-pill bg-surface-soft px-2.5 py-0.5 text-sm font-semibold text-ink-muted dark:bg-white/10">
          {hitung(daftar)}
        </span>
      </h2>

      {moderasi && (
        <div className="mt-6 rounded-lg bg-hijau/10 px-4 py-3 text-sm font-medium text-hijau-deep">
          Komentarmu terkirim dan menunggu moderasi sebelum ditampilkan.
        </div>
      )}

      <div className="mt-6">
        <KomentarForm onKirim={tambahUtama} />
      </div>

      <ul className="mt-8 space-y-6">
        {daftar.map((k) => (
          <KomentarItem key={k.id} komentar={k} onBalas={tambahBalasan} liked={liked} onSuka={toggleSuka} />
        ))}
      </ul>
    </section>
  );
}
