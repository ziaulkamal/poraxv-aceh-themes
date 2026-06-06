import { Container } from "../components/ui/Container";
import { Seo } from "../components/Seo";
import { PageHeader } from "../components/ui/PageHeader";
import { BlokKonten } from "../components/ui/BlokKonten";
import { usePage } from "../lib/api/hooks";

const jenisCookie = [
  { nama: "Cookie Esensial", wajib: true, ket: "Diperlukan agar situs berfungsi, seperti mengingat preferensi tema gelap/terang. Tidak dapat dinonaktifkan." },
  { nama: "Cookie Analitik", wajib: false, ket: "Membantu kami memahami bagaimana pengunjung menggunakan situs agar dapat terus ditingkatkan." },
  { nama: "Cookie Preferensi", wajib: false, ket: "Menyimpan pilihan Anda seperti bahasa dan tampilan yang dipilih." },
];

const bagian = [
  {
    judul: "Apa itu Cookie?",
    isi: ["Cookie adalah berkas teks kecil yang disimpan di perangkat Anda saat mengunjungi situs. Cookie membantu situs mengingat informasi tentang kunjungan Anda."],
  },
  {
    judul: "Bagaimana Kami Menggunakannya",
    isi: ["Kami menggunakan cookie untuk menjaga fungsi dasar situs, mengingat preferensi, dan memahami pola penggunaan secara anonim guna meningkatkan pengalaman Anda."],
  },
  {
    judul: "Mengelola Cookie",
    isi: ["Anda dapat mengatur atau menghapus cookie melalui pengaturan peramban. Menonaktifkan cookie tertentu dapat memengaruhi sebagian fungsi situs."],
  },
];

/** Laman Kebijakan Cookie. */
export function KebijakanCookiePage() {
  const { data: blok } = usePage("kebijakan-cookie");
  return (
    <>
      <Seo title="Kebijakan Cookie" description="Penjelasan penggunaan cookie di situs resmi PORA Aceh Jaya." />
      <PageHeader
        breadcrumb="Kebijakan Cookie"
        eyebrow="Legal"
        title="Kebijakan Cookie"
        description="Penjelasan mengenai penggunaan cookie di situs resmi PORA XV."
      />

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-ink-muted">Terakhir diperbarui: 1 September 2026</p>

            {blok && blok.length > 0 ? (
              <div className="mt-8">
                <BlokKonten blocks={blok} />
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-8">
                  {bagian.map((b) => (
                    <div key={b.judul}>
                      <h2 className="font-display text-lg font-bold text-ink sm:text-xl">{b.judul}</h2>
                      {b.isi.map((teks, i) => (
                        <p key={i} className="mt-2 text-sm leading-relaxed text-ink-soft">{teks}</p>
                      ))}
                    </div>
                  ))}
                </div>

                <h2 className="mt-10 font-display text-lg font-bold text-ink sm:text-xl">Jenis Cookie yang Kami Gunakan</h2>
                <div className="mt-4 space-y-3">
                  {jenisCookie.map((c) => (
                    <div key={c.nama} className="flex items-start justify-between gap-4 rounded-lg bg-surface-soft p-4 dark:bg-white/[0.03]">
                      <div>
                        <p className="font-semibold text-ink">{c.nama}</p>
                        <p className="mt-1 text-sm text-ink-soft">{c.ket}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-pill px-2.5 py-1 text-xs font-semibold ${
                          c.wajib ? "bg-ink/10 text-ink-muted dark:bg-white/10 dark:text-surface/60" : "bg-hijau/15 text-hijau-deep"
                        }`}
                      >
                        {c.wajib ? "Wajib" : "Opsional"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
