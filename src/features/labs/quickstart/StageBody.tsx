"use client";

import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n";
import { inputClass } from "../shared/fields";
import type { QuickstartAction, QuickstartState } from "./rules";
import { CANDIDATE_STEPS, ROLES, TASKS } from "./rules";

const s = t.labs.quickstart;
const option =
  "flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm " +
  "has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:border-line-dark " +
  "dark:has-[:checked]:bg-brand-700/30";

export function StageBody({
  state,
  dispatch,
}: {
  state: QuickstartState;
  dispatch: (action: QuickstartAction) => void;
}) {
  switch (state.stage) {
    case "task":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          {TASKS.map((task) => (
            <label key={task} className={option}>
              <input
                type="radio"
                name="qs-task"
                checked={state.task === task}
                onChange={() => dispatch({ type: "selectTask", task })}
              />
              {s.tasks[task]}
            </label>
          ))}
        </div>
      );
    case "split":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          {CANDIDATE_STEPS.map((step) => (
            <label key={step} className={option}>
              <input
                type="checkbox"
                checked={state.steps.includes(step)}
                onChange={() => dispatch({ type: "toggleStep", step })}
              />
              {s.steps[step]}
            </label>
          ))}
        </div>
      );
    case "owners":
      return (
        <ul className="space-y-2">
          {state.steps.map((step) => (
            <li key={step} className="grid items-center gap-2 sm:grid-cols-[10rem_1fr]">
              <label htmlFor={`qs-owner-${step}`} className="text-sm">
                {s.steps[step]}
              </label>
              <select
                id={`qs-owner-${step}`}
                value={state.owners[step] ?? ""}
                onChange={(e) => {
                  const role = ROLES.find((r) => r === e.target.value);
                  if (role) dispatch({ type: "setOwner", step, role });
                }}
                className={inputClass}
              >
                <option value="" disabled>
                  {t.labs.flow.chooseOwner}
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {s.roles[r]}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      );
    case "check":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          {state.steps.map((step) => (
            <label key={step} className={option}>
              <input
                type="radio"
                name="qs-review"
                checked={state.reviewStep === step}
                onChange={() => dispatch({ type: "setReview", step })}
              />
              {s.steps[step]}
              <span className="text-xs text-ink-muted dark:text-ink-dark-muted">
                （{s.roles[state.owners[step] ?? "human"]}）
              </span>
            </label>
          ))}
        </div>
      );
    case "review":
      return (
        <div>
          <p className="mb-2 text-sm">{state.task ? s.tasks[state.task] : ""}</p>
          <ol className="list-decimal space-y-1 pl-6 text-sm">
            {state.steps.map((step) => (
              <li key={step}>
                {s.steps[step]} · {s.roles[state.owners[step] ?? "human"]}
                {state.reviewStep === step ? (
                  <Badge tone="ok" className="ml-2">
                    {s.reviewMark}
                  </Badge>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      );
  }
}
