import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Container } from "./Container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Remah-roti terakhir (label halaman aktif). */
  breadcrumb?: string;
  children?: ReactNode;
}

/**
 * Kepala laman dalam: latar gelap senada Hero, beri ruang atas untuk navbar
 * fixed, lengkap dengan breadcrumb kembali ke beranda.
 */
export function PageHeader({ eyebrow, title, description, breadcrumb, children }: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden bg-surface-dark pb-12 pt-28 text-white sm:pb-16 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-merah/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 h-64 w-80 rounded-full bg-emas/15 blur-[120px]"
      />
      <Container className="relative">
        <nav className="flex items-center gap-1.5 text-xs text-white/55">
          <Link to="/" className="transition hover:text-white">Beranda</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-emas">{breadcrumb ?? title}</span>
        </nav>

        {eyebrow && (
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-emas">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            {description}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}
