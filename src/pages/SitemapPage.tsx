import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import {
  Home, Info, Dumbbell, CalendarDays, Users,
  Newspaper, Medal, Radio, MapPin, Image,
  Mail, FileText, Cookie, Map as MapIcon,
  Compass, ArrowUpRight, type LucideIcon,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";

type Tautan = { label: string; to: string; section?: string; Icon: LucideIcon };

const grup: {
  judul: string;
  Icon: LucideIcon;
  /** kelas warna aksen: [bg lembut, teks] */
  warna: [string, string];
  tautan: Tautan[];
}[] = [
  {
    judul: "Beranda",
    Icon: Home,
    warna: ["bg-merah/10", "text-merah"],
    tautan: [
      { label: "Hero / Sambutan", to: "/", section: "beranda", Icon: Home },
      { label: "Tentang PORA", to: "/", section: "tentang", Icon: Info },
      { label: "Cabang Olahraga", to: "/", section: "cabor", Icon: Dumbbell },
      { label: "Jadwal Ringkas", to: "/", section: "jadwal", Icon: CalendarDays },
      { label: "Kontingen", to: "/", section: "kontingen", Icon: Users },
    ],
  },
  {
    judul: "Informasi",
    Icon: Newspaper,
    warna: ["bg-hijau/10", "text-hijau-deep"],
    tautan: [
      { label: "Berita & Informasi", to: "/berita", Icon: Newspaper },
      { label: "Klasemen Medali", to: "/klasemen", Icon: Medal },
      { label: "Live Skor", to: "/live", Icon: Radio },
      { label: "Venue & Arena", to: "/venue", Icon: MapPin },
      { label: "Galeri Foto", to: "/galeri", Icon: Image },
    ],
  },
  {
    judul: "Bantuan & Legal",
    Icon: Info,
    warna: ["bg-emas/15", "text-emas"],
    tautan: [
      { label: "Kontak Panitia", to: "/kontak", Icon: Mail },
      { label: "Syarat & Ketentuan", to: "/syarat-ketentuan", Icon: FileText },
      { label: "Kebijakan Cookie", to: "/kebijakan-cookie", Icon: Cookie },
      { label: "Peta Situs", to: "/sitemap", Icon: MapIcon },
    ],
  },
];

const jumlahTautan = grup.reduce((n, g) => n + g.tautan.length, 0);

/** Laman peta situs: indeks visual seluruh halaman & section. */
export function SitemapPage() {
  return (
    <>
      <Seo title="Peta Situs" description="Semua halaman dan bagian situs PORA Aceh Jaya dalam satu indeks ringkas." />
      <PageHeader
        breadcrumb="Peta Situs"
        eyebrow="Navigasi"
        title="Peta Situs"
        description="Semua halaman dan bagian situs PORA XV dalam satu indeks ringkas."
      >
        <p className="mt-5 inline-flex items-center gap-2 rounded-pill bg-surface/10 px-4 py-2 text-sm font-medium text-surface/80 ring-1 ring-surface/15">
          <Compass className="size-4 text-emas" /> {jumlahTautan} tautan · {grup.length} kelompok
        </p>
      </PageHeader>

      <section className="bg-surface py-12 dark:bg-page-bg sm:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grup.map((g) => (
              <div
                key={g.judul}
                className="group/card relative overflow-hidden rounded-2xl bg-surface-soft p-6 shadow-card ring-1 ring-ink/5 transition hover:shadow-panel dark:bg-white/[0.03] dark:ring-white/10"
              >
                {/* Aksen gradien tipis di tepi atas */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-merah via-emas to-hijau opacity-70" />

                <div className="flex items-center gap-3">
                  <span className={`inline-flex size-11 items-center justify-center rounded-xl ${g.warna[0]} ${g.warna[1]}`}>
                    <g.Icon className="size-5" />
                  </span>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                    {g.judul}
                  </h2>
                </div>

                <ul className="mt-5 space-y-1">
                  {g.tautan.map((t) => (
                    <li key={t.label}>
                      <Link
                        to={t.to}
                        state={t.section ? { scrollTo: t.section } : undefined}
                        className="group/link flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm text-ink-soft transition hover:bg-surface hover:text-ink dark:hover:bg-white/5"
                      >
                        <t.Icon className={`size-4 shrink-0 ${g.warna[1]}`} />
                        <span className="flex-1">{t.label}</span>
                        <ArrowUpRight className="size-4 text-ink-muted opacity-0 transition group-hover/link:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
