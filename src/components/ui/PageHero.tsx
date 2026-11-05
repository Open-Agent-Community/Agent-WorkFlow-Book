import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  lead,
  eyebrow,
  meta,
  children,
}: {
  title: string;
  lead?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "border-b border-line bg-surface-muted",
        "py-10 dark:border-line-dark dark:bg-surface-dark-muted",
      )}
    >
      <Container>
        {eyebrow ? (
          <p className="text-sm font-medium text-brand-700 dark:text-brand-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
        {lead ? (
          <p className="mt-3 max-w-3xl text-ink-muted dark:text-ink-dark-muted">{lead}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
