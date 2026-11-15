import { describe, expect, it } from "vitest";
import type { ReviewAction, ReviewState } from "./review";
import {
  canAdvance,
  canConfirm,
  initialReview,
  NOTE_MAX,
  reviewErrors,
  reviewReducer,
  reviewStats,
} from "./review";

const start = initialReview(["EX-01", "EX-02"]);
const run = (actions: ReviewAction[], from: ReviewState = start) =>
  actions.reduce(reviewReducer, from);
const toReview: ReviewAction[] = [{ type: "next" }, { type: "next" }, { type: "next" }];

describe("reconciliation review state", () => {
  it("moves freely through the code and Agent stages", () => {
    expect(run(toReview).stage).toBe("review");
    expect(run([...toReview, { type: "back" }]).stage).toBe("agent");
  });

  it("requires every exception to be inspected, then a confirmation, before export", () => {
    let s = run(toReview);
    expect(reviewErrors(s)).toEqual(["inspect-all"]);
    expect(canConfirm(s)).toBe(false);
    expect(run([{ type: "confirm" }], s).confirmed).toBe(false);
    s = run(
      [
        { type: "inspect", id: "EX-01" },
        { type: "inspect", id: "EX-02" },
      ],
      s,
    );
    expect(s.selected).toBe("EX-02");
    expect(reviewErrors(s)).toEqual(["confirm-review"]);
    expect(run([{ type: "next" }], s).stage).toBe("review");
    s = run([{ type: "confirm" }, { type: "next" }], s);
    expect(s.stage).toBe("rerun");
    s = run([{ type: "next" }], s);
    expect(s.stage).toBe("export");
    expect(canAdvance(s)).toBe(false);
  });

  it("records, replaces and clears a correction, and locks it after confirmation", () => {
    let s = run([{ type: "setCorrection", id: "EX-01", correction: { kind: "keep-row", row: 5 } }]);
    expect(s.corrections).toEqual({ "EX-01": { kind: "keep-row", row: 5 } });
    s = run([{ type: "setCorrection", id: "EX-01", correction: { kind: "keep-row", row: 6 } }], s);
    expect(s.corrections["EX-01"]).toEqual({ kind: "keep-row", row: 6 });
    expect(run([{ type: "setCorrection", id: "EX-01", correction: null }], s).corrections).toEqual(
      {},
    );
    expect(
      run([{ type: "setCorrection", id: "EX-99", correction: { kind: "keep-row", row: 5 } }], s),
    ).toBe(s);
    const locked = run(
      [
        ...toReview,
        { type: "inspect", id: "EX-01" },
        { type: "inspect", id: "EX-02" },
        { type: "confirm" },
        { type: "setCorrection", id: "EX-01", correction: null },
      ],
      s,
    );
    expect(locked.corrections["EX-01"]).toEqual({ kind: "keep-row", row: 6 });
    expect(run([{ type: "reset" }], locked).corrections).toEqual({});
  });

  it("only resolves an exception with a note; clearing the note reopens it", () => {
    let s = run([{ type: "setDecision", id: "EX-01", decision: "resolved" }]);
    expect(s.entries["EX-01"]?.decision).toBe("open");
    s = run(
      [
        { type: "setNote", id: "EX-01", note: "已核对，重复导入" },
        { type: "setDecision", id: "EX-01", decision: "resolved" },
      ],
      s,
    );
    expect(s.entries["EX-01"]?.decision).toBe("resolved");
    s = run([{ type: "setNote", id: "EX-01", note: "  " }], s);
    expect(s.entries["EX-01"]?.decision).toBe("open");
  });

  it("keeps follow-up and open exceptions unresolved after confirmation", () => {
    const s = run([
      ...toReview,
      { type: "inspect", id: "EX-01" },
      { type: "inspect", id: "EX-02" },
      { type: "setNote", id: "EX-01", note: "ok" },
      { type: "setDecision", id: "EX-01", decision: "resolved" },
      { type: "setDecision", id: "EX-02", decision: "follow-up" },
      { type: "confirm" },
    ]);
    expect(reviewStats(s)).toEqual({ total: 2, inspected: 2, resolved: 1, unresolved: 1 });
    expect(s.confirmed).toBe(true);
  });

  it("locks edits after confirmation until the reviewer reopens", () => {
    let s = run([
      ...toReview,
      { type: "inspect", id: "EX-01" },
      { type: "inspect", id: "EX-02" },
      { type: "confirm" },
      { type: "setNote", id: "EX-01", note: "late" },
    ]);
    expect(s.entries["EX-01"]?.note).toBe("");
    s = run([{ type: "reopen" }, { type: "setNote", id: "EX-01", note: "late" }], s);
    expect(s.entries["EX-01"]?.note).toBe("late");
  });

  it("caps notes, ignores unknown ids and resets", () => {
    const s = run([{ type: "setNote", id: "EX-01", note: "x".repeat(NOTE_MAX + 10) }]);
    expect(s.entries["EX-01"]?.note).toHaveLength(NOTE_MAX);
    expect(run([{ type: "inspect", id: "EX-99" }])).toBe(start);
    expect(run([{ type: "reset" }], s)).toEqual(start);
  });
});
