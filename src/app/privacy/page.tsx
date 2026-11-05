import { StaticPageView } from "@/components/content/StaticPageView";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: t.legal.privacyTitle, path: routes.privacy() });

export default function PrivacyPage() {
  return <StaticPageView id="privacy" />;
}
