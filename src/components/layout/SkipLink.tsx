import { t } from "@/i18n";
import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only z-50 rounded-md bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed",
        "focus:top-2 focus:left-2",
      )}
    >
      {t.site.skipToContent}
    </a>
  );
}
