/**
 * Parses pasted CSV text into source rows. Pure and browser-only: nothing is uploaded.
 * Row numbers are CSV record numbers (the header is record 1), so citations still point at the
 * right line. A number that cannot be read becomes NaN, which validation reports as invalid.
 */
import { formatCents, toCsv } from "./report";
import type { InvoiceRow, ShipmentRow } from "./sample-data";

export const MAX_CHARS = 50_000;
export const MAX_ROWS = 200;

export type ImportError =
  | { code: "empty" }
  | { code: "too-long" }
  | { code: "too-many-rows" }
  | { code: "unclosed-quote" }
  | { code: "missing-columns"; columns: string[] };

export type ImportResult<T> = { ok: true; rows: T[] } | { ok: false; error: ImportError };

/** Accepted header spellings, after trimming, lower-casing and dropping a "(元)" suffix. */
const ALIASES = {
  shipmentId: ["发货单号", "shipmentid", "shipment_id", "shipment id"],
  invoiceId: ["发票号", "invoiceid", "invoice_id", "invoice id"],
  customer: ["客户", "customer"],
  sku: ["物料", "sku", "item"],
  quantity: ["数量", "quantity", "qty"],
  amount: ["金额", "amount"],
} as const;
type Column = keyof typeof ALIASES;

/** RFC 4180 records: quoted cells may contain commas, quotes ("") and line breaks. */
export function parseCsv(text: string): string[][] | null {
  const records: string[][] = [];
  let record: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === ",") {
      record.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i += 1;
      records.push([...record, cell]);
      record = [];
      cell = "";
    } else cell += ch;
  }
  if (quoted) return null;
  if (cell !== "" || record.length > 0) records.push([...record, cell]);
  return records;
}

const normal = (h: string) =>
  h
    .trim()
    .toLowerCase()
    .replace(/[（(]\s*元\s*[)）]$/, "")
    .trim();

/** Whole quantities ≥ 0 and yuan amounts (≤ 2 decimals, optional thousands commas). */
export function readNumber(text: string, kind: "quantity" | "amount"): number | null {
  const s = text.trim().replace(/,/g, "");
  if (s === "") return null;
  if (kind === "quantity") return /^-?\d{1,9}$/.test(s) ? Number(s) : Number.NaN;
  const m = /^(-?)(\d{1,9})(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return Number.NaN;
  const cents = Number(m[2]) * 100 + Number((m[3] ?? "").padEnd(2, "0"));
  return m[1] ? -cents : cents;
}

function readTable<T>(
  text: string,
  columns: readonly Column[],
  build: (cell: (c: Column) => string, row: number) => T,
): ImportResult<T> {
  if (text.trim() === "") return { ok: false, error: { code: "empty" } };
  if (text.length > MAX_CHARS) return { ok: false, error: { code: "too-long" } };
  const records = parseCsv(text);
  if (!records) return { ok: false, error: { code: "unclosed-quote" } };
  const [header = [], ...body] = records;
  const index = new Map<Column, number>();
  header.forEach((h, i) => {
    const col = (Object.keys(ALIASES) as Column[]).find((c) =>
      (ALIASES[c] as readonly string[]).includes(normal(h)),
    );
    if (col && !index.has(col)) index.set(col, i);
  });
  const missing = columns.filter((c) => !index.has(c));
  if (missing.length > 0) {
    return { ok: false, error: { code: "missing-columns", columns: missing } };
  }
  const rows = body
    .map((cells, i) => ({ cells, row: i + 2 }))
    .filter(({ cells }) => cells.some((c) => c.trim() !== ""));
  if (rows.length === 0) return { ok: false, error: { code: "empty" } };
  if (rows.length > MAX_ROWS) return { ok: false, error: { code: "too-many-rows" } };
  return {
    ok: true,
    rows: rows.map(({ cells, row }) => build((c) => (cells[index.get(c) ?? -1] ?? "").trim(), row)),
  };
}

export const SHIPMENT_COLUMNS = ["shipmentId", "customer", "sku", "quantity", "amount"] as const;
export const INVOICE_COLUMNS = ["invoiceId", "shipmentId", "quantity", "amount"] as const;

export function readShipments(text: string): ImportResult<ShipmentRow> {
  return readTable(text, SHIPMENT_COLUMNS, (cell, row) => ({
    row,
    shipmentId: cell("shipmentId"),
    customer: cell("customer"),
    sku: cell("sku"),
    quantity: readNumber(cell("quantity"), "quantity"),
    amountCents: readNumber(cell("amount"), "amount"),
  }));
}

export function readInvoices(text: string): ImportResult<InvoiceRow> {
  return readTable(text, INVOICE_COLUMNS, (cell, row) => ({
    row,
    invoiceId: cell("invoiceId"),
    shipmentId: cell("shipmentId"),
    quantity: readNumber(cell("quantity"), "quantity"),
    amountCents: readNumber(cell("amount"), "amount"),
  }));
}

const n = (v: number | null) => (v === null || Number.isNaN(v) ? "" : String(v));
const yuan = (v: number | null) => (v === null || Number.isNaN(v) ? "" : formatCents(v));

/** Source tables back to CSV with the given headers, e.g. as a template to edit. */
export function shipmentsToCsv(rows: readonly ShipmentRow[], headers: readonly string[]): string {
  const body = rows.map((r) => [
    r.shipmentId,
    r.customer,
    r.sku,
    n(r.quantity),
    yuan(r.amountCents),
  ]);
  return toCsv([headers, ...body]);
}

export function invoicesToCsv(rows: readonly InvoiceRow[], headers: readonly string[]): string {
  const body = rows.map((r) => [r.invoiceId, r.shipmentId, n(r.quantity), yuan(r.amountCents)]);
  return toCsv([headers, ...body]);
}
