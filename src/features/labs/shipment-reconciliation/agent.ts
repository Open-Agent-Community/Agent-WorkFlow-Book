/**
 * The simulated Agent step. It does not call a model and never recomputes numbers: it reads
 * the reconciliation result and picks an explanation and a suggested next action by fixed rules.
 * Sentences are rendered from these ids by i18n templates.
 */
import type { ExceptionKind, ReconException, ReconResult, Severity, Totals } from "./rules";

export type Suggestion =
  | "pick-source-of-truth"
  | "fill-missing-field"
  | "trace-invoice"
  | "follow-up-invoicing"
  | "check-over-invoicing"
  | "check-price-or-quantity"
  | "issue-invoice"
  | "confirm-duplicate";

export type Direction = "under" | "over" | "mixed";

export interface AgentNote {
  exception: ReconException;
  suggestion: Suggestion;
  direction: Direction | null;
}

export interface AgentBrief {
  lines: number;
  matched: number;
  exceptions: number;
  bySeverity: Record<Severity, number>;
  /** Ordered by severity, then exception id. */
  notes: AgentNote[];
}

const RANK: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

const FIXED: Record<Exclude<ExceptionKind, "amount-difference">, Suggestion> = {
  "conflicting-rows": "pick-source-of-truth",
  "missing-field": "fill-missing-field",
  "unmatched-invoice": "trace-invoice",
  "not-invoiced": "issue-invoice",
  "duplicate-row": "confirm-duplicate",
};

/** Under: nothing over-invoiced and something left to invoice. Over: the reverse. */
export function directionOf(diff: Totals): Direction {
  const values = [diff.quantity, diff.amountCents];
  if (values.every((v) => v >= 0)) return "under";
  if (values.every((v) => v <= 0)) return "over";
  return "mixed";
}

export function explain(e: ReconException): AgentNote {
  const kind = e.kind;
  if (kind !== "amount-difference")
    return { exception: e, suggestion: FIXED[kind], direction: null };
  const direction = e.diff ? directionOf(e.diff) : "mixed";
  const suggestion =
    direction === "under"
      ? "follow-up-invoicing"
      : direction === "over"
        ? "check-over-invoicing"
        : "check-price-or-quantity";
  return { exception: e, suggestion, direction };
}

export function buildBrief(result: ReconResult): AgentBrief {
  const bySeverity: Record<Severity, number> = { high: 0, medium: 0, low: 0 };
  for (const e of result.exceptions) bySeverity[e.severity] += 1;
  const notes = result.exceptions
    .map(explain)
    .sort(
      (a, b) =>
        RANK[a.exception.severity] - RANK[b.exception.severity] ||
        a.exception.id.localeCompare(b.exception.id),
    );
  return {
    lines: result.lines.length,
    matched: result.lines.filter((l) => l.status === "matched").length,
    exceptions: result.exceptions.length,
    bySeverity,
    notes,
  };
}
