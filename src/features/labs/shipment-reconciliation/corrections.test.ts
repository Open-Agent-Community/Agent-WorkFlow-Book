import { describe, expect, it } from "vitest";
import type { Correction } from "./corrections";
import {
  applyCorrections,
  compareRuns,
  correctionOption,
  fitsOption,
  parseValue,
} from "./corrections";
import { reconcile } from "./rules";
import { SAMPLE_INVOICES, SAMPLE_SHIPMENTS } from "./sample-data";

const before = reconcile(SAMPLE_SHIPMENTS, SAMPLE_INVOICES);
const byKind = (kind: string) => {
  const e = before.exceptions.find((x) => x.kind === kind);
  if (!e) throw new Error(`no ${kind} exception in the sample`);
  return e;
};
const rerun = (corrections: Correction[]) => {
  const fixed = applyCorrections(SAMPLE_SHIPMENTS, SAMPLE_INVOICES, corrections);
  return reconcile(fixed.shipments, fixed.invoices);
};
const status = (r: ReturnType<typeof reconcile>, id: string) =>
  r.lines.find((l) => l.shipmentId === id)?.status;

describe("correction options", () => {
  it("offers a fitting correction per exception kind, or none", () => {
    expect(correctionOption(byKind("conflicting-rows"), SAMPLE_SHIPMENTS)).toEqual({
      kind: "keep-row",
      rows: [5, 6],
    });
    expect(correctionOption(byKind("missing-field"), SAMPLE_SHIPMENTS)).toEqual({
      kind: "fill-field",
      table: "shipments",
      row: 8,
      field: "quantity",
    });
    expect(correctionOption(byKind("unmatched-invoice"), SAMPLE_SHIPMENTS)).toMatchObject({
      kind: "reassign-invoice",
      row: 8,
      shipmentIds: ["SH-1001", "SH-1002", "SH-1003", "SH-1004", "SH-1005"],
    });
    expect(correctionOption(byKind("amount-difference"), SAMPLE_SHIPMENTS)).toBeNull();
    expect(correctionOption(byKind("duplicate-row"), SAMPLE_SHIPMENTS)).toBeNull();
    expect(correctionOption(byKind("unmatched-invoice"), [])).toBeNull();
  });

  it("only accepts corrections the option offers", () => {
    const keep = correctionOption(byKind("conflicting-rows"), SAMPLE_SHIPMENTS);
    expect(fitsOption(keep, { kind: "keep-row", row: 5 })).toBe(true);
    expect(fitsOption(keep, { kind: "keep-row", row: 2 })).toBe(false);
    expect(fitsOption(null, { kind: "keep-row", row: 5 })).toBe(false);
    const fill = correctionOption(byKind("missing-field"), SAMPLE_SHIPMENTS);
    const cell = { kind: "fill-field", table: "shipments", row: 8, field: "quantity" } as const;
    expect(fitsOption(fill, { ...cell, value: 40 })).toBe(true);
    expect(fitsOption(fill, { ...cell, value: 0 })).toBe(false);
    expect(fitsOption(fill, { ...cell, row: 7, value: 40 })).toBe(false);
    const move = correctionOption(byKind("unmatched-invoice"), SAMPLE_SHIPMENTS);
    expect(fitsOption(move, { kind: "reassign-invoice", row: 8, shipmentId: "SH-1004" })).toBe(
      true,
    );
    expect(fitsOption(move, { kind: "reassign-invoice", row: 8, shipmentId: "SH-9" })).toBe(false);
    expect(fitsOption(move, { kind: "keep-row", row: 8 })).toBe(false);
  });

  it("parses quantities and yuan amounts without floating point", () => {
    expect(parseValue("quantity", " 40 ")).toBe(40);
    expect(parseValue("quantity", "0")).toBeNull();
    expect(parseValue("quantity", "4.5")).toBeNull();
    expect(parseValue("quantity", "-3")).toBeNull();
    expect(parseValue("amountCents", "8000")).toBe(800_000);
    expect(parseValue("amountCents", "0.1")).toBe(10);
    expect(parseValue("amountCents", "19.99")).toBe(1999);
    expect(parseValue("amountCents", "1.999")).toBeNull();
    expect(parseValue("amountCents", "abc")).toBeNull();
  });
});

describe("applying corrections and re-running", () => {
  it("leaves the source tables untouched and changes nothing without corrections", () => {
    const copy = JSON.stringify([SAMPLE_SHIPMENTS, SAMPLE_INVOICES]);
    expect(rerun([])).toEqual(before);
    rerun([{ kind: "keep-row", row: 5 }]);
    expect(JSON.stringify([SAMPLE_SHIPMENTS, SAMPLE_INVOICES])).toBe(copy);
    expect(compareRuns(before, before).every((c) => !c.changed)).toBe(true);
  });

  it("keeping one conflicting row lets code match SH-1003", () => {
    expect(status(rerun([{ kind: "keep-row", row: 5 }]), "SH-1003")).toBe("matched");
    const other = rerun([{ kind: "keep-row", row: 6 }]);
    expect(status(other, "SH-1003")).toBe("difference");
    expect(other.lines.find((l) => l.shipmentId === "SH-1003")?.diff).toEqual({
      quantity: 10,
      amountCents: 200_000,
    });
  });

  it("filling the missing quantity lets code compute SH-1005", () => {
    const fill = { kind: "fill-field", table: "shipments", row: 8, field: "quantity" } as const;
    expect(status(rerun([{ ...fill, value: 40 }]), "SH-1005")).toBe("matched");
    expect(status(rerun([{ ...fill, value: 45 }]), "SH-1005")).toBe("difference");
  });

  it("reassigning the stray invoice folds it into the shipment's totals", () => {
    const after = rerun([{ kind: "reassign-invoice", row: 8, shipmentId: "SH-1004" }]);
    const line = after.lines.find((l) => l.shipmentId === "SH-1004");
    expect(line?.invoiceIds).toEqual(["INV-2005", "INV-2007"]);
    expect(line?.diff).toEqual({ quantity: 110, amountCents: 1_650_000 });
    const changes = compareRuns(before, after);
    expect(changes.find((c) => c.key === "invoice:INV-2007")).toMatchObject({
      before: "unmatched-invoice",
      after: null,
      changed: true,
    });
  });

  it("combines corrections, ignores unknown rows and reports new lines", () => {
    const after = rerun([
      { kind: "keep-row", row: 5 },
      { kind: "keep-row", row: 99 },
      { kind: "fill-field", table: "shipments", row: 8, field: "quantity", value: 40 },
      { kind: "fill-field", table: "invoices", row: 2, field: "amountCents", value: 4_000_000 },
    ]);
    expect(after.exceptions.map((e) => e.kind)).toEqual([
      "amount-difference",
      "duplicate-row",
      "amount-difference",
      "unmatched-invoice",
    ]);
    expect(
      compareRuns(after, before)
        .filter((c) => c.changed)
        .map((c) => c.shipmentId),
    ).toEqual(["SH-1001", "SH-1003", "SH-1005"]);
    expect(compareRuns({ lines: [], exceptions: [] }, before)[0]).toMatchObject({
      before: null,
      after: "matched",
    });
  });
});
