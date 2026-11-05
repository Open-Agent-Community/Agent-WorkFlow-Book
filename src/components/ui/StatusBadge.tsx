import type { ContentStatus } from "@/content/schema";
import { t } from "@/i18n";
import type { BadgeTone } from "./Badge";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

const tone: Record<ContentStatus, BadgeTone> = {
  published: "ok",
  preview: "warn",
  planned: "neutral",
};

/** The single visual representation of `ContentStatus`. */
export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge tone={tone[status]} className={status === "planned" ? "border-dashed" : undefined}>
      {t.status[status]}
    </Badge>
  );
}

/** Explanatory note for non-published content; renders nothing for published items. */
export function StatusNote({ status }: { status: ContentStatus }) {
  if (status === "published") return null;
  return (
    <p
      role="note"
      className={cn(
        "mt-4 rounded-lg border border-dashed border-line bg-surface-muted px-4 py-3 text-sm",
        "text-ink-muted dark:border-line-dark dark:bg-surface-dark-muted dark:text-ink-dark-muted",
      )}
    >
      {t.statusHint[status]}
    </p>
  );
}
