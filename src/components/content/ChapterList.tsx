import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import type { Chapter } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";

export function ChapterList({ chapters }: { chapters: readonly Chapter[] }) {
  return (
    <ol className="divide-y divide-line rounded-card border border-line dark:divide-line-dark dark:border-line-dark">
      {chapters.map((c) => (
        <li key={c.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4">
          <span className="shrink-0 text-sm text-ink-muted tabular-nums dark:text-ink-dark-muted">
            {t.book.chapter(c.number)}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={routes.chapter(c.id)} className="font-medium hover:underline">
                {c.title}
              </Link>
              <StatusBadge status={c.status} />
            </div>
            <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark-muted">{c.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
