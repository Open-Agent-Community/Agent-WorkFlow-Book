/** Required-field validation for the two source tables. Pure; labels live in i18n. */
import type { InvoiceRow, ShipmentRow } from "./sample-data";

export type Table = "shipments" | "invoices";
export interface SourceRef {
  table: Table;
  row: number;
}

export const SHIPMENT_FIELDS = [
  "shipmentId",
  "customer",
  "sku",
  "quantity",
  "amountCents",
] as const;
export const INVOICE_FIELDS = ["invoiceId", "shipmentId", "quantity", "amountCents"] as const;
export type Field = (typeof SHIPMENT_FIELDS)[number] | (typeof INVOICE_FIELDS)[number];

export interface FieldIssue {
  ref: SourceRef;
  field: Field;
  problem: "missing" | "invalid";
}

const isBlank = (v: string) => v.trim() === "";

/** Quantities must be whole numbers ≥ 1; amounts whole cents ≥ 0. */
function checkNumber(value: number | null, min: number): FieldIssue["problem"] | null {
  if (value === null) return "missing";
  return Number.isInteger(value) && value >= min ? null : "invalid";
}

function checkAmounts(ref: SourceRef, r: { quantity: number | null; amountCents: number | null }) {
  const issues: FieldIssue[] = [];
  const qty = checkNumber(r.quantity, 1);
  if (qty) issues.push({ ref, field: "quantity", problem: qty });
  const amount = checkNumber(r.amountCents, 0);
  if (amount) issues.push({ ref, field: "amountCents", problem: amount });
  return issues;
}

export const shipmentRef = (r: ShipmentRow): SourceRef => ({ table: "shipments", row: r.row });
export const invoiceRef = (r: InvoiceRow): SourceRef => ({ table: "invoices", row: r.row });

export function validateShipment(r: ShipmentRow): FieldIssue[] {
  const ref = shipmentRef(r);
  const issues: FieldIssue[] = (["shipmentId", "customer", "sku"] as const)
    .filter((field) => isBlank(r[field]))
    .map((field) => ({ ref, field, problem: "missing" }));
  return [...issues, ...checkAmounts(ref, r)];
}

export function validateInvoice(r: InvoiceRow): FieldIssue[] {
  const ref = invoiceRef(r);
  const issues: FieldIssue[] = (["invoiceId", "shipmentId"] as const)
    .filter((field) => isBlank(r[field]))
    .map((field) => ({ ref, field, problem: "missing" }));
  return [...issues, ...checkAmounts(ref, r)];
}

/** Stable key for de-duplicating references. */
export const refKey = (r: SourceRef) => `${r.table}:${r.row}`;

export function uniqueRefs(refs: readonly SourceRef[]): SourceRef[] {
  return [...new Map(refs.map((r) => [refKey(r), r])).values()];
}
