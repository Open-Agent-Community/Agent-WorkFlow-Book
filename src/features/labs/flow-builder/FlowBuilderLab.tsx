"use client";

import { useMemo, useReducer } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import type { ResultItem } from "../shared/ResultPanel";
import { ResultPanel } from "../shared/ResultPanel";
import { flowReducer, initialFlow, validateFlow } from "./rules";
import { StepEditor } from "./StepEditor";

const s = t.labs.flow;

export function FlowBuilderLab() {
  const [state, dispatch] = useReducer(flowReducer, s.initial, initialFlow);
  const report = useMemo(() => validateFlow(state.steps), [state.steps]);

  const items: ResultItem[] = report.issues.map((issue, i) => {
    const index = state.steps.findIndex((step) => step.id === issue.stepId);
    const prefix = index >= 0 ? `${s.step(index + 1)}：` : "";
    return {
      key: `${issue.code}-${issue.stepId ?? i}`,
      severity: issue.severity,
      text: prefix + s.issues[issue.code],
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        {state.steps.map((step, index) => (
          <StepEditor
            key={step.id}
            step={step}
            index={index}
            count={state.steps.length}
            issues={report.issues.filter((i) => i.stepId === step.id)}
            dispatch={dispatch}
          />
        ))}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => dispatch({ type: "add" })}>{s.add}</Button>
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "reset", state: initialFlow(s.initial) })}
          >
            {s.reset}
          </Button>
        </div>
      </div>
      <div className="lg:sticky lg:top-4 lg:self-start">
        <ResultPanel
          score={report.score}
          summary={report.complete ? s.complete : s.incomplete}
          items={items}
        />
      </div>
    </div>
  );
}
