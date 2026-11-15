/**
 * Human corrections to the source rows, and the before/after comparison of two runs.
 * Pure. A correction is always chosen by the reviewer; code only applies it to a copy of the
 * tables and reconciles again. Rows keep their original row numbers so they stay traceable.
 */
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import type { LineStatus, ReconException, ReconResult } from "./types";
import type { FieldIssue, Table } from "./validate";

export type NumericField = "quantity" | "amountCents";

export type Correction =
  /** Keep one of several conflicting shipment rows; the others with the same id are dropped. */
  | { kind: "keep-row"; row: number }
  /** Fill in a missing or invalid number. */
  | { kind: "fill-field"; table: Table; row: number; field: NumericField; value: number }
  /** Point an invoice at an existing shipment. */
  | { kind: "reassign-invoice"; row: number; shipmentId: string };

export type CorrectionOption =
  | { kind: "keep-row"; rows: number[] }
  | { kind: "fill-field"; table: Table; row: number; field: NumericField }
  | { kind: "reassign-invoice"; row: number; shipmentIds: string[] };

const isNumeric = (f: FieldIssue): f is FieldIssue & { field: NumericField } =>
  f.field === "quantity" || f.field === "amountCents";

/** What the reviewer may correct for an exception; null when only a note or follow-up fits. */
export function correctionOption(
  e: ReconException,
  shipments: readonly ShipmentRow[],
): CorrectionOption | null {
  if (e.kind === "conflicting-rows") {
    const rows = e.refs.filter((r) => r.table === "shipments").map((r) => r.row);
    return rows.length > 1 ? { kind: "keep-row", rows } : null;
  }
  if (e.kind === "missing-field") {
    const f = e.fields.find(isNumeric);
    return f ? { kind: "fill-field", table: f.ref.table, row: f.ref.row, field: f.field } : null;
  }
  if (e.kind === "unmatched-invoice") {
    const [ref, ...rest] = e.refs;
    const shipmentIds = [...new Set(shipments.map((s) => s.shipmentId.trim()).filter(Boolean))];
    if (!ref || rest.length > 0 || shipmentIds.length === 0) return null;
    return { kind: "reassign-invoice", row: ref.row, shipmentIds };
  }
  return null;
}

/** Whether a correction is one the option actually offers. */
export function fitsOption(option: CorrectionOption | null, c: Correction): boolean {
  if (!option || option.kind !== c.kind) return false;
  if (option.kind === "keep-row" && c.kind === "keep-row") return option.rows.includes(c.row);
  if (option.kind === "fill-field" && c.kind === "fill-field") {
    const sameCell = option.table === c.table && option.row === c.row && option.field === c.field;
    return sameCell && Number.isInteger(c.value) && c.value >= (c.field === "quantity" ? 1 : 0);
  }
  if (option.kind === "reassign-invoice" && c.kind === "reassign-invoice") {
    return option.row === c.row && option.shipmentIds.includes(c.shipmentId);
  }
  return false;
}

const MAX_VALUE = 1_000_000_000;

/** Parse reviewer input: quantities are whole numbers ≥ 1, amounts are yuan with ≤ 2 decimals. */
export function parseValue(field: NumericField, text: string): number | null {
  const s = text.trim();
  if (field === "quantity") {
    if (!/^\d{1,9}$/.test(s)) return null;
    const n = Number(s);
    return n >= 1 ? n : null;
  }
  const m = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  const cents = Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0"));
  return cents <= MAX_VALUE * 100 ? cents : null;
}

export function applyCorrections(
  shipments: readonly ShipmentRow[],
  invoices: readonly InvoiceRow[],
  corrections: readonly Correction[],
): { shipments: ShipmentRow[]; invoices: InvoiceRow[] } {
  let s = [...shipments];
  let i = [...invoices];
  for (const c of corrections) {
    if (c.kind === "keep-row") {
      const kept = s.find((r) => r.row === c.row);
      if (!kept) continue;
      const id = kept.shipmentId.trim();
      s = s.filter((r) => r.row === c.row || r.shipmentId.trim() !== id);
    } else if (c.kind === "fill-field") {
      const patch = <T extends { row: number }>(r: T): T =>
        r.row === c.row ? { ...r, [c.field]: c.value } : r;
      if (c.table === "shipments") s = s.map(patch);
      else i = i.map(patch);
    } else {
      i = i.map((r) => (r.row === c.row ? { ...r, shipmentId: c.shipmentId } : r));
    }
  }
  return { shipments: s, invoices: i };
}

export interface RunChange {
  key: string;
  shipmentId: string;
  before: LineStatus | null;
  /** Null when the line no longer exists, e.g. an invoice moved onto another shipment. */
  after: LineStatus | null;
  changed: boolean;
}

/** Line-by-line status before and after corrections, in first-run order. */
export function compareRuns(before: ReconResult, after: ReconResult): RunChange[] {
  const afterBy = new Map(after.lines.map((l) => [l.key, l]));
  const seen = new Set(before.lines.map((l) => l.key));
  const fromBefore = before.lines.map((l) => {
    const next = afterBy.get(l.key)?.status ?? null;
    return {
      key: l.key,
      shipmentId: l.shipmentId,
      before: l.status,
      after: next,
      changed: next !== l.status,
    };
  });
  const added = after.lines
    .filter((l) => !seen.has(l.key))
    .map((l) => ({
      key: l.key,
      shipmentId: l.shipmentId,
      before: null,
      after: l.status,
      changed: true,
    }));
  return [...fromBefore, ...added];
}
