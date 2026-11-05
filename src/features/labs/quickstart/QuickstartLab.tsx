"use client";

import { useReducer } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { ResultPanel } from "../shared/ResultPanel";
import {
  canAdvance,
  initialQuickstart,
  progress,
  quickstartReducer,
  stageErrors,
  STAGES,
} from "./rules";
import { StageBody } from "./StageBody";
import { cn } from "@/lib/utils";

const s = t.labs.quickstart;

export function QuickstartLab() {
  const [state, dispatch] = useReducer(quickstartReducer, initialQuickstart);
  const { index, total, percent } = progress(state);
  const errors = stageErrors(state);

  return (
    <div className="space-y-6">
      <div>
        <ol className="flex flex-wrap gap-2 text-xs" aria-label={s.stageOf(index + 1, total)}>
          {STAGES.map((stage, i) => (
            <li
              key={stage}
              aria-current={i === index ? "step" : undefined}
              className={
                i === index
                  ? "rounded-full bg-brand-600 px-3 py-1 text-white"
                  : "rounded-full border border-line px-3 py-1 dark:border-line-dark"
              }
            >
              {i + 1}. {s.stages[stage]}
            </li>
          ))}
        </ol>
        <div
          role="progressbar"
          aria-label={s.stageOf(index + 1, total)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className={cn(
            "mt-3 h-2 overflow-hidden rounded-full bg-surface-muted dark:bg-surface-dark-muted",
          )}
        >
          <div className="h-full bg-brand-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 font-semibold">{s.prompts[state.stage]}</legend>
        <StageBody state={state} dispatch={dispatch} />
      </fieldset>

      <ResultPanel
        summary={state.stage === "review" ? s.done : s.stageOf(index + 1, total)}
        items={errors.map((e) => ({ key: e, severity: "error", text: s.errors[e] }))}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => dispatch({ type: "back" })}
        >
          {s.back}
        </Button>
        {state.stage === "review" ? (
          <Button onClick={() => dispatch({ type: "reset" })}>{s.restart}</Button>
        ) : (
          <Button disabled={!canAdvance(state)} onClick={() => dispatch({ type: "next" })}>
            {s.next}
          </Button>
        )}
      </div>
    </div>
  );
}
