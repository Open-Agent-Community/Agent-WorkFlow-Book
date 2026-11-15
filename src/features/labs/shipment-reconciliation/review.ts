/**
 * Stage and human-review state for the reconciliation lab. Pure reducer; labels live in i18n.
 * The reviewer, not code or the Agent, decides what happens to each exception.
 */
import type { Correction } from "./corrections";

export const STAGES = ["data", "reconcile", "agent", "review", "rerun", "export"] as const;
export type Stage = (typeof STAGES)[number];

export const DECISIONS = ["open", "resolved", "follow-up"] as const;
export type Decision = (typeof DECISIONS)[number];

export const NOTE_MAX = 300;

export interface ReviewEntry {
  inspected: boolean;
  decision: Decision;
  note: string;
}

export interface ReviewState {
  stage: Stage;
  /** Exception currently open in the inspector. */
  selected: string | null;
  entries: Record<string, ReviewEntry>;
  /** Source-data corrections chosen by the reviewer, keyed by exception id. */
  corrections: Record<string, Correction>;
  confirmed: boolean;
}

export type ReviewAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "reset" }
  | { type: "inspect"; id: string }
  | { type: "setNote"; id: string; note: string }
  | { type: "setDecision"; id: string; decision: Decision }
  | { type: "setCorrection"; id: string; correction: Correction | null }
  | { type: "confirm" }
  | { type: "reopen" };

export type ReviewError = "inspect-all" | "confirm-review";

const blank: ReviewEntry = { inspected: false, decision: "open", note: "" };

export function initialReview(exceptionIds: readonly string[]): ReviewState {
  return {
    stage: "data",
    selected: null,
    entries: Object.fromEntries(exceptionIds.map((id) => [id, blank])),
    corrections: {},
    confirmed: false,
  };
}

/** "Resolved" is a human decision and must be explained; "follow-up" stays unresolved. */
export const canDecide = (entry: ReviewEntry, decision: Decision) =>
  decision !== "resolved" || entry.note.trim() !== "";

export const isUnresolved = (entry: ReviewEntry) => entry.decision !== "resolved";

export function reviewStats(state: ReviewState) {
  const entries = Object.values(state.entries);
  return {
    total: entries.length,
    inspected: entries.filter((e) => e.inspected).length,
    resolved: entries.filter((e) => !isUnresolved(e)).length,
    unresolved: entries.filter(isUnresolved).length,
  };
}

export function reviewErrors(state: ReviewState): ReviewError[] {
  if (state.stage !== "review") return [];
  const { total, inspected } = reviewStats(state);
  if (inspected < total) return ["inspect-all"];
  return state.confirmed ? [] : ["confirm-review"];
}

export const canConfirm = (state: ReviewState) =>
  !state.confirmed && reviewStats(state).inspected === reviewStats(state).total;

export const canAdvance = (state: ReviewState) =>
  state.stage !== "export" && reviewErrors(state).length === 0;

function shift(stage: Stage, by: 1 | -1): Stage {
  const i = Math.min(Math.max(STAGES.indexOf(stage) + by, 0), STAGES.length - 1);
  return STAGES[i] ?? stage;
}

function edit(state: ReviewState, id: string, patch: (e: ReviewEntry) => ReviewEntry | null) {
  const entry = state.entries[id];
  if (!entry || state.confirmed) return state;
  const next = patch(entry);
  return next ? { ...state, entries: { ...state.entries, [id]: next } } : state;
}

export function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case "next":
      return canAdvance(state) ? { ...state, stage: shift(state.stage, 1) } : state;
    case "back":
      return { ...state, stage: shift(state.stage, -1) };
    case "reset":
      return initialReview(Object.keys(state.entries));
    case "inspect": {
      const entry = state.entries[action.id];
      if (!entry) return state;
      const entries = { ...state.entries, [action.id]: { ...entry, inspected: true } };
      return { ...state, selected: action.id, entries };
    }
    case "setNote":
      return edit(state, action.id, (e) => {
        const note = action.note.slice(0, NOTE_MAX);
        // Clearing the note of a resolved exception reopens it: no silent resolutions.
        const decision = e.decision === "resolved" && note.trim() === "" ? "open" : e.decision;
        return { ...e, note, decision };
      });
    case "setDecision":
      return edit(state, action.id, (e) =>
        canDecide(e, action.decision) ? { ...e, decision: action.decision } : null,
      );
    case "setCorrection": {
      if (!state.entries[action.id] || state.confirmed) return state;
      const rest = Object.fromEntries(
        Object.entries(state.corrections).filter(([id]) => id !== action.id),
      );
      const corrections = action.correction ? { ...rest, [action.id]: action.correction } : rest;
      return { ...state, corrections };
    }
    case "confirm":
      return canConfirm(state) ? { ...state, confirmed: true } : state;
    case "reopen":
      return state.stage === "review" ? { ...state, confirmed: false } : state;
  }
}
