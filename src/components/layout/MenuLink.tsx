import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MenuNode } from "../../lib/api/types";

/** className tetap, atau fungsi dari status aktif (untuk tautan ROUTE). */
type ClassName = string | ((active: boolean) => string);

const resolve = (cls: ClassName | undefined, active: boolean): string =>
  (typeof cls === "function" ? cls(active) : cls) ?? "";

/** Hook navigasi ke section landing; bila di laman lain, pulang dulu ke "/". */
export function useGoSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (id: string) => {
    if (pathname !== "/") navigate("/", { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/**
 * Render satu item menu sesuai tipenya:
 * - ANCHOR  → tombol yang menggulir ke section
 * - ROUTE   → <Link> internal (kelas bisa mengikuti status aktif)
 * - EXTERNAL→ <a> (opsional buka di tab baru)
 */
export function MenuLink({
  item,
  className,
  onNavigate,
  children,
}: {
  item: MenuNode;
  className?: ClassName;
  onNavigate?: () => void;
  children?: ReactNode;
}) {
  const goSection = useGoSection();
  const { pathname } = useLocation();
  const content = children ?? item.label;

  if (item.type === "ANCHOR") {
    return (
      <button
        type="button"
        className={resolve(className, false)}
        onClick={() => {
          goSection(item.url ?? "");
          onNavigate?.();
        }}
      >
        {content}
      </button>
    );
  }

  if (item.type === "EXTERNAL") {
    return (
      <a
        href={item.url ?? "#"}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        className={resolve(className, false)}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  // ROUTE
  const to = item.url ?? "/";
  const active = pathname === to || pathname.startsWith(to + "/");
  return (
    <Link to={to} className={resolve(className, active)} onClick={onNavigate}>
      {content}
    </Link>
  );
}
