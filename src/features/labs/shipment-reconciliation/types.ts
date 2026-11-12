/** Result types for the reconciliation lab. Ids only; labels live in i18n. */
import type { FieldIssue, SourceRef } from "./validate";

export interface Totals {
  quantity: number;
  amountCents: number;
}

export const EXCEPTION_KINDS = [
  "conflicting-rows",
  "missing-field",
  "unmatched-invoice",
  "amount-difference",
  "not-invoiced",
  "duplicate-row",
] as const;
export type ExceptionKind = (typeof EXCEPTION_KINDS)[number];
export type Severity = "high" | "medium" | "low";

export const SEVERITY: Record<ExceptionKind, Severity> = {
  "conflicting-rows": "high",
  "missing-field": "high",
  "unmatched-invoice": "high",
  "amount-difference": "medium",
  "not-invoiced": "medium",
  "duplicate-row": "low",
};

export interface ReconException {
  id: string;
  kind: ExceptionKind;
  severity: Severity;
  /** Empty when the source row has no shipment id. */
  shipmentId: string;
  invoiceIds: string[];
  refs: SourceRef[];
  /** The subset of `refs` ignored as exact duplicates. */
  duplicateRefs: SourceRef[];
  fields: FieldIssue[];
  /** Shipped minus invoiced; set only for `amount-difference`. */
  diff: Totals | null;
}

export type LineStatus =
  "matched" | "difference" | "needs-review" | "incomplete" | "not-invoiced" | "unmatched-invoice";

export interface ReconLine {
  key: string;
  shipmentId: string;
  status: LineStatus;
  /** Every source row that belongs to this line, including ignored duplicates. */
  refs: SourceRef[];
  /** Source rows ignored because they exactly repeat a counted row. */
  duplicateRefs: SourceRef[];
  invoiceIds: string[];
  shipped: Totals | null;
  invoiced: Totals | null;
  diff: Totals | null;
  exceptionIds: string[];
}

export interface ReconResult {
  lines: ReconLine[];
  exceptions: ReconException[];
}
