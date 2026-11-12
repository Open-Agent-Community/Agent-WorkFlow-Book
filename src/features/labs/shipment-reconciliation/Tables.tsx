"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { formatRefs } from "./report";
import type { ReconResult } from "./rules";
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import { reportLabels, signed, signedYuan, yuan } from "./present";
import type { SourceRef } from "./validate";

const r = t.labs.recon;
export const th =
  "whitespace-nowrap border-b border-line px-2 py-1.5 text-left font-medium dark:border-line-dark";
export const td = "border-b border-line px-2 py-1.5 align-top dark:border-line-dark";

/** Horizontally scrollable, keyboard-focusable table frame. */
export function TableFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-line dark:border-line-dark"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="px-2 py-2 text-left font-semibold">{label}</caption>
        {children}
      </table>
    </div>
  );
}

const Missing = () => <Badge tone="danger">{r.tables.missing}</Badge>;
const show = (value: string) => (value.trim() ? value : <Missing />);
const num = (value: number | null) => (value === null ? <Missing /> : value);
const money = (value: number | null) => (value === null ? <Missing /> : yuan(value));

export function ShipmentTable({ rows, label }: { rows: readonly ShipmentRow[]; label: string }) {
  return (
    <TableFrame label={label}>
      <thead>
        <tr>
          {[r.tables.row, r.tables.shipmentId, r.tables.customer, r.tables.sku].map((h) => (
            <th key={h} scope="col" className={th}>
              {h}
            </th>
          ))}
          <th scope="col" className={cn(th, "text-right")}>
            {r.tables.quantity}
          </th>
          <th scope="col" className={cn(th, "text-right")}>
            {r.tables.amount}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <tr key={s.row}>
            <td className={td}>{s.row}</td>
            <td className={cn(td, "font-mono whitespace-nowrap")}>{show(s.shipmentId)}</td>
            <td className={td}>{show(s.customer)}</td>
            <td className={td}>{show(s.sku)}</td>
            <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
              {num(s.quantity)}
            </td>
            <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
              {money(s.amountCents)}
            </td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  );
}

export function InvoiceTable({ rows, label }: { rows: readonly InvoiceRow[]; label: string }) {
  return (
    <TableFrame label={label}>
      <thead>
        <tr>
          {[r.tables.row, r.tables.invoiceId, r.tables.shipmentId].map((h) => (
            <th key={h} scope="col" className={th}>
              {h}
            </th>
          ))}
          <th scope="col" className={cn(th, "text-right")}>
            {r.tables.quantity}
          </th>
          <th scope="col" className={cn(th, "text-right")}>
            {r.tables.amount}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((i) => (
          <tr key={i.row}>
            <td className={td}>{i.row}</td>
            <td className={cn(td, "font-mono whitespace-nowrap")}>{show(i.invoiceId)}</td>
            <td className={cn(td, "font-mono whitespace-nowrap")}>{show(i.shipmentId)}</td>
            <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
              {num(i.quantity)}
            </td>
            <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
              {money(i.amountCents)}
            </td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  );
}

/** Only the source rows an exception cites, split by table. */
export function CitedRows({
  refs,
  shipments,
  invoices,
}: {
  refs: readonly SourceRef[];
  shipments: readonly ShipmentRow[];
  invoices: readonly InvoiceRow[];
}) {
  const pick = (table: SourceRef["table"]) =>
    new Set(refs.filter((x) => x.table === table).map((x) => x.row));
  const s = shipments.filter((x) => pick("shipments").has(x.row));
  const i = invoices.filter((x) => pick("invoices").has(x.row));
  return (
    <div className="space-y-3">
      {s.length > 0 ? <ShipmentTable rows={s} label={r.tables.shipments} /> : null}
      {i.length > 0 ? <InvoiceTable rows={i} label={r.tables.invoices} /> : null}
    </div>
  );
}

const statusTone = {
  matched: "ok",
  difference: "warn",
  "needs-review": "danger",
  incomplete: "danger",
  "not-invoiced": "warn",
  "unmatched-invoice": "danger",
} as const;

export function ResultsTable({ result }: { result: ReconResult }) {
  const c = r.results;
  const cols = [c.shipmentId, c.status, c.shippedQty, c.invoicedQty, c.qtyDiff];
  const more = [c.shippedAmount, c.invoicedAmount, c.amountDiff, c.invoices, c.refs, c.exceptions];
  return (
    <TableFrame label={c.caption}>
      <thead>
        <tr>
          {[...cols, ...more].map((h) => (
            <th key={h} scope="col" className={th}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.lines.map((l) => (
          <tr key={l.key}>
            <td className={cn(td, "font-mono whitespace-nowrap")}>{l.shipmentId || c.none}</td>
            <td className={cn(td, "whitespace-nowrap")}>
              <Badge tone={statusTone[l.status]}>{r.lineStatus[l.status]}</Badge>
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.shipped?.quantity ?? c.none}
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.invoiced?.quantity ?? c.none}
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.diff ? signed(l.diff.quantity) : c.none}
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.shipped ? yuan(l.shipped.amountCents) : c.none}
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.invoiced ? yuan(l.invoiced.amountCents) : c.none}
            </td>
            <td className={cn(td, "whitespace-nowrap tabular-nums")}>
              {l.diff ? signedYuan(l.diff.amountCents) : c.none}
            </td>
            <td className={cn(td, "font-mono whitespace-nowrap")}>
              {l.invoiceIds.join(", ") || c.none}
            </td>
            <td className={cn(td, "min-w-48")}>
              {formatRefs(l.refs, reportLabels, l.duplicateRefs)}
            </td>
            <td className={cn(td, "font-mono whitespace-nowrap")}>
              {l.exceptionIds.join(", ") || c.none}
            </td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  );
}
