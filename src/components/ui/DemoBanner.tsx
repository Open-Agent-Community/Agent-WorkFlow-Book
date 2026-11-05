import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Persistent, high-contrast notice used on demo-only pages such as /verify. */
export function DemoBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className={cn(
        "sticky top-0 z-20 border-y-2 border-dashed border-warn bg-amber-50 px-4 py-3 text-center",
        "text-sm font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100",
      )}
    >
      {children}
    </div>
  );
}
