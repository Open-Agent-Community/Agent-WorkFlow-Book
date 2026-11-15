"use client";

import type { ReactNode } from "react";
import { useMemo, useReducer } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ResultPanel } from "../shared/ResultPanel";
import { buildBrief } from "./agent";
import { applyCorrections, compareRuns, correctionOption, fitsOption } from "./corrections";
import { reportLabels } from "./present";
import { buildReportRows, toCsv } from "./report";
import type { ReviewState } from "./review";
import {
  canAdvance,
  initialReview,
  reviewErrors,
  reviewReducer,
  reviewStats,
  STAGES,
} from "./review";
import { reconcile } from "./rules";
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import { RoleBadge, StageBody } from "./StageBody";

const r = t.labs.recon;
const ROLES = ["code", "agent", "human"] as const;

export interface Dataset {
  shipments: readonly ShipmentRow[];
  invoices: readonly InvoiceRow[];
}

function statusSummary(state: ReviewState, data: Dataset, brief: ReturnType<typeof buildBrief>) {
  const stats = reviewStats(state);
  switch (state.stage) {
    case "data":
      return (
        `${r.tables.shipments} ${r.tables.rowCount(data.shipments.length)}，` +
        `${r.tables.invoices} ${r.tables.rowCount(data.invoices.length)}。`
      );
    case "reconcile":
      return r.results.summary(brief.lines, brief.matched, brief.exceptions);
    case "agent":
      return r.agent.disclaimer;
    case "review":
      return state.confirmed
        ? `${r.review.confirmed}${r.review.unresolved(stats.unresolved)}`
        : r.review.progress(stats.inspected, stats.total);
    case "rerun":
      return r.fix.rerun.lesson;
    case "export":
      return r.export.done;
  }
}

/** The six-stage workflow for one dataset. Remount it (new `key`) to switch data. */
export function Workflow({ data, picker }: { data: Dataset; picker: ReactNode }) {
  const { shipments, invoices } = data;
  const result = useMemo(() => reconcile(shipments, invoices), [shipments, invoices]);
  const brief = useMemo(() => buildBrief(result), [result]);
  const [state, dispatch] = useReducer(
    reviewReducer,
    result.exceptions.map((e) => e.id),
    initialReview,
  );
  // Re-run: apply the reviewer's (valid) corrections to a copy of the data and reconcile again.
  const { after, changes } = useMemo(() => {
    const valid = result.exceptions.flatMap((e) => {
      const c = state.corrections[e.id];
      return c && fitsOption(correctionOption(e, shipments), c) ? [c] : [];
    });
    const fixed = applyCorrections(shipments, invoices, valid);
    const rerun = reconcile(fixed.shipments, fixed.invoices);
    return { after: rerun, changes: compareRuns(result, rerun) };
  }, [state.corrections, result, shipments, invoices]);
  const csvRows = useMemo(
    () => buildReportRows(result, state, reportLabels, after),
    [result, state, after],
  );
  const csv = useMemo(() => toCsv(csvRows), [csvRows]);
  const index = STAGES.indexOf(state.stage);
  const errors = reviewErrors(state);

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="recon-roles"
        className="rounded-lg bg-surface-muted p-4 dark:bg-surface-dark-muted"
      >
        <h3 id="recon-roles" className="mb-2 text-sm font-semibold">
          {r.roles.heading}
        </h3>
        <ul className="grid gap-2 text-sm md:grid-cols-3">
          {ROLES.map((role) => (
            <li key={role} className="flex items-start gap-2">
              <span className="shrink-0">
                <RoleBadge role={role} />
              </span>
              <span>{r.roles[role].text}</span>
            </li>
          ))}
        </ul>
      </section>

      <ol className="flex flex-wrap gap-2 text-xs" aria-label={r.stageOf(index + 1, STAGES.length)}>
        {STAGES.map((stage, i) => (
          <li
            key={stage}
            aria-current={i === index ? "step" : undefined}
            className={cn(
              "rounded-full px-3 py-1",
              i === index ? "bg-brand-600 text-white" : "border border-line dark:border-line-dark",
            )}
          >
            {i + 1}. {r.stages[stage]}
          </li>
        ))}
      </ol>

      <section aria-labelledby="recon-stage">
        <h3 id="recon-stage" className="font-semibold">
          {r.stages[state.stage]}
        </h3>
        <p className="mt-1 mb-4 text-sm text-ink-muted dark:text-ink-dark-muted">
          {r.leads[state.stage]}
        </p>
        <StageBody
          state={state}
          dispatch={dispatch}
          shipments={shipments}
          invoices={invoices}
          picker={picker}
          result={result}
          after={after}
          changes={changes}
          brief={brief}
          csvRows={csvRows}
          csv={csv}
        />
      </section>

      <ResultPanel
        summary={statusSummary(state, data, brief)}
        emptyText=""
        items={errors.map((e) => ({ key: e, severity: "error", text: r.review.errors[e] }))}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => dispatch({ type: "back" })}
        >
          {r.back}
        </Button>
        {state.stage === "export" ? (
          <Button onClick={() => dispatch({ type: "reset" })}>{r.restart}</Button>
        ) : (
          <Button disabled={!canAdvance(state)} onClick={() => dispatch({ type: "next" })}>
            {r.next[state.stage]}
          </Button>
        )}
      </div>
    </div>
  );
}
