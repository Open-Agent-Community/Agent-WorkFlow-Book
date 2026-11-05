"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUDIENCES, isAudience } from "@/lib/audiences";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

export function AudienceSwitcher() {
  const segment = usePathname().split("/")[1];
  const current = isAudience(segment) ? segment : undefined;
  return (
    <nav aria-label={t.nav.audiences}>
      <ul className="flex flex-wrap gap-1">
        {AUDIENCES.map((a) => (
          <li key={a}>
            <Link
              href={routes.audience(a)}
              aria-current={current === a ? "true" : undefined}
              className={cn(
                "inline-block rounded-full px-3 py-1 text-sm",
                current === a
                  ? "bg-brand-600 text-white"
                  : cn(
                      "text-ink-muted hover:bg-surface-muted",
                      "dark:text-ink-dark-muted dark:hover:bg-surface-dark-muted",
                    ),
              )}
            >
              {t.audiences[a].label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
