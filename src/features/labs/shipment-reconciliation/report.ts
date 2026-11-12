/**
 * Builds the exportable reconciliation report. Pure: labels are passed in from i18n, and the
 * caller turns the returned text into a download. One row per (line × exception); a line
 * without exceptions gets one row with empty exception columns.
 */
import type { ExceptionKind, LineStatus, ReconResult, Severity, Totals } from "./rules";
import type { Decision, ReviewState } from "./review";
import type { SourceRef, Table } from "./validate";
import { refKey } from "./validate";

export interface ReportLabels {
  headers: readonly string[];
  lineStatus: Record<LineStatus, string>;
  kinds: Record<ExceptionKind, string>;
  severity: Record<Severity, string>;
  decisions: Record<Decision, string>;
  ref: (table: Table, row: number) => string;
  duplicate: string;
  yes: string;
  no: string;
}

export const REPORT_COLUMNS = 17;

/** Integer cents to a fixed two-decimal string, optionally with thousands separators. */
export function formatCents(cents: number, group = false): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const yuan = String(Math.floor(abs / 100));
  const fen = String(abs % 100).padStart(2, "0");
  return `${sign}${group ? yuan.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : yuan}.${fen}`;
}

const qty = (t: Totals | null) => (t ? String(t.quantity) : "");
const money = (t: Totals | null) => (t ? formatCents(t.amountCents) : "");

export function formatRefs(
  refs: readonly SourceRef[],
  labels: Pick<ReportLabels, "ref" | "duplicate">,
  duplicates: readonly SourceRef[] = [],
): string {
  const dup = new Set(duplicates.map(refKey));
  return refs
    .map((r) => labels.ref(r.table, r.row) + (dup.has(refKey(r)) ? labels.duplicate : ""))
    .join("; ");
}

export function buildReportRows(
  result: ReconResult,
  review: ReviewState,
  labels: ReportLabels,
): string[][] {
  const byId = new Map(result.exceptions.map((e) => [e.id, e]));
  const reviewed = review.confirmed ? labels.yes : labels.no;
  const rows: string[][] = [[...labels.headers]];
  for (const line of result.lines) {
    const base = [
      line.shipmentId,
      labels.lineStatus[line.status],
      qty(line.shipped),
      qty(line.invoiced),
      qty(line.diff),
      money(line.shipped),
      money(line.invoiced),
      money(line.diff),
      line.invoiceIds.join("; "),
      formatRefs(line.refs, labels, line.duplicateRefs),
    ];
    const exceptions = line.exceptionIds.flatMap((id) => byId.get(id) ?? []);
    if (exceptions.length === 0) rows.push([...base, "", "", "", "", "", "", reviewed]);
    for (const e of exceptions) {
      const entry = review.entries[e.id];
      rows.push([
        ...base,
        e.id,
        labels.kinds[e.kind],
        labels.severity[e.severity],
        formatRefs(e.refs, labels, e.duplicateRefs),
        labels.decisions[entry?.decision ?? "open"],
        entry?.note.trim() ?? "",
        reviewed,
      ]);
    }
  }
  return rows;
}

const NUMBER = /^-?\d+(\.\d+)?$/;
const FORMULA = /^[=+\-@\t\r]/;

/** RFC 4180 cell; text that a spreadsheet would run as a formula is prefixed with a quote. */
export function csvCell(value: string): string {
  const safe = FORMULA.test(value) && !NUMBER.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** UTF-8 byte-order mark so spreadsheet apps detect Chinese text correctly. */
export const CSV_BOM = "﻿";
export const REPORT_FILENAME = "shipment-reconciliation-report.csv";
