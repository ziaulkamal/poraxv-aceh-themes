import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { BlokKonten } from "../components/ui/BlokKonten";
import { usePage } from "../lib/api/hooks";

const pasal = [
  {
    judul: "1. Penerimaan Ketentuan",
    isi: [
      "Dengan mengakses dan menggunakan situs resmi PORA XV, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat & ketentuan yang berlaku. Apabila tidak menyetujui, mohon untuk tidak menggunakan layanan ini.",
    ],
  },
  {
    judul: "2. Penggunaan Konten",
    isi: [
      "Seluruh konten — termasuk teks, gambar, logo, jadwal, dan data pertandingan — disediakan untuk keperluan informasi seputar penyelenggaraan PORA XV.",
      "Konten tidak boleh digunakan untuk tujuan komersial tanpa izin tertulis dari Panitia Besar PORA XV.",
    ],
  },
  {
    judul: "3. Keakuratan Informasi",
    isi: [
      "Panitia berupaya menyajikan informasi seakurat mungkin. Namun, jadwal, klasemen, dan skor dapat berubah sewaktu-waktu mengikuti perkembangan di lapangan.",
      "Panitia tidak bertanggung jawab atas kerugian yang timbul akibat ketidakakuratan atau keterlambatan pembaruan informasi.",
    ],
  },
  {
    judul: "4. Tautan Pihak Ketiga",
    isi: [
      "Situs ini dapat memuat tautan ke situs pihak ketiga. Panitia tidak bertanggung jawab atas isi maupun kebijakan privasi situs-situs tersebut.",
    ],
  },
  {
    judul: "5. Perubahan Ketentuan",
    isi: [
      "Panitia berhak mengubah syarat & ketentuan ini sewaktu-waktu. Perubahan berlaku sejak dipublikasikan di halaman ini.",
    ],
  },
];

/** Laman Syarat & Ketentuan layanan. */
export function SyaratKetentuanPage() {
  const { data: blok } = usePage("syarat-ketentuan");
  return (
    <>
      <PageHeader
        breadcrumb="Syarat & Ketentuan"
        eyebrow="Legal"
        title="Syarat & Ketentuan"
        description="Ketentuan penggunaan situs resmi PORA XV Kabupaten Aceh Jaya."
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
              <div className="mt-8 space-y-8">
                {pasal.map((p) => (
                  <div key={p.judul}>
                    <h2 className="font-display text-lg font-bold text-ink sm:text-xl">{p.judul}</h2>
                    {p.isi.map((teks, i) => (
                      <p key={i} className="mt-2 text-sm leading-relaxed text-ink-soft">{teks}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
