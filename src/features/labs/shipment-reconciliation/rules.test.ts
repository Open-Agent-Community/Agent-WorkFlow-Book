import { describe, expect, it } from "vitest";
import { reconcile, sumTotals } from "./rules";
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import { SAMPLE_INVOICES, SAMPLE_SHIPMENTS } from "./sample-data";
import { validateInvoice, validateShipment } from "./validate";

const ship = (row: number, over: Partial<ShipmentRow> = {}): ShipmentRow => ({
  row,
  shipmentId: "SH-1",
  customer: "C",
  sku: "S",
  quantity: 10,
  amountCents: 1000,
  ...over,
});
const inv = (row: number, over: Partial<InvoiceRow> = {}): InvoiceRow => ({
  row,
  invoiceId: `INV-${row}`,
  shipmentId: "SH-1",
  quantity: 10,
  amountCents: 1000,
  ...over,
});
const short = (refs: { table: string; row: number }[]) =>
  refs.map((r) => `${r.table[0]}${r.row}`).join(" ");

describe("validation", () => {
  it("reports missing and invalid required fields with their source row", () => {
    expect(validateShipment(ship(2))).toEqual([]);
    expect(validateShipment(ship(3, { customer: " ", quantity: null, amountCents: -1 }))).toEqual([
      { ref: { table: "shipments", row: 3 }, field: "customer", problem: "missing" },
      { ref: { table: "shipments", row: 3 }, field: "quantity", problem: "missing" },
      { ref: { table: "shipments", row: 3 }, field: "amountCents", problem: "invalid" },
    ]);
    expect(validateInvoice(inv(4, { invoiceId: "", quantity: 1.5 }))).toEqual([
      { ref: { table: "invoices", row: 4 }, field: "invoiceId", problem: "missing" },
      { ref: { table: "invoices", row: 4 }, field: "quantity", problem: "invalid" },
    ]);
  });
});

describe("reconcile with the built-in sample", () => {
  const result = reconcile(SAMPLE_SHIPMENTS, SAMPLE_INVOICES);
  const line = (id: string) => result.lines.find((l) => l.shipmentId === id);
  const kinds = result.exceptions.map((e) => `${e.id}:${e.kind}:${e.shipmentId}`);

  it("produces one line per shipment id plus unmatched invoices, in source order", () => {
    expect(result.lines.map((l) => `${l.shipmentId}:${l.status}`)).toEqual([
      "SH-1001:matched",
      "SH-1002:matched",
      "SH-1003:needs-review",
      "SH-1004:difference",
      "SH-1005:incomplete",
      "SH-1099:unmatched-invoice",
    ]);
    expect(kinds).toEqual([
      "EX-01:duplicate-row:SH-1002",
      "EX-02:conflicting-rows:SH-1003",
      "EX-03:amount-difference:SH-1004",
      "EX-04:missing-field:SH-1005",
      "EX-05:unmatched-invoice:SH-1099",
    ]);
  });

  it("fully matches SH-1001 with no exception", () => {
    expect(line("SH-1001")).toMatchObject({
      diff: { quantity: 0, amountCents: 0 },
      invoiceIds: ["INV-2001"],
      exceptionIds: [],
    });
  });

  it("counts the duplicate SH-1002 row once and aggregates its two invoices", () => {
    const l = line("SH-1002");
    expect(l?.shipped).toEqual({ quantity: 200, amountCents: 3_000_000 });
    expect(l?.invoiced).toEqual({ quantity: 200, amountCents: 3_000_000 });
    expect(l?.invoiceIds).toEqual(["INV-2002", "INV-2003"]);
    expect(short(l?.duplicateRefs ?? [])).toBe("s4");
    const e = result.exceptions[0];
    expect(short(e?.refs ?? [])).toBe("s3 s4 i3 i4");
    expect(short(e?.duplicateRefs ?? [])).toBe("s4");
    expect(e?.severity).toBe("low");
  });

  it("sends conflicting SH-1003 rows to a person without computing a difference", () => {
    expect(line("SH-1003")).toMatchObject({ shipped: null, diff: null });
    expect(result.exceptions[1]).toMatchObject({ severity: "high", invoiceIds: ["INV-2004"] });
    expect(short(result.exceptions[1]?.refs ?? [])).toBe("s5 s6 i5");
  });

  it("computes the known SH-1004 difference as shipped minus invoiced", () => {
    expect(line("SH-1004")?.diff).toEqual({ quantity: 120, amountCents: 1_800_000 });
    expect(result.exceptions[2]?.diff).toEqual({ quantity: 120, amountCents: 1_800_000 });
  });

  it("flags the missing SH-1005 quantity and does not guess", () => {
    expect(line("SH-1005")).toMatchObject({ shipped: null, diff: null, invoiceIds: ["INV-2006"] });
    expect(result.exceptions[3]?.fields).toEqual([
      { ref: { table: "shipments", row: 8 }, field: "quantity", problem: "missing" },
    ]);
  });

  it("reports INV-2007 as an invoice with no matching shipment", () => {
    expect(result.exceptions[4]).toMatchObject({ invoiceIds: ["INV-2007"], shipmentId: "SH-1099" });
    expect(line("SH-1099")?.invoiced).toEqual({ quantity: 10, amountCents: 150_000 });
  });

  it("is deterministic", () => {
    expect(reconcile(SAMPLE_SHIPMENTS, SAMPLE_INVOICES)).toEqual(result);
  });
});

describe("reconcile edge cases", () => {
  it("flags a shipment with no invoice", () => {
    const r = reconcile([ship(2)], []);
    expect(r.lines[0]?.status).toBe("not-invoiced");
    expect(r.exceptions[0]?.kind).toBe("not-invoiced");
  });

  it("reports over-invoicing as a negative difference", () => {
    const r = reconcile([ship(2)], [inv(2), inv(3, { quantity: 5, amountCents: 500 })]);
    expect(r.lines[0]?.diff).toEqual({ quantity: -5, amountCents: -500 });
  });

  it("counts an exact duplicate invoice row once", () => {
    const r = reconcile([ship(2)], [inv(2), inv(3, { invoiceId: "INV-2" })]);
    expect(r.lines[0]).toMatchObject({ status: "matched", invoiceIds: ["INV-2"] });
    expect(short(r.lines[0]?.duplicateRefs ?? [])).toBe("i3");
    expect(r.exceptions.map((e) => e.kind)).toEqual(["duplicate-row"]);
  });

  it("holds back conflicting invoice rows with the same invoice id", () => {
    const r = reconcile([ship(2)], [inv(2), inv(3, { invoiceId: "INV-2", quantity: 9 })]);
    expect(r.lines[0]).toMatchObject({ status: "needs-review", diff: null });
    expect(short(r.exceptions[0]?.refs ?? [])).toBe("s2 i2 i3");
  });

  it("keeps conflicting invoices for unknown shipments visible for review", () => {
    const r = reconcile([], [inv(2, { shipmentId: "X" }), inv(3, { invoiceId: "INV-2" })]);
    expect(r.lines.map((l) => l.status)).toEqual(["needs-review"]);
    expect(r.exceptions[0]).toMatchObject({ kind: "conflicting-rows", invoiceIds: ["INV-2"] });
    expect(short(r.exceptions[0]?.refs ?? [])).toBe("i2 i3");
  });

  it("treats a blank shipment id as its own incomplete line", () => {
    const r = reconcile([ship(2, { shipmentId: "" })], [inv(2, { shipmentId: "" })]);
    expect(r.lines.map((l) => l.status)).toEqual(["incomplete", "unmatched-invoice"]);
    expect(r.exceptions[1]?.fields[0]).toMatchObject({ field: "shipmentId" });
  });

  it("sums totals exactly in integer cents", () => {
    expect(sumTotals([])).toEqual({ quantity: 0, amountCents: 0 });
    expect(
      sumTotals([
        { quantity: 1, amountCents: 10 },
        { quantity: 2, amountCents: 20 },
      ]),
    ).toEqual({ quantity: 3, amountCents: 30 });
  });
});
