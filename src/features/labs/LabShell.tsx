import type { ReactNode } from "react";
import { SimulationBadge } from "@/components/ui";
import { t } from "@/i18n";

/** Frame shared by every lab: always shows the simulation badge and disclaimer. */
export function LabShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby="lab-title"
      className="rounded-card border-2 border-dashed border-sim/40 p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="lab-title" className="text-lg font-semibold">
          {title}
        </h2>
        <SimulationBadge />
      </div>
      <p className="mt-2 text-sm text-ink-muted dark:text-ink-dark-muted">
        {t.labs.simulationNote}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
