import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { useKirimKontak } from "../lib/api/hooks";

const infoKontak = [
  { Icon: MapPin, label: "Alamat", isi: "Kantor Bupati Aceh Jaya, Calang, Kabupaten Aceh Jaya, Aceh 23654" },
  { Icon: Phone, label: "Telepon", isi: "(0654) 000-1234" },
  { Icon: Mail, label: "Email", isi: "info@pora-acehjaya.id" },
  { Icon: Clock, label: "Jam Layanan", isi: "Senin – Jumat, 08.00 – 16.00 WIB" },
];

const lapangan =
  "w-full rounded-md border border-ink/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-merah/50 dark:bg-white/5";

/** Laman kontak: form pesan (demo state lokal) + informasi sekretariat panitia. */
export function KontakPage() {
  const [terkirim, setTerkirim] = useState(false);
  const kontak = useKirimKontak();

  /** Kirim ke inbox cms (best-effort); UI tetap menampilkan sukses. */
  const kirim = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    kontak.mutate({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    });
    setTerkirim(true);
  };

  return (
    <>
      <PageHeader
        breadcrumb="Kontak"
        eyebrow="Hubungi Kami"
        title="Kontak Panitia"
        description="Punya pertanyaan seputar PORA XV? Sampaikan lewat formulir di bawah atau hubungi Sekretariat Panitia langsung."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            {/* Form */}
            <div className="rounded-xl bg-surface-soft p-6 shadow-card dark:bg-white/[0.03] sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink">Kirim Pesan</h2>
              {terkirim ? (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-hijau/10 py-12 text-center">
                  <CheckCircle2 className="size-12 text-hijau-deep" />
                  <p className="font-semibold text-ink">Pesan terkirim!</p>
                  <p className="max-w-xs text-sm text-ink-soft">
                    Terima kasih. Tim kami akan menghubungi kamu sesegera mungkin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTerkirim(false)}
                    className="mt-2 text-sm font-semibold text-merah hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={kirim} className="mt-6 space-y-4">
                  {/* Honeypot anti-spam: disembunyikan dari pengguna, harus tetap kosong. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-ink-soft">Nama</span>
                      <input required name="name" placeholder="Nama lengkap" className={lapangan} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-ink-soft">Email</span>
                      <input required name="email" type="email" placeholder="email@contoh.com" className={lapangan} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-soft">Subjek</span>
                    <input required name="subject" placeholder="Perihal pesan" className={lapangan} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-soft">Pesan</span>
                    <textarea required name="message" rows={5} placeholder="Tulis pesan kamu…" className={`${lapangan} resize-y`} />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-pill bg-merah px-6 py-3 text-sm font-semibold text-surface transition hover:bg-merah-deep"
                  >
                    Kirim Pesan <Send className="size-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Info + peta */}
            <div className="space-y-4">
              {infoKontak.map(({ Icon, label, isi }) => (
                <div key={label} className="flex gap-3 rounded-lg bg-surface p-4 shadow-card ring-1 ring-ink/5 dark:bg-white/[0.03] dark:ring-white/10">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-merah/10">
                    <Icon className="size-5 text-merah" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{isi}</p>
                  </div>
                </div>
              ))}

              <div className="overflow-hidden rounded-lg shadow-card ring-1 ring-ink/5 dark:ring-white/10">
                <iframe
                  title="Peta Calang, Aceh Jaya"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=95.55%2C4.60%2C95.62%2C4.66&layer=mapnik&marker=4.63%2C95.58"
                  className="h-56 w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
