import { describe, expect, it } from "vitest";
import type { FlowStep } from "./rules";
import { createStep, flowReducer, initialFlow, validateFlow, validateStep } from "./rules";

const complete = (id: number, kind: FlowStep["kind"] = "process"): FlowStep => ({
  ...createStep(id, kind),
  name: `步骤 ${id}`,
  owner: "business",
  dataSource: "数据表",
  exceptionPath: "转人工处理",
  humanReview: true,
});

describe("validateStep", () => {
  it("requires owner, data source and exception path", () => {
    const codes = validateStep({ ...createStep(1), name: "x" }).map((i) => i.code);
    expect(codes).toEqual(["missing-owner", "missing-data-source", "missing-exception-path"]);
  });

  it("requires human review on verification steps", () => {
    const step = { ...complete(1, "verification"), humanReview: false };
    expect(validateStep(step).map((i) => i.code)).toEqual(["verification-needs-review"]);
  });

  it("does not require review on non-verification steps", () => {
    expect(validateStep({ ...complete(1), humanReview: false })).toEqual([]);
  });

  it("treats whitespace as empty", () => {
    const codes = validateStep({ ...complete(1), dataSource: "   " }).map((i) => i.code);
    expect(codes).toEqual(["missing-data-source"]);
  });
});

describe("validateFlow", () => {
  it("rejects an empty flow", () => {
    expect(validateFlow([])).toEqual({
      issues: [{ code: "empty-flow", severity: "error" }],
      score: 0,
      complete: false,
    });
  });

  it("is complete when every step passes and there is a verification step", () => {
    const report = validateFlow([complete(1), complete(2, "verification")]);
    expect(report).toEqual({ issues: [], score: 100, complete: true });
  });

  it("warns, but stays complete, without a verification step", () => {
    const report = validateFlow([complete(1)]);
    expect(report.complete).toBe(true);
    expect(report.issues).toEqual([{ code: "no-verification-step", severity: "warning" }]);
  });

  it("scores partially complete flows deterministically", () => {
    const flow = initialFlow({
      input: "接收",
      process: "识别",
      verification: "校验",
      source: "邮箱",
    });
    const a = validateFlow(flow.steps);
    const b = validateFlow(flow.steps);
    expect(a).toEqual(b);
    expect(a.complete).toBe(false);
    // 13 checks in total (4 + 4 + 5), 7 of which fail.
    expect(a.score).toBe(Math.round(((13 - 7) / 13) * 100));
  });
});

describe("flowReducer", () => {
  const start = { steps: [complete(1), complete(2)], nextId: 3 };

  it("adds steps with sequential ids", () => {
    const next = flowReducer(start, { type: "add", kind: "verification" });
    expect(next.steps.at(-1)).toMatchObject({
      id: "step-3",
      kind: "verification",
      humanReview: true,
    });
    expect(next.nextId).toBe(4);
  });

  it("updates, moves and removes steps without mutating input", () => {
    const updated = flowReducer(start, { type: "update", id: "step-1", patch: { name: "新" } });
    expect(updated.steps[0]?.name).toBe("新");
    expect(start.steps[0]?.name).toBe("步骤 1");
    const moved = flowReducer(start, { type: "move", id: "step-2", direction: -1 });
    expect(moved.steps.map((s) => s.id)).toEqual(["step-2", "step-1"]);
    expect(flowReducer(start, { type: "move", id: "step-1", direction: -1 })).toBe(start);
    expect(flowReducer(start, { type: "remove", id: "step-1" }).steps).toHaveLength(1);
  });
});
