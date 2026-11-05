import Link from "next/link";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { AudienceSwitcher } from "./AudienceSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: routes.book(), label: t.nav.book },
  { href: routes.resources(), label: t.nav.resources },
  { href: routes.verify(), label: t.nav.verify },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line dark:border-line-dark">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href={routes.home()} className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label={t.nav.label}>
            <ul className="flex flex-wrap gap-3 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
      <Container className="pb-3">
        <AudienceSwitcher />
      </Container>
    </header>
  );
}
