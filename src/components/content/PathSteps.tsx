import Link from "next/link";
import { Badge, StatusBadge } from "@/components/ui";
import type { LearningPath } from "@/content";
import { resolveStep } from "@/content";
import { t } from "@/i18n";
import type { Audience } from "@/lib/audiences";
import { routes } from "@/lib/routes";

function hrefFor(kind: "chapter" | "case" | "lab", ref: string, audience: Audience) {
  if (kind === "chapter") return routes.chapter(ref);
  if (kind === "case") return routes.case(audience, ref);
  return routes.lab(audience, ref);
}

export function PathSteps({ path }: { path: LearningPath }) {
  return (
    <ol className="space-y-3">
      {path.steps.map((step, i) => {
        const target = resolveStep(step.kind, step.ref);
        return (
          <li
            key={`${step.kind}-${step.ref}`}
            className="flex gap-4 rounded-card border border-line p-4 dark:border-line-dark"
          >
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 dark:bg-brand-700 dark:text-white"
            >
              {i + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={step.kind === "lab" ? "sim" : "neutral"}>
                  {t.paths.stepKinds[step.kind]}
                </Badge>
                <Link
                  href={hrefFor(step.kind, step.ref, path.audience)}
                  className="font-medium hover:underline"
                >
                  {target?.title ?? step.ref}
                </Link>
                {target ? <StatusBadge status={target.status} /> : null}
              </div>
              <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark-muted">{step.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
