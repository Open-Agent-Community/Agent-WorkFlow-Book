import Link from "next/link";
import { t } from "@/i18n";

export interface Crumb {
  name: string;
  href: string;
}

/** Visible breadcrumb trail. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label={t.breadcrumbs.label} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted dark:text-ink-dark-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
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
  );
}
