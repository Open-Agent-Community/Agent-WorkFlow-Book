import { t } from "@/i18n";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-md bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      {t.site.skipToContent}
    </a>
  );
}
