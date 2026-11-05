import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";

export interface ResultItem {
  key: string;
  severity: "error" | "warning";
  text: string;
}

/** Live region announcing lab results; used by every lab for a consistent, accessible readout. */
export function ResultPanel({
  score,
  summary,
  items,
  children,
}: {
  score?: number;
  summary: string;
  items: readonly ResultItem[];
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="lab-result-heading"
      className={cn(
        "rounded-card border border-line bg-surface-muted p-4 dark:border-line-dark",
        "dark:bg-surface-dark-muted",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="lab-result-heading" className="font-semibold">
          {t.labs.result}
        </h3>
        {score !== undefined ? <Badge tone="brand">{t.labs.score(score)}</Badge> : null}
      </div>
      <div role="status" aria-live="polite" className="mt-2 text-sm">
        <p>{summary}</p>
        {items.length === 0 ? (
          <p className="mt-2 text-ok dark:text-green-300">{t.labs.noIssues}</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {items.map((item) => (
              <li key={item.key} className="flex items-start gap-2">
                <Badge tone={item.severity === "error" ? "danger" : "warn"} className="shrink-0">
                  {t.labs.severity[item.severity]}
                </Badge>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </section>
  );
}
