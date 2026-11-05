import Link from "next/link";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line py-8 text-sm text-ink-muted dark:border-line-dark dark:text-ink-dark-muted">
      <Container className="flex flex-col gap-3">
        <p>{t.site.placeholderNotice}</p>
        <p>{t.footer.noTracking}</p>
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link href={routes.privacy()} className="hover:underline">
              {t.footer.privacy}
            </Link>
          </li>
          <li>
            <Link href={routes.terms()} className="hover:underline">
              {t.footer.terms}
            </Link>
          </li>
          <li>
            <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline">
              {t.footer.contact}
            </a>
          </li>
        </ul>
        <p>© {siteConfig.name}</p>
      </Container>
    </footer>
  );
}
