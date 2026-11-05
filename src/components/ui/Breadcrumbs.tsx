import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  href: string;
}

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const trail = [{ name: t.nav.home, href: routes.home() }, ...items.filter((i) => i.href !== "/")];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label={t.breadcrumbs.label} className="text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-ink-muted dark:text-ink-dark-muted">
          {trail.map((item, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-ink dark:text-ink-dark">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="underline-offset-4 hover:underline">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
