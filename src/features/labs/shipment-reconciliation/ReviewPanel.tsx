"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "../shared/fields";
import type { AgentBrief } from "./agent";
import { decisionTone, noteText, roleTone, severityTone, suggestionText } from "./present";
import type { ReviewAction, ReviewState } from "./review";
import { canConfirm, canDecide, DECISIONS, NOTE_MAX, reviewStats } from "./review";
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import { CitedRows } from "./Tables";

const r = t.labs.recon;
const v = r.review;

export function ReviewPanel({
  brief,
  state,
  dispatch,
  shipments,
  invoices,
}: {
  brief: AgentBrief;
  state: ReviewState;
  dispatch: (a: ReviewAction) => void;
  shipments: readonly ShipmentRow[];
  invoices: readonly InvoiceRow[];
}) {
  const stats = reviewStats(state);
  const current = brief.notes.find((n) => n.exception.id === state.selected);
  const entry = current ? state.entries[current.exception.id] : undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
        <ul aria-label={v.listLabel} className="space-y-2">
          {brief.notes.map(({ exception: e }) => {
            const en = state.entries[e.id];
            const active = state.selected === e.id;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch({ type: "inspect", id: e.id })}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-left text-sm",
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-700/30"
                      : "border-line dark:border-line-dark",
                  )}
                >
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="sr-only">{v.inspect}</span>
                    <span className="font-mono font-medium">{e.id}</span>
                    <Badge tone={severityTone[e.severity]}>
                      {r.severityLabel(r.severity[e.severity])}
                    </Badge>
                  </span>
                  <span className="mt-1 block">
                    {r.kinds[e.kind]} · <span className="font-mono">{e.shipmentId || "—"}</span>
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    <Badge tone={en?.inspected ? "brand" : "neutral"}>
                      {en?.inspected ? v.inspected : v.notInspected}
                    </Badge>
                    <Badge tone={decisionTone[en?.decision ?? "open"]}>
                      {v.decisions[en?.decision ?? "open"]}
                    </Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <section
          aria-labelledby="recon-inspector"
          className="min-w-0 rounded-card border border-line p-4 dark:border-line-dark"
        >
          {current && entry ? (
            <div className="space-y-4">
              <h4 id="recon-inspector" className="font-semibold">
                <span className="font-mono">{current.exception.id}</span> ·{" "}
                {r.kinds[current.exception.kind]}
              </h4>
              <div>
                <p className={labelClass}>{v.sourceRows}</p>
                <CitedRows
                  refs={current.exception.refs}
                  shipments={shipments}
                  invoices={invoices}
                />
              </div>
              <div className="rounded-lg border border-dashed border-sim/40 p-3 text-sm">
                <p className="mb-1 flex items-center gap-2">
                  <Badge tone={roleTone.agent}>{r.roles.agent.label}</Badge>
                  <span className="font-medium">{v.agentSays}</span>
                </p>
                <p>{noteText(current)}</p>
                <p className="mt-1">
                  {r.agent.suggestionLabel}：{suggestionText(current)}
                </p>
              </div>
              <fieldset disabled={state.confirmed}>
                <legend className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Badge tone={roleTone.human}>{r.roles.human.label}</Badge>
                  {v.decision}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {DECISIONS.map((d) => (
                    <label
                      key={d}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm",
                        "has-[:checked]:border-brand-500 has-[:disabled]:opacity-60",
                        "dark:border-line-dark",
                      )}
                    >
                      <input
                        type="radio"
                        name={`decision-${current.exception.id}`}
                        checked={entry.decision === d}
                        disabled={!canDecide(entry, d)}
                        onChange={() =>
                          dispatch({ type: "setDecision", id: current.exception.id, decision: d })
                        }
                      />
                      {v.decisions[d]}
                    </label>
                  ))}
                </div>
                <label htmlFor="recon-note" className={cn(labelClass, "mt-3")}>
                  {v.note}
                </label>
                <textarea
                  id="recon-note"
                  rows={3}
                  maxLength={NOTE_MAX}
                  value={entry.note}
                  aria-describedby="recon-note-hint"
                  onChange={(e) =>
                    dispatch({ type: "setNote", id: current.exception.id, note: e.target.value })
                  }
                  className={inputClass}
                />
                <p
                  id="recon-note-hint"
                  className="mt-1 text-xs text-ink-muted dark:text-ink-dark-muted"
                >
                  {entry.note.trim() ? v.noteHint(NOTE_MAX) : v.needsNote}
                </p>
              </fieldset>
            </div>
          ) : (
            <p id="recon-inspector" className="text-sm text-ink-muted dark:text-ink-dark-muted">
              {v.choose}
            </p>
          )}
        </section>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg bg-surface-muted p-3 text-sm",
          "dark:bg-surface-dark-muted",
        )}
      >
        <span>{v.progress(stats.inspected, stats.total)}</span>
        {state.confirmed ? (
          <>
            <Badge tone="ok">{v.confirmed}</Badge>
            <Button variant="secondary" onClick={() => dispatch({ type: "reopen" })}>
              {v.reopen}
            </Button>
          </>
        ) : (
          <Button disabled={!canConfirm(state)} onClick={() => dispatch({ type: "confirm" })}>
            {v.confirm}
          </Button>
        )}
      </div>
      <UnresolvedNote count={stats.unresolved} />
    </div>
  );
}

export function UnresolvedNote({ count }: { count: number }) {
  return (
    <p
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        count > 0
          ? "border-warn/50 text-warn dark:text-amber-300"
          : "border-ok/50 text-ok dark:text-green-300",
      )}
    >
      {count > 0 ? v.unresolved(count) : v.allResolved}
    </p>
  );
}
