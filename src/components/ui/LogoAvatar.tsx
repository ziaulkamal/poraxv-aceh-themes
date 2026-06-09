/** src/components/ui/LogoAvatar.tsx — avatar berbentuk logo situs WEB (branding).
 *  Dipakai sbg avatar penulis artikel & balasan admin/panitia di komentar. */
import { useBranding } from "../../lib/api/hooks";
import { cn } from "../../lib/cn";

export function LogoAvatar({ className }: { className?: string }) {
  const b = useBranding();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 ring-1 ring-ink/10 dark:bg-white/10 dark:ring-white/15",
        className,
      )}
    >
      <img src={b.logoMainLight} alt="" className="block size-full object-contain dark:hidden" />
      <img src={b.logoMainDark} alt="" className="hidden size-full object-contain dark:block" />
    </span>
  );
}
