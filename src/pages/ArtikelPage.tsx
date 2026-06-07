import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { ArtikelCard } from "../components/sections/ArtikelCard";
import { KomentarSection } from "../components/sections/KomentarSection";
import { ShareButtons } from "../components/sections/ShareButtons";
import { Seo } from "../components/Seo";
import { useArtikel, useArtikelCards, useSeoConfig } from "../lib/api/hooks";
import { API_CONFIG } from "../lib/api/config";
import { NO_IMAGE } from "../lib/noImage";

/** Laman detail satu artikel berita, lengkap dgn meta & artikel terkait. */
export function ArtikelPage() {
  const { slug } = useParams();
  const { data: live, isLoading } = useArtikel(slug ?? "");
  const semua = useArtikelCards();
  const cfg = useSeoConfig();
  const artikel = live ?? semua.find((a) => a.slug === slug);

  if (!artikel) {
    if (isLoading) {
      return (
        <Container className="py-40 text-center">
          <p className="text-ink-muted">Memuat artikel…</p>
        </Container>
      );
    }
    return (
      <Container className="py-40 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Artikel tidak ditemukan</h1>
        <Link to="/berita" className="mt-4 inline-flex items-center gap-1.5 text-merah">
          <ArrowLeft className="size-4" /> Kembali ke daftar berita
        </Link>
      </Container>
    );
  }

  const terkait = semua.filter((a) => a.slug !== artikel.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: artikel.judul,
    description: artikel.ringkasan,
    image: artikel.image ? [artikel.image] : undefined,
    articleSection: artikel.kategori,
    author: { "@type": "Person", name: artikel.penulis },
    publisher: {
      "@type": "Organization",
      name: cfg.siteName,
      ...(cfg.defaultImage && {
        logo: { "@type": "ImageObject", url: cfg.defaultImage },
      }),
    },
    mainEntityOfPage: typeof window !== "undefined" ? window.location.href : undefined,
  };

  return (
    <article className="bg-surface dark:bg-page-bg">
      <Seo
        title={artikel.judul}
        description={artikel.ringkasan}
        image={artikel.image || undefined}
        type="article"
        jsonLd={jsonLd}
      />
      {/* Hero artikel */}
      <header className="relative isolate overflow-hidden bg-surface-dark pt-28 text-white sm:pt-32">
        {/* Hero latar; tanpa gambar/URL rusak → pakai no-image.png. */}
        <img
          src={artikel.image || NO_IMAGE}
          alt={artikel.judul}
          onError={(e) => {
            if (e.currentTarget.src !== NO_IMAGE) e.currentTarget.src = NO_IMAGE;
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/80 to-surface-dark/40" />
        <Container className="relative pb-12 sm:pb-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/55">
            <Link to="/" className="transition hover:text-white">Beranda</Link>
            <ChevronRight className="size-3.5" />
            <Link to="/berita" className="transition hover:text-white">Berita</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-emas">{artikel.kategori}</span>
          </nav>

          <div className="mt-6 max-w-3xl">
            <Badge tone="hijau">{artikel.kategori}</Badge>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl">
              {artikel.judul}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/65">
              <span className="inline-flex items-center gap-1.5"><User className="size-4 text-emas" /> {artikel.penulis}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="size-4 text-emas" /> {artikel.tanggal}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-emas" /> {artikel.durasiBaca} baca</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Isi artikel */}
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg font-medium leading-relaxed text-ink">{artikel.ringkasan}</p>

          <div className="mt-6 border-y border-ink/10 py-4">
            <ShareButtons
              title={artikel.judul}
              url={`${API_CONFIG.cmsUrl.replace(/\/api\/v\d+$/, "")}/share/berita/${artikel.slug}`}
            />
          </div>

          <div className="mt-8 space-y-6">
            {artikel.isi.map((blok, i) => {
              if (blok.tipe === "subjudul") {
                return (
                  <h2 key={i} className="font-display text-xl font-bold text-ink sm:text-2xl">
                    {blok.teks}
                  </h2>
                );
              }
              if (blok.tipe === "kutipan") {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-merah bg-surface-soft py-4 pl-5 pr-4 font-display text-lg italic text-ink dark:bg-white/5"
                  >
                    “{blok.teks}”
                  </blockquote>
                );
              }
              return (
                <p key={i} className="leading-relaxed text-ink-soft">
                  {blok.teks}
                </p>
              );
            })}
          </div>

          <div className="mt-12 border-t border-ink/10 pt-6">
            <Link
              to="/berita"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-merah transition hover:gap-2.5"
            >
              <ArrowLeft className="size-4" /> Kembali ke semua berita
            </Link>
          </div>

          {/* Komentar pembaca */}
          <KomentarSection slug={artikel.slug} />
        </div>
      </Container>

      {/* Artikel terkait */}
      <section className="border-t border-ink/5 bg-surface-soft py-12 dark:bg-white/[0.02] sm:py-16">
        <Container>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Artikel Lainnya
          </h2>
          <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
            {terkait.map((a) => (
              <ArtikelCard key={a.slug} item={a} />
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
