import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const cardBase =
  "block rounded-card border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(cardBase, className)}>{children}</div>;
}

/** A card whose title is the link; the whole card is clickable via a stretched pseudo-element. */
export function LinkCard({
  href,
  title,
  meta,
  children,
  className,
}: {
  href: string;
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        cardBase,
        "relative transition-colors focus-within:border-brand-500 hover:border-brand-500",
        className,
      )}
    >
      {meta ? <div className="mb-2 flex flex-wrap items-center gap-2">{meta}</div> : null}
      <h3 className="text-base font-semibold">
        <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
          {title}
        </Link>
      </h3>
      {children ? (
        <div className="mt-2 text-sm text-ink-muted dark:text-ink-dark-muted">{children}</div>
      ) : null}
    </div>
  );
}
