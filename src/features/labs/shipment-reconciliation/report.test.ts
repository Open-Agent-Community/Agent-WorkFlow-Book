import { describe, expect, it } from "vitest";
import { buildBrief, directionOf, explain } from "./agent";
import { applyCorrections } from "./corrections";
import { noteText, reportLabels } from "./present";
import { buildReportRows, csvCell, formatCents, REPORT_COLUMNS, toCsv } from "./report";
import { initialReview, reviewReducer } from "./review";
import { reconcile } from "./rules";
import { SAMPLE_INVOICES, SAMPLE_SHIPMENTS } from "./sample-data";

const result = reconcile(SAMPLE_SHIPMENTS, SAMPLE_INVOICES);

describe("simulated Agent", () => {
  const brief = buildBrief(result);

  it("orders exceptions by severity and never changes the counts", () => {
    expect(brief).toMatchObject({ lines: 6, matched: 2, exceptions: 5 });
    expect(brief.bySeverity).toEqual({ high: 3, medium: 1, low: 1 });
    expect(brief.notes.map((n) => `${n.exception.id}:${n.suggestion}`)).toEqual([
      "EX-02:pick-source-of-truth",
      "EX-04:fill-missing-field",
      "EX-05:trace-invoice",
      "EX-03:follow-up-invoicing",
      "EX-01:confirm-duplicate",
    ]);
  });

  it("classifies the direction of a difference", () => {
    expect(directionOf({ quantity: 1, amountCents: 0 })).toBe("under");
    expect(directionOf({ quantity: -1, amountCents: -5 })).toBe("over");
    expect(directionOf({ quantity: 1, amountCents: -5 })).toBe("mixed");
    const e = result.exceptions[2];
    if (!e) throw new Error("missing sample exception");
    expect(explain({ ...e, diff: { quantity: -1, amountCents: -1 } }).suggestion).toBe(
      "check-over-invoicing",
    );
    expect(explain({ ...e, diff: { quantity: 1, amountCents: -1 } }).suggestion).toBe(
      "check-price-or-quantity",
    );
  });

  it("cites shipment ids, invoice ids and source rows taken from the code result", () => {
    const text = brief.notes.map(noteText);
    expect(text[3]).toContain("SH-1004");
    expect(text[3]).toContain("INV-2005");
    expect(text[3]).toContain("120 件");
    expect(text[3]).toContain("¥18,000.00");
    expect(text[3]).toContain("发货表第 7 行; 发票表第 6 行");
    expect(text[4]).toContain("发货表第 4 行（重复，未计入）");
    expect(text[4]).toContain("INV-2002、INV-2003");
    expect(text[1]).toContain("数量（发货表第 8 行，缺失）");
    expect(text[2]).toContain("INV-2007");
  });
});

describe("CSV report", () => {
  it("formats cents without floating point", () => {
    expect(formatCents(1_800_000, true)).toBe("18,000.00");
    expect(formatCents(-150_005)).toBe("-1500.05");
    expect(formatCents(7)).toBe("0.07");
  });

  it("escapes cells and neutralises spreadsheet formulas but not numbers", () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
    expect(csvCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvCell("-120")).toBe("-120");
    expect(toCsv([["a", "b"]])).toBe("a,b\r\n");
  });

  it("has one row per exception with statuses, notes and source references", () => {
    let review = initialReview(result.exceptions.map((e) => e.id));
    for (const action of [
      { type: "setNote", id: "EX-03", note: "第二批发票下周开具" },
      { type: "setDecision", id: "EX-03", decision: "follow-up" },
      { type: "setNote", id: "EX-01", note: "重复导入，已确认" },
      { type: "setDecision", id: "EX-01", decision: "resolved" },
    ] as const) {
      review = reviewReducer(review, action);
    }
    const rows = buildReportRows(result, review, reportLabels);
    expect(rows[0]).toEqual(reportLabels.headers);
    expect(rows.every((r) => r.length === REPORT_COLUMNS)).toBe(true);
    expect(rows).toHaveLength(1 + 6);
    expect(rows[1]?.slice(0, 2)).toEqual(["SH-1001", "已匹配"]);
    expect(rows[2]).toContain("重复导入，已确认");
    expect(rows[2]).toContain("已解决");
    expect(rows[2]?.[9]).toBe(
      "发货表第 3 行; 发货表第 4 行（重复，未计入）; 发票表第 3 行; 发票表第 4 行",
    );
    expect(rows[4]?.slice(0, 8)).toEqual([
      "SH-1004",
      "有差异",
      "300",
      "180",
      "120",
      "45000.00",
      "27000.00",
      "18000.00",
    ]);
    expect(rows[4]).toContain("转交跟进（未解决）");
    expect(rows[5]).toContain("待处理");
    expect(rows.slice(1).every((r) => r[16] === "" && r[18] === "否")).toBe(true);
    expect(rows.slice(1).map((r) => r[17])).toEqual(rows.slice(1).map((r) => r[1]));
  });

  it("records each correction and the re-run result of its line", () => {
    const corrections = [
      { id: "EX-02", correction: { kind: "keep-row", row: 5 } },
      {
        id: "EX-04",
        correction: {
          kind: "fill-field",
          table: "shipments",
          row: 8,
          field: "quantity",
          value: 40,
        },
      },
      { id: "EX-05", correction: { kind: "reassign-invoice", row: 8, shipmentId: "SH-1004" } },
    ] as const;
    let review = initialReview(result.exceptions.map((e) => e.id));
    for (const c of corrections) review = reviewReducer(review, { type: "setCorrection", ...c });
    const fixed = applyCorrections(
      SAMPLE_SHIPMENTS,
      SAMPLE_INVOICES,
      corrections.map((c) => c.correction),
    );
    const rows = buildReportRows(
      result,
      review,
      reportLabels,
      reconcile(fixed.shipments, fixed.invoices),
    );
    expect(rows.slice(1).map((r) => [r[0], r[1], r[16], r[17]])).toEqual([
      ["SH-1001", "已匹配", "", "已匹配"],
      ["SH-1002", "已匹配", "", "已匹配"],
      ["SH-1003", "需人工判断", "以发货表第 5 行为准，忽略同号的其他行", "已匹配"],
      ["SH-1004", "有差异", "", "有差异"],
      ["SH-1005", "数据缺失", "发货表第 8 行的数量补录为 40", "已匹配"],
      ["SH-1099", "发票无对应发货", "发票表第 8 行的发货单号改为 SH-1004", "已并入其他发货单"],
    ]);
  });
});
