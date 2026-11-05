/**
 * Flow builder rules. Pure and deterministic: no I/O, no randomness, no model calls.
 */
export const STEP_KINDS = ["input", "process", "verification", "output"] as const;
export type StepKind = (typeof STEP_KINDS)[number];

export const OWNERS = ["business", "agent", "system", "reviewer"] as const;
export type Owner = (typeof OWNERS)[number];

export interface FlowStep {
  id: string;
  name: string;
  kind: StepKind;
  owner: Owner | "";
  dataSource: string;
  exceptionPath: string;
  humanReview: boolean;
}

export type IssueCode =
  | "empty-flow"
  | "missing-name"
  | "missing-owner"
  | "missing-data-source"
  | "missing-exception-path"
  | "verification-needs-review"
  | "no-verification-step";

export interface FlowIssue {
  code: IssueCode;
  severity: "error" | "warning";
  stepId?: string;
}

export interface FlowReport {
  issues: FlowIssue[];
  /** 0–100: share of per-step requirements that are satisfied. */
  score: number;
  complete: boolean;
}

const filled = (value: string) => value.trim().length > 0;

export function validateStep(step: FlowStep): FlowIssue[] {
  const issues: FlowIssue[] = [];
  const add = (code: IssueCode) => issues.push({ code, severity: "error", stepId: step.id });
  if (!filled(step.name)) add("missing-name");
  if (!step.owner) add("missing-owner");
  if (!filled(step.dataSource)) add("missing-data-source");
  if (!filled(step.exceptionPath)) add("missing-exception-path");
  if (step.kind === "verification" && !step.humanReview) add("verification-needs-review");
  return issues;
}

/** Number of checks applied to a step (used for scoring). */
function checksFor(step: FlowStep): number {
  return step.kind === "verification" ? 5 : 4;
}

export function validateFlow(steps: readonly FlowStep[]): FlowReport {
  if (steps.length === 0) {
    return { issues: [{ code: "empty-flow", severity: "error" }], score: 0, complete: false };
  }
  const stepIssues = steps.flatMap(validateStep);
  const total = steps.reduce((sum, s) => sum + checksFor(s), 0);
  const issues = [...stepIssues];
  if (!steps.some((s) => s.kind === "verification")) {
    issues.push({ code: "no-verification-step", severity: "warning" });
  }
  const score = Math.round(((total - stepIssues.length) / total) * 100);
  return { issues, score, complete: !issues.some((i) => i.severity === "error") };
}

// ---- State -------------------------------------------------------------------------------

export interface FlowState {
  steps: FlowStep[];
  nextId: number;
}

export type FlowAction =
  | { type: "add"; kind?: StepKind }
  | { type: "update"; id: string; patch: Partial<Omit<FlowStep, "id">> }
  | { type: "remove"; id: string }
  | { type: "move"; id: string; direction: -1 | 1 }
  | { type: "reset"; state: FlowState };

export function createStep(id: number, kind: StepKind = "process"): FlowStep {
  return {
    id: `step-${id}`,
    name: "",
    kind,
    owner: "",
    dataSource: "",
    exceptionPath: "",
    humanReview: kind === "verification",
  };
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "add":
      return {
        steps: [...state.steps, createStep(state.nextId, action.kind)],
        nextId: state.nextId + 1,
      };
    case "update":
      return {
        ...state,
        steps: state.steps.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      };
    case "remove":
      return { ...state, steps: state.steps.filter((s) => s.id !== action.id) };
    case "move": {
      const from = state.steps.findIndex((s) => s.id === action.id);
      const to = from + action.direction;
      if (from < 0 || to < 0 || to >= state.steps.length) return state;
      const steps = [...state.steps];
      const [moved] = steps.splice(from, 1);
      if (moved) steps.splice(to, 0, moved);
      return { ...state, steps };
    }
    case "reset":
      return action.state;
  }
}

/** Deliberately incomplete starting flow so learners see the rules in action. */
export interface InitialFlowLabels {
  input: string;
  process: string;
  verification: string;
  source: string;
}

export function initialFlow(labels: InitialFlowLabels): FlowState {
  return {
    nextId: 4,
    steps: [
      {
        ...createStep(1, "input"),
        name: labels.input,
        owner: "business",
        dataSource: labels.source,
      },
      { ...createStep(2, "process"), name: labels.process, owner: "agent" },
      { ...createStep(3, "verification"), name: labels.verification, humanReview: false },
    ],
  };
}
