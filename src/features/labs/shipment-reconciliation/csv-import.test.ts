import { describe, expect, it } from "vitest";
import { buildBrief } from "./agent";
import {
  invoicesToCsv,
  MAX_CHARS,
  MAX_ROWS,
  parseCsv,
  readInvoices,
  readNumber,
  readShipments,
  shipmentsToCsv,
} from "./csv-import";
import { correctionOption } from "./corrections";
import { reconcile } from "./rules";
import {
  ADVANCED_INVOICES,
  ADVANCED_SHIPMENTS,
  SAMPLE_INVOICES,
  SAMPLE_SHIPMENTS,
} from "./sample-data";

const SHIP_HEAD = ["发货单号", "客户", "物料", "数量", "金额（元）"];
const INV_HEAD = ["发票号", "发货单号", "数量", "金额（元）"];

describe("CSV parsing", () => {
  it("handles quotes, escaped quotes, embedded line breaks, CRLF and a BOM", () => {
    expect(parseCsv('﻿a,b\r\n"x,1","say ""hi"""\n"two\nlines",z')).toEqual([
      ["a", "b"],
      ["x,1", 'say "hi"'],
      ["two\nlines", "z"],
    ]);
    expect(parseCsv('a,"open')).toBeNull();
  });

  it("reads quantities and yuan amounts exactly, marking unreadable text as NaN", () => {
    expect(readNumber(" 1,200 ", "quantity")).toBe(1200);
    expect(readNumber("", "amount")).toBeNull();
    expect(readNumber("18,000.5", "amount")).toBe(1_800_050);
    expect(readNumber("-1.25", "amount")).toBe(-125);
    expect(readNumber("1.234", "amount")).toBeNaN();
    expect(readNumber("abc", "quantity")).toBeNaN();
    expect(readNumber("1.5", "quantity")).toBeNaN();
  });
});

describe("importing tables", () => {
  it("round-trips both built-in samples exactly", () => {
    for (const [s, i] of [
      [SAMPLE_SHIPMENTS, SAMPLE_INVOICES],
      [ADVANCED_SHIPMENTS, ADVANCED_INVOICES],
    ] as const) {
      const ship = readShipments(shipmentsToCsv(s, SHIP_HEAD));
      const inv = readInvoices(invoicesToCsv(i, INV_HEAD));
      expect(ship).toEqual({ ok: true, rows: s });
      expect(inv).toEqual({ ok: true, rows: i });
    }
  });

  it("accepts English headers in any order and keeps record numbers for citations", () => {
    const res = readInvoices(
      "Amount (元),qty,Shipment ID,invoice id\n100,1,SH-1,INV-1\n\n5,x,SH-2,INV-2\n",
    );
    expect(res.ok && res.rows).toEqual([
      { row: 2, invoiceId: "INV-1", shipmentId: "SH-1", quantity: 1, amountCents: 10_000 },
      { row: 4, invoiceId: "INV-2", shipmentId: "SH-2", quantity: Number.NaN, amountCents: 500 },
    ]);
  });

  it("reports missing columns, empty input, unclosed quotes and size limits", () => {
    expect(readShipments("发货单号,数量\nSH-1,1")).toEqual({
      ok: false,
      error: { code: "missing-columns", columns: ["customer", "sku", "amount"] },
    });
    expect(readShipments("  ")).toEqual({ ok: false, error: { code: "empty" } });
    expect(readInvoices(INV_HEAD.join(","))).toEqual({ ok: false, error: { code: "empty" } });
    expect(readInvoices(`${INV_HEAD.join(",")}\n"INV-1`)).toEqual({
      ok: false,
      error: { code: "unclosed-quote" },
    });
    const many = [
      INV_HEAD.join(","),
      ...Array.from({ length: MAX_ROWS + 1 }, (_, k) => `I${k},S,1,1`),
    ];
    expect(readInvoices(many.join("\n"))).toEqual({ ok: false, error: { code: "too-many-rows" } });
    expect(readInvoices("x".repeat(MAX_CHARS + 1))).toEqual({
      ok: false,
      error: { code: "too-long" },
    });
  });

  it("feeds imported rows through the same rules, flagging unreadable numbers as invalid", () => {
    const ship = readShipments("发货单号,客户,物料,数量,金额\nSH-1,C,S,ten,100\n");
    const inv = readInvoices("发票号,发货单号,数量,金额\nINV-1,SH-1,10,100\nINV-2,SH-9,1,?\n");
    if (!ship.ok || !inv.ok) throw new Error("import failed");
    const r = reconcile(ship.rows, inv.rows);
    expect(r.exceptions.map((e) => e.kind)).toEqual(["missing-field", "unmatched-invoice"]);
    expect(r.exceptions[0]?.fields[0]).toMatchObject({ field: "quantity", problem: "invalid" });
    expect(r.lines[1]?.invoiced).toBeNull();
  });
});

describe("advanced sample", () => {
  const result = reconcile(ADVANCED_SHIPMENTS, ADVANCED_INVOICES);

  it("covers the rules the basic sample does not", () => {
    expect(result.lines.map((l) => `${l.shipmentId}:${l.status}`)).toEqual([
      "SH-2001:not-invoiced",
      "SH-2002:difference",
      "SH-2003:difference",
      "SH-2004:matched",
      "SH-2005:incomplete",
      "SH-2006:matched",
    ]);
    expect(result.lines[1]?.diff).toEqual({ quantity: -20, amountCents: -400_000 });
    expect(result.lines[2]?.diff).toEqual({ quantity: 5, amountCents: -50_000 });
    expect(result.lines[3]?.duplicateRefs).toEqual([{ table: "invoices", row: 6 }]);
    expect(result.exceptions[4]?.fields).toEqual([
      { ref: { table: "shipments", row: 6 }, field: "amountCents", problem: "invalid" },
    ]);
  });

  it("gets a suggestion for every exception and a correction for the invalid amount", () => {
    expect(buildBrief(result).notes.map((n) => n.suggestion)).toEqual([
      "fill-missing-field",
      "issue-invoice",
      "check-over-invoicing",
      "check-price-or-quantity",
      "confirm-duplicate",
    ]);
    const invalid = result.exceptions[4];
    if (!invalid) throw new Error("missing exception");
    expect(correctionOption(invalid, ADVANCED_SHIPMENTS)).toEqual({
      kind: "fill-field",
      table: "shipments",
      row: 6,
      field: "amountCents",
    });
  });
});
