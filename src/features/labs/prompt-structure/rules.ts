/**
 * Prompt structuring rules. Pure and deterministic: string checks only, no model calls.
 */
export const SECTIONS = ["role", "goal", "context", "constraints", "format", "examples"] as const;
export type SectionId = (typeof SECTIONS)[number];
export type PromptSections = Record<SectionId, string>;

export const REQUIRED: readonly SectionId[] = ["role", "goal", "format"];

export type PromptIssueCode =
  | "missing-required"
  | "missing-recommended"
  | "goal-too-short"
  | "format-not-checkable"
  | "no-fallback";

export interface PromptIssue {
  code: PromptIssueCode;
  severity: "error" | "warning";
  section: SectionId;
}

export interface PromptReport {
  issues: PromptIssue[];
  filled: SectionId[];
  /** 0–100 weighted score: required sections count double. */
  score: number;
  ready: boolean;
}

/** Keywords indicating an output format a program or reviewer can check. */
const FORMAT_HINTS = ["json", "表格", "列表", "字段", "markdown", "csv", "编号", "格式"];
/** Keywords indicating what to do when information is missing. */
const FALLBACK_HINTS = ["人工", "不确定", "无法", "信息不足", "unknown"];

const has = (text: string, hints: readonly string[]) => {
  const lower = text.toLowerCase();
  return hints.some((h) => lower.includes(h));
};

export function emptySections(): PromptSections {
  return { role: "", goal: "", context: "", constraints: "", format: "", examples: "" };
}

export function analyzePrompt(sections: PromptSections): PromptReport {
  const issues: PromptIssue[] = [];
  const filled = SECTIONS.filter((id) => sections[id].trim().length > 0);

  for (const id of SECTIONS) {
    if (filled.includes(id)) continue;
    const required = REQUIRED.includes(id);
    issues.push({
      code: required ? "missing-required" : "missing-recommended",
      severity: required ? "error" : "warning",
      section: id,
    });
  }
  if (filled.includes("goal") && sections.goal.trim().length < 8) {
    issues.push({ code: "goal-too-short", severity: "warning", section: "goal" });
  }
  if (filled.includes("format") && !has(sections.format, FORMAT_HINTS)) {
    issues.push({ code: "format-not-checkable", severity: "warning", section: "format" });
  }
  if (filled.includes("constraints") && !has(sections.constraints, FALLBACK_HINTS)) {
    issues.push({ code: "no-fallback", severity: "warning", section: "constraints" });
  }

  const weight = (id: SectionId) => (REQUIRED.includes(id) ? 2 : 1);
  const max = SECTIONS.reduce((sum, id) => sum + weight(id), 0);
  const got = filled.reduce((sum, id) => sum + weight(id), 0);
  return {
    issues,
    filled,
    score: Math.round((got / max) * 100),
    ready: !issues.some((i) => i.severity === "error"),
  };
}

/** Assemble filled sections, in canonical order, under the given headings. */
export function assemblePrompt(
  sections: PromptSections,
  headings: Readonly<Record<SectionId, string>>,
): string {
  return SECTIONS.filter((id) => sections[id].trim())
    .map((id) => `## ${headings[id]}\n${sections[id].trim()}`)
    .join("\n\n");
}
