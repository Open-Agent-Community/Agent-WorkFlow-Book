import { describe, expect, it } from "vitest";
import type { QuickstartAction, QuickstartState } from "./rules";
import { canAdvance, initialQuickstart, progress, quickstartReducer, stageErrors } from "./rules";

const run = (actions: QuickstartAction[], from: QuickstartState = initialQuickstart) =>
  actions.reduce(quickstartReducer, from);

describe("quickstart state machine", () => {
  it("cannot advance until the current stage is valid", () => {
    expect(stageErrors(initialQuickstart)).toEqual(["choose-task"]);
    expect(run([{ type: "next" }])).toBe(initialQuickstart);
    expect(run([{ type: "selectTask", task: "weekly-report" }, { type: "next" }]).stage).toBe(
      "split",
    );
  });

  it("requires at least three steps, kept in canonical order", () => {
    const s = run([
      { type: "selectTask", task: "ticket-triage" },
      { type: "next" },
      { type: "toggleStep", step: "verify" },
      { type: "toggleStep", step: "collect" },
    ]);
    expect(stageErrors(s)).toEqual(["too-few-steps"]);
    const t = run([{ type: "toggleStep", step: "draft" }], s);
    expect(t.steps).toEqual(["collect", "draft", "verify"]);
    expect(canAdvance(t)).toBe(true);
  });

  it("requires an owner per step and a human-owned review step", () => {
    let s = run([
      { type: "selectTask", task: "meeting-notes" },
      { type: "next" },
      { type: "toggleStep", step: "collect" },
      { type: "toggleStep", step: "draft" },
      { type: "toggleStep", step: "verify" },
      { type: "next" },
      { type: "setOwner", step: "collect", role: "system" },
      { type: "setOwner", step: "draft", role: "agent" },
    ]);
    expect(stageErrors(s)).toEqual(["missing-owner"]);
    s = run([{ type: "setOwner", step: "verify", role: "agent" }, { type: "next" }], s);
    expect(s.stage).toBe("check");
    expect(stageErrors(s)).toEqual(["choose-review"]);
    s = run([{ type: "setReview", step: "verify" }], s);
    expect(stageErrors(s)).toEqual(["review-needs-human"]);
    s = run([{ type: "setOwner", step: "verify", role: "human" }, { type: "next" }], s);
    expect(s.stage).toBe("review");
    expect(progress(s)).toEqual({ index: 4, total: 5, percent: 100 });
    expect(canAdvance(s)).toBe(false);
  });

  it("clears owner and review when a step is deselected", () => {
    const s = run([
      { type: "toggleStep", step: "verify" },
      { type: "setOwner", step: "verify", role: "human" },
      { type: "setReview", step: "verify" },
      { type: "toggleStep", step: "verify" },
    ]);
    expect(s.owners).toEqual({});
    expect(s.reviewStep).toBeNull();
  });

  it("ignores review on unselected steps, goes back, and resets", () => {
    expect(run([{ type: "setReview", step: "draft" }]).reviewStep).toBeNull();
    expect(run([{ type: "back" }]).stage).toBe("task");
    const s = run([{ type: "selectTask", task: "weekly-report" }, { type: "next" }]);
    expect(run([{ type: "back" }], s).stage).toBe("task");
    expect(run([{ type: "reset" }], s)).toEqual(initialQuickstart);
  });
});
