import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "brand" | "ok" | "warn" | "sim" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-line text-ink-muted dark:border-line-dark dark:text-ink-dark-muted",
  brand: "border-brand-300 text-brand-700 dark:text-brand-300",
  ok: "border-ok/50 text-ok dark:text-green-300",
  warn: "border-warn/50 text-warn dark:text-amber-300",
  sim: "border-sim/50 text-sim dark:text-purple-300",
  danger: "border-danger/50 text-danger dark:text-red-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
