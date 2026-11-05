import { describe, expect, it } from "vitest";
import type { PromptSections } from "./rules";
import { analyzePrompt, assemblePrompt, emptySections, SECTIONS } from "./rules";

const headings = Object.fromEntries(SECTIONS.map((s) => [s, s.toUpperCase()])) as Record<
  (typeof SECTIONS)[number],
  string
>;

const full: PromptSections = {
  role: "你是财务助理",
  goal: "把发票按类型分类并提取金额",
  context: "发票来自共享邮箱",
  constraints: "信息不足时回答需要人工确认",
  format: "输出 JSON，字段为 type 和 amount",
  examples: "输入：… 输出：…",
};

describe("analyzePrompt", () => {
  it("flags missing required sections as errors", () => {
    const report = analyzePrompt(emptySections());
    expect(report.ready).toBe(false);
    expect(report.score).toBe(0);
    const errors = report.issues.filter((i) => i.severity === "error").map((i) => i.section);
    expect(errors).toEqual(["role", "goal", "format"]);
  });

  it("accepts a complete prompt with no issues", () => {
    expect(analyzePrompt(full)).toEqual({
      issues: [],
      filled: [...SECTIONS],
      score: 100,
      ready: true,
    });
  });

  it("weights required sections double", () => {
    const report = analyzePrompt({
      ...emptySections(),
      role: "a",
      goal: "完成一项较长的任务",
      format: "表格",
    });
    expect(report.ready).toBe(true);
    expect(report.score).toBe(Math.round((6 / 9) * 100));
  });

  it("warns about uncheckable formats, short goals and missing fallbacks", () => {
    const codes = analyzePrompt({
      ...full,
      goal: "分类",
      format: "写得好一点",
      constraints: "不要太长",
    }).issues.map((i) => i.code);
    expect(codes).toEqual(["goal-too-short", "format-not-checkable", "no-fallback"]);
  });
});

describe("assemblePrompt", () => {
  it("orders sections canonically and skips empty ones", () => {
    const text = assemblePrompt({ ...emptySections(), format: " F ", role: "R" }, headings);
    expect(text).toBe("## ROLE\nR\n\n## FORMAT\nF");
  });
});
