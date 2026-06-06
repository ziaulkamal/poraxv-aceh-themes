import type { CSSProperties } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";
import { MenuLink } from "./MenuLink";
import { SocialIcon } from "./SocialIcon";
import { useBranding, useEventInfo, useMenus } from "../../lib/api/hooks";
import type { MenuLinkType, MenuNode } from "../../lib/api/types";

/** Bangun node menu footer fallback (saat API CMS belum tersedia). */
const fbf = (
  label: string,
  type: MenuLinkType | null,
  url: string | null,
  i: number,
  parentId: string | null,
  children: MenuNode[] = [],
): MenuNode => ({
  id: `fb-footer-${parentId ?? "root"}-${i}`,
  location: "FOOTER",
  parentId,
  label,
  type: type ?? "ROUTE",
  url,
  openInNewTab: false,
  position: i,
  isVisible: true,
  children,
});

/** Kolom footer fallback (Event, Informasi) berjenjang. */
const FALLBACK_FOOTER: MenuNode[] = [
  fbf("Event", null, null, 0, null, [
    fbf("Tentang PORA", "ANCHOR", "tentang", 0, "fb-footer-root-0"),
    fbf("Cabang Olahraga", "ANCHOR", "cabor", 1, "fb-footer-root-0"),
    fbf("Jadwal", "ANCHOR", "jadwal", 2, "fb-footer-root-0"),
    fbf("Klasemen", "ROUTE", "/klasemen", 3, "fb-footer-root-0"),
  ]),
  fbf("Informasi", null, null, 1, null, [
    fbf("Venue & Arena", "ROUTE", "/venue", 0, "fb-footer-root-1"),
    fbf("Berita", "ROUTE", "/berita", 1, "fb-footer-root-1"),
    fbf("Live Skor", "ROUTE", "/live", 2, "fb-footer-root-1"),
    fbf("Galeri", "ROUTE", "/galeri", 3, "fb-footer-root-1"),
  ]),
];

/** Bar tautan bawah footer fallback. */
const FALLBACK_BOTTOM: MenuNode[] = [
  { id: "fb-bot-0", location: "FOOTER_BOTTOM", parentId: null, label: "Kontak", type: "ROUTE", url: "/kontak", openInNewTab: false, position: 0, isVisible: true, children: [] },
  { id: "fb-bot-1", location: "FOOTER_BOTTOM", parentId: null, label: "Syarat & Ketentuan", type: "ROUTE", url: "/syarat-ketentuan", openInNewTab: false, position: 1, isVisible: true, children: [] },
  { id: "fb-bot-2", location: "FOOTER_BOTTOM", parentId: null, label: "Kebijakan Cookie", type: "ROUTE", url: "/kebijakan-cookie", openInNewTab: false, position: 2, isVisible: true, children: [] },
  { id: "fb-bot-3", location: "FOOTER_BOTTOM", parentId: null, label: "Peta Situs", type: "ROUTE", url: "/sitemap", openInNewTab: false, position: 3, isVisible: true, children: [] },
];

/** Peta gap layout footer (preset → px) untuk md+. */
const FOOTER_GAP_PX: Record<string, string> = {
  sm: "24px",
  md: "48px",
  lg: "64px",
  xl: "88px",
};

/** Footer: identitas event, navigasi ringkas, kontak panitia, dan kanal sosial. */
export function Footer() {
  const event = useEventInfo();
  const branding = useBranding();
  const { data: menus } = useMenus();
  const footerCols = menus?.footer?.length ? menus.footer : FALLBACK_FOOTER;
  const bottomLinks = menus?.footerBottom?.length ? menus.footerBottom : FALLBACK_BOTTOM;

  // Susun grid-template-columns footer dari layout CMS (atau override mentah).
  const L = branding.footerLayout;
  const slotWeights: string[] = [];
  if (L.showIdentity) slotWeights.push(`${L.identityWeight}fr`);
  for (let i = 0; i < footerCols.length; i++) slotWeights.push(`${L.navWeight}fr`);
  if (L.showContact) slotWeights.push(`${L.contactWeight}fr`);
  const footerGrid = L.gridTemplate.trim() || slotWeights.join(" ");
  const footerGap = FOOTER_GAP_PX[L.gap] ?? "48px";

  // Kontak sekretariat dari CMS (href tel:/mailto: diturunkan dari nilai).
  const kontakItems = [
    { Icon: MapPin, label: branding.contactAddress, href: undefined as string | undefined },
    {
      Icon: Phone,
      label: branding.contactPhone,
      href: branding.contactPhone ? `tel:${branding.contactPhone.replace(/[^0-9+]/g, "")}` : undefined,
    },
    {
      Icon: Mail,
      label: branding.contactEmail,
      href: branding.contactEmail ? `mailto:${branding.contactEmail}` : undefined,
    },
  ].filter((k) => k.label);

  // Deretan ikon sosial (penempatan diatur via CMS).
  const placement = branding.socialPlacement;
  const socialRow =
    branding.socials.length > 0 ? (
      <div className="mt-6 flex flex-wrap gap-2.5">
        {branding.socials.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="inline-flex size-9 items-center justify-center rounded-lg bg-surface/5 ring-1 ring-surface/10 transition hover:-translate-y-0.5 hover:bg-merah hover:ring-merah"
          >
            <SocialIcon platform={s.platform} className="size-4" />
          </a>
        ))}
      </div>
    ) : null;

  return (
    <footer
      id="footer"
      // Footer selalu berlatar gelap di kedua tema; kunci --surface ke putih agar
      // semua warna turunannya (teks, border, ikon) tetap terang di mode gelap.
      style={
        { "--surface": "0 0% 100%", "--fcols": footerGrid, "--fgap": footerGap } as CSSProperties
      }
      className="relative overflow-hidden bg-surface-dark text-surface"
    >
      {/* Garis aksen gradien tipis di tepi atas — kesan finishing premium. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emas/70 to-transparent"
      />
      {/* Glow brand lembut sebagai kedalaman latar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-merah/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-72 w-80 rounded-full bg-emas/10 blur-[120px]"
      />

      <Container className="relative grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:py-16 md:[grid-template-columns:var(--fcols)] md:[gap:var(--fgap)]">
        {/* Identitas */}
        {L.showIdentity && (
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={branding.logoFooterLight}
                alt="Logo PORA Aceh Jaya"
                className="block h-12 w-auto shrink-0 dark:hidden"
              />
              <img
                src={branding.logoFooterDark}
                alt="Logo PORA Aceh Jaya"
                className="hidden h-12 w-auto shrink-0 dark:block"
              />
              <div>
                <span className="block font-display text-2xl font-bold uppercase leading-none tracking-wide">
                  {event.edisi}
                </span>
                <span className="mt-1.5 block text-[0.65rem] uppercase tracking-[0.3em] text-emas/80">
                  {branding.slogan}
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-surface/55">
              {branding.footerDescription}
            </p>
            {placement === "identity" && socialRow}
          </div>
        )}

        {/* Kolom navigasi */}
        {footerCols.map((kolom, idx) => (
          <div key={kolom.id}>
            <h4 className="relative inline-block font-display text-sm font-semibold uppercase tracking-widest text-surface after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-7 after:rounded-full after:bg-emas">
              {kolom.label}
            </h4>
            <ul className="mt-7 space-y-3 text-sm text-surface/55">
              {kolom.children.map((item) => (
                <li key={item.id}>
                  <MenuLink
                    item={item}
                    className="group inline-flex items-center gap-2 text-left transition-colors hover:text-surface"
                  >
                    <span className="h-px w-0 bg-emas transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </MenuLink>
                </li>
              ))}
            </ul>
            {placement === `column-${idx + 1}` && socialRow}
          </div>
        ))}

        {/* Kontak */}
        {L.showContact && (
        <div className="col-span-2 md:col-span-1">
          <h4 className="relative inline-block font-display text-sm font-semibold uppercase tracking-widest text-surface after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-7 after:rounded-full after:bg-emas">
            {branding.secretariatTitle}
          </h4>
          <ul className="mt-7 space-y-4 text-sm text-surface/55">
            {kontakItems.map(({ Icon, label, href }) => {
              const isi = (
                <>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface/5 ring-1 ring-surface/10 transition group-hover:ring-emas/40">
                    <Icon className="size-3.5 text-merah" />
                  </span>
                  <span className="pt-1.5 leading-snug">{label}</span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="group flex items-start gap-3 transition-colors hover:text-surface">
                      {isi}
                    </a>
                  ) : (
                    <div className="group flex items-start gap-3">{isi}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {placement === "secretariat" && socialRow}
        </div>
        )}
      </Container>

      <div className="relative border-t border-surface/10">
        <Container className="flex flex-col items-center gap-4 py-6 text-xs text-surface/45">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {bottomLinks.map((l) => (
              <MenuLink key={l.id} item={l} className="transition-colors hover:text-surface" />
            ))}
          </nav>
          {placement === "bottom" && socialRow}
          <div className="flex w-full flex-col items-center justify-between gap-3 border-t border-surface/10 pt-4 sm:flex-row">
            <p>© 2026 Panitia Besar {event.edisi} — {event.tuanRumah}.</p>
            <p className="inline-flex items-center gap-1.5">
              Dibuat untuk semangat sportivitas Aceh
              <ArrowUpRight className="size-3.5 text-emas/70" />
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
