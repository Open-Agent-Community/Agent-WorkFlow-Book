/**
 * Shipment ↔ invoice reconciliation. Pure and deterministic: no I/O, dates, randomness or models.
 * Code does all validation, matching and arithmetic here. Labels live in i18n; ids only.
 * Differences are always "shipped minus invoiced": positive means not yet invoiced.
 */
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import type { LineStatus, ReconException, ReconLine, ReconResult, Totals } from "./types";
import { SEVERITY } from "./types";
import type { SourceRef } from "./validate";
import {
  invoiceRef,
  refKey,
  shipmentRef,
  uniqueRefs,
  validateInvoice,
  validateShipment,
} from "./validate";

export type * from "./types";
export { EXCEPTION_KINDS, SEVERITY } from "./types";

/** Group rows by key in first-seen order; a row with a blank key gets a group of its own. */
function groupBy<T extends { row: number }>(rows: readonly T[], key: (r: T) => string) {
  const groups = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r).trim() || `#row-${r.row}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  return groups;
}

/** Rows that repeat the first row exactly are duplicates; any other difference is a conflict. */
function dedupe<T>(rows: readonly T[], signature: (r: T) => string) {
  const [first, ...rest] = rows;
  if (first === undefined) return null;
  const sig = signature(first);
  return rest.every((r) => signature(r) === sig) ? { counted: first, duplicates: rest } : null;
}

const shipmentSig = (r: ShipmentRow) =>
  JSON.stringify([r.shipmentId.trim(), r.customer.trim(), r.sku.trim(), r.quantity, r.amountCents]);
const invoiceSig = (r: InvoiceRow) =>
  JSON.stringify([r.invoiceId.trim(), r.shipmentId.trim(), r.quantity, r.amountCents]);

export function sumTotals(items: readonly Totals[]): Totals {
  return items.reduce(
    (acc, x) => ({
      quantity: acc.quantity + x.quantity,
      amountCents: acc.amountCents + x.amountCents,
    }),
    { quantity: 0, amountCents: 0 },
  );
}

function totalsOf(r: { quantity: number | null; amountCents: number | null }): Totals | null {
  return r.quantity === null || r.amountCents === null
    ? null
    : { quantity: r.quantity, amountCents: r.amountCents };
}

const newLine = (key: string, shipmentId: string, status: LineStatus): ReconLine => ({
  key,
  shipmentId,
  status,
  refs: [],
  duplicateRefs: [],
  invoiceIds: [],
  shipped: null,
  invoiced: null,
  diff: null,
  exceptionIds: [],
});

export function reconcile(
  shipments: readonly ShipmentRow[],
  invoices: readonly InvoiceRow[],
): ReconResult {
  const lines: ReconLine[] = [];
  const exceptions: ReconException[] = [];
  type Raised = Omit<ReconException, "id" | "severity" | "duplicateRefs">;
  const raise = (line: ReconLine, e: Raised) => {
    const id = `EX-${String(exceptions.length + 1).padStart(2, "0")}`;
    const refs = uniqueRefs(e.refs);
    const dup = new Set(line.duplicateRefs.map(refKey));
    const duplicateRefs = refs.filter((r) => dup.has(refKey(r)));
    exceptions.push({ ...e, refs, duplicateRefs, id, severity: SEVERITY[e.kind] });
    line.exceptionIds.push(id);
  };
  const sid = (r: { shipmentId: string }) => r.shipmentId.trim();

  // 1. Invoices: one counted row per invoice id. Conflicting rows are held back for a person.
  const counted: InvoiceRow[] = [];
  const invoiceDupes: InvoiceRow[] = [];
  const conflicted: InvoiceRow[] = [];
  for (const rows of groupBy(invoices, (r) => r.invoiceId).values()) {
    const d = dedupe(rows, invoiceSig);
    if (d) {
      counted.push(d.counted);
      invoiceDupes.push(...d.duplicates);
    } else conflicted.push(...rows);
  }
  const invoicesFor = (id: string, from: readonly InvoiceRow[]) =>
    id ? from.filter((r) => sid(r) === id) : [];

  // 2. One line per shipment id.
  for (const [key, rows] of groupBy(shipments, (r) => r.shipmentId)) {
    const shipmentId = rows[0] ? sid(rows[0]) : "";
    const invs = invoicesFor(shipmentId, counted);
    const dupInvs = invoicesFor(shipmentId, invoiceDupes);
    const conflictInvs = invoicesFor(shipmentId, conflicted);
    const invRefs = [...invs, ...conflictInvs].map(invoiceRef);
    const line = newLine(key, shipmentId, "matched");
    line.refs = uniqueRefs([...rows, ...invs, ...dupInvs, ...conflictInvs].map(toRef));
    line.invoiceIds = [...new Set([...invs, ...conflictInvs].map((r) => r.invoiceId))];
    lines.push(line);

    const d = dedupe(rows, shipmentSig);
    if (!d || conflictInvs.length > 0) {
      line.status = "needs-review";
      raise(line, {
        kind: "conflicting-rows",
        shipmentId,
        invoiceIds: line.invoiceIds,
        refs: [...(d ? [shipmentRef(d.counted)] : rows.map(shipmentRef)), ...invRefs],
        fields: [],
        diff: null,
      });
      continue;
    }

    line.duplicateRefs = [...d.duplicates.map(shipmentRef), ...dupInvs.map(invoiceRef)];
    if (line.duplicateRefs.length > 0) {
      raise(line, {
        kind: "duplicate-row",
        shipmentId,
        invoiceIds: line.invoiceIds,
        refs: [shipmentRef(d.counted), ...line.duplicateRefs, ...invRefs],
        fields: [],
        diff: null,
      });
    }

    const fields = [...validateShipment(d.counted), ...invs.flatMap(validateInvoice)];
    const shipped = totalsOf(d.counted);
    if (fields.length > 0 || !shipped) {
      line.status = "incomplete";
      raise(line, {
        kind: "missing-field",
        shipmentId,
        invoiceIds: line.invoiceIds,
        refs: [shipmentRef(d.counted), ...invRefs],
        fields,
        diff: null,
      });
      continue;
    }

    line.shipped = shipped;
    if (invs.length === 0) {
      line.status = "not-invoiced";
      const refs = [shipmentRef(d.counted)];
      raise(line, { kind: "not-invoiced", shipmentId, invoiceIds: [], refs, fields, diff: null });
      continue;
    }
    // Several distinct invoices for one shipment are legitimate: add them up.
    const invoiced = sumTotals(invs.map(totalsOf).filter((x) => x !== null));
    const diff = {
      quantity: shipped.quantity - invoiced.quantity,
      amountCents: shipped.amountCents - invoiced.amountCents,
    };
    Object.assign(line, { invoiced, diff });
    if (diff.quantity !== 0 || diff.amountCents !== 0) {
      line.status = "difference";
      raise(line, {
        kind: "amount-difference",
        shipmentId,
        invoiceIds: line.invoiceIds,
        refs: [shipmentRef(d.counted), ...invRefs],
        fields,
        diff,
      });
    }
  }

  // 3. Invoices whose shipment id matches no shipment row (including conflicting ones).
  const known = new Set(lines.map((l) => l.shipmentId).filter(Boolean));
  for (const rows of groupBy(
    [...counted, ...conflicted].filter((r) => !known.has(sid(r))),
    (r) => r.invoiceId,
  ).values()) {
    const first = rows[0];
    if (!first) continue;
    // Several rows here means one invoice id with conflicting content: a person decides.
    const conflict = rows.length > 1;
    const key = `invoice:${first.invoiceId.trim() || first.row}`;
    const line = newLine(key, sid(first), conflict ? "needs-review" : "unmatched-invoice");
    const refs = rows.map(invoiceRef);
    Object.assign(line, { refs, invoiceIds: [first.invoiceId] });
    if (!conflict) line.invoiced = totalsOf(first);
    lines.push(line);
    raise(line, {
      kind: conflict ? "conflicting-rows" : "unmatched-invoice",
      shipmentId: line.shipmentId,
      invoiceIds: line.invoiceIds,
      refs,
      fields: rows.flatMap(validateInvoice),
      diff: null,
    });
  }
  return { lines, exceptions };

  function toRef(r: ShipmentRow | InvoiceRow): SourceRef {
    return "invoiceId" in r ? invoiceRef(r) : shipmentRef(r);
  }
}
