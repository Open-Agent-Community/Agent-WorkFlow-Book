/**
 * Five-minute quickstart: a deterministic five-stage state machine.
 * Labels live in i18n; this module only deals with ids.
 */
export const STAGES = ["task", "split", "owners", "check", "review"] as const;
export type Stage = (typeof STAGES)[number];

export const TASKS = ["weekly-report", "ticket-triage", "meeting-notes"] as const;
export type TaskId = (typeof TASKS)[number];

export const CANDIDATE_STEPS = [
  "collect",
  "clean",
  "draft",
  "verify",
  "publish",
  "archive",
] as const;
export type StepId = (typeof CANDIDATE_STEPS)[number];

export const ROLES = ["human", "agent", "system"] as const;
export type Role = (typeof ROLES)[number];

export const MIN_STEPS = 3;

export interface QuickstartState {
  stage: Stage;
  task: TaskId | null;
  /** Selected steps, kept in canonical candidate order. */
  steps: StepId[];
  owners: Partial<Record<StepId, Role>>;
  reviewStep: StepId | null;
}

export type QuickstartAction =
  | { type: "selectTask"; task: TaskId }
  | { type: "toggleStep"; step: StepId }
  | { type: "setOwner"; step: StepId; role: Role }
  | { type: "setReview"; step: StepId }
  | { type: "next" }
  | { type: "back" }
  | { type: "reset" };

export type StageError =
  "choose-task" | "too-few-steps" | "missing-owner" | "choose-review" | "review-needs-human";

export const initialQuickstart: QuickstartState = {
  stage: "task",
  task: null,
  steps: [],
  owners: {},
  reviewStep: null,
};

export function stageErrors(state: QuickstartState): StageError[] {
  switch (state.stage) {
    case "task":
      return state.task ? [] : ["choose-task"];
    case "split":
      return state.steps.length >= MIN_STEPS ? [] : ["too-few-steps"];
    case "owners":
      return state.steps.every((s) => state.owners[s]) ? [] : ["missing-owner"];
    case "check":
      if (!state.reviewStep) return ["choose-review"];
      return state.owners[state.reviewStep] === "human" ? [] : ["review-needs-human"];
    case "review":
      return [];
  }
}

export const canAdvance = (state: QuickstartState) =>
  state.stage !== "review" && stageErrors(state).length === 0;

export function progress(state: QuickstartState) {
  const index = STAGES.indexOf(state.stage);
  return { index, total: STAGES.length, percent: Math.round((index / (STAGES.length - 1)) * 100) };
}

function shift(stage: Stage, by: 1 | -1): Stage {
  const i = Math.min(Math.max(STAGES.indexOf(stage) + by, 0), STAGES.length - 1);
  return STAGES[i] ?? stage;
}

export function quickstartReducer(state: QuickstartState, action: QuickstartAction) {
  switch (action.type) {
    case "selectTask":
      return { ...state, task: action.task };
    case "toggleStep": {
      const on = state.steps.includes(action.step);
      const steps = CANDIDATE_STEPS.filter((s) =>
        s === action.step ? !on : state.steps.includes(s),
      );
      const owners: QuickstartState["owners"] = Object.fromEntries(
        Object.entries(state.owners).filter(([step]) => !on || step !== action.step),
      );
      const reviewStep = on && state.reviewStep === action.step ? null : state.reviewStep;
      return { ...state, steps, owners, reviewStep };
    }
    case "setOwner":
      return { ...state, owners: { ...state.owners, [action.step]: action.role } };
    case "setReview":
      return state.steps.includes(action.step) ? { ...state, reviewStep: action.step } : state;
    case "next":
      return canAdvance(state) ? { ...state, stage: shift(state.stage, 1) } : state;
    case "back":
      return { ...state, stage: shift(state.stage, -1) };
    case "reset":
      return initialQuickstart;
  }
}
