"use client";

import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { inputClass, labelClass } from "../shared/fields";
import type { FlowAction, FlowIssue, FlowStep } from "./rules";
import { OWNERS, STEP_KINDS } from "./rules";

const s = t.labs.flow;

export function StepEditor({
  step,
  index,
  count,
  issues,
  dispatch,
}: {
  step: FlowStep;
  index: number;
  count: number;
  issues: readonly FlowIssue[];
  dispatch: (action: FlowAction) => void;
}) {
  const id = (field: string) => `${step.id}-${field}`;
  const update = (patch: Partial<Omit<FlowStep, "id">>) =>
    dispatch({ type: "update", id: step.id, patch });
  const invalid = (code: FlowIssue["code"]) => issues.some((i) => i.code === code);

  return (
    <fieldset
      className="rounded-card border border-line p-4 data-[invalid=true]:border-danger/60 dark:border-line-dark"
      data-invalid={issues.length > 0}
    >
      <legend className="px-1 text-sm font-semibold">
        {s.step(index + 1)}
        {step.name ? `：${step.name}` : ""}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={labelClass}>
            {s.fields.name}
          </label>
          <input
            id={id("name")}
            value={step.name}
            aria-invalid={invalid("missing-name")}
            onChange={(e) => update({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={id("kind")} className={labelClass}>
            {s.fields.kind}
          </label>
          <select
            id={id("kind")}
            value={step.kind}
            onChange={(e) => {
              const kind = STEP_KINDS.find((k) => k === e.target.value) ?? "process";
              update(kind === "verification" ? { kind, humanReview: true } : { kind });
            }}
            className={inputClass}
          >
            {STEP_KINDS.map((k) => (
              <option key={k} value={k}>
                {s.kinds[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("owner")} className={labelClass}>
            {s.fields.owner}
          </label>
          <select
            id={id("owner")}
            value={step.owner}
            aria-invalid={invalid("missing-owner")}
            onChange={(e) => update({ owner: OWNERS.find((o) => o === e.target.value) ?? "" })}
            className={inputClass}
          >
            <option value="">{s.chooseOwner}</option>
            {OWNERS.map((o) => (
              <option key={o} value={o}>
                {s.owners[o]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("data")} className={labelClass}>
            {s.fields.dataSource}
          </label>
          <input
            id={id("data")}
            value={step.dataSource}
            aria-invalid={invalid("missing-data-source")}
            onChange={(e) => update({ dataSource: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("exception")} className={labelClass}>
            {s.fields.exceptionPath}
          </label>
          <input
            id={id("exception")}
            value={step.exceptionPath}
            aria-invalid={invalid("missing-exception-path")}
            onChange={(e) => update({ exceptionPath: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={step.humanReview}
            aria-invalid={invalid("verification-needs-review")}
            onChange={(e) => update({ humanReview: e.target.checked })}
            className="size-4"
          />
          {s.fields.humanReview}
        </label>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={index === 0}
            onClick={() => dispatch({ type: "move", id: step.id, direction: -1 })}
            aria-label={`${s.moveUp}：${s.step(index + 1)}`}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            disabled={index === count - 1}
            onClick={() => dispatch({ type: "move", id: step.id, direction: 1 })}
            aria-label={`${s.moveDown}：${s.step(index + 1)}`}
          >
            ↓
          </Button>
          <Button variant="secondary" onClick={() => dispatch({ type: "remove", id: step.id })}>
            {s.remove}
            <span className="sr-only">{s.step(index + 1)}</span>
          </Button>
        </div>
      </div>
    </fieldset>
  );
}
