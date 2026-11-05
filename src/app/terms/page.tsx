import { StaticPageView } from "@/components/content/StaticPageView";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: t.legal.termsTitle, path: routes.terms() });

export default function TermsPage() {
  return <StaticPageView id="terms" />;
}
