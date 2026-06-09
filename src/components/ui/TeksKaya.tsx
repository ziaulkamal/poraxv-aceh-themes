/** src/components/ui/TeksKaya.tsx — render teks blok dgn tautan inline.
 *  Tautan keluar dibuka di tab baru & diberi tracker `?refferer=<situs>`. */
import { Fragment } from "react";
import { hrefDenganReferrer, tautanKeluar } from "../../lib/tautan";

type Inline = { teks: string; href?: string };

export function TeksKaya({
  teks,
  anak,
  siteUrl,
}: {
  teks: string;
  anak?: Inline[];
  siteUrl: string;
}) {
  // Tanpa segmen inline → teks polos.
  if (!anak || anak.length === 0) return <>{teks}</>;

  return (
    <>
      {anak.map((s, i) => {
        if (!s.href) return <Fragment key={i}>{s.teks}</Fragment>;
        const keluar = tautanKeluar(s.href, siteUrl);
        return (
          <a
            key={i}
            href={keluar ? hrefDenganReferrer(s.href, siteUrl) : s.href}
            {...(keluar ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-merah underline decoration-merah/40 underline-offset-2 transition hover:decoration-merah"
          >
            {s.teks}
          </a>
        );
      })}
    </>
  );
}
