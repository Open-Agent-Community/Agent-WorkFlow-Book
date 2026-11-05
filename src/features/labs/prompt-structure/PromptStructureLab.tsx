"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { inputClass, labelClass } from "../shared/fields";
import { ResultPanel } from "../shared/ResultPanel";
import type { PromptSections } from "./rules";
import { analyzePrompt, assemblePrompt, emptySections, REQUIRED, SECTIONS } from "./rules";

const s = t.labs.prompt;

export function PromptStructureLab() {
  const [sections, setSections] = useState<PromptSections>(emptySections);
  const report = useMemo(() => analyzePrompt(sections), [sections]);
  const assembled = assemblePrompt(sections, s.headings);

  return (
    <div className="space-y-6">
      <figure className="rounded-card border border-dashed border-line p-4 dark:border-line-dark">
        <figcaption className={labelClass}>{s.draftLabel}</figcaption>
        <blockquote className="text-sm">{s.draft}</blockquote>
      </figure>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {SECTIONS.map((id) => (
            <div key={id}>
              <label htmlFor={`prompt-${id}`} className={labelClass}>
                {s.headings[id]}
                {REQUIRED.includes(id) ? (
                  <Badge tone="brand" className="ml-2">
                    {s.required}
                  </Badge>
                ) : null}
              </label>
              <textarea
                id={`prompt-${id}`}
                rows={2}
                value={sections[id]}
                placeholder={s.placeholders[id]}
                aria-invalid={report.issues.some((i) => i.section === id && i.severity === "error")}
                onChange={(e) => setSections((prev) => ({ ...prev, [id]: e.target.value }))}
                className={inputClass}
              />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setSections({ ...s.example })}>
              {s.loadExample}
            </Button>
            <Button variant="ghost" onClick={() => setSections(emptySections())}>
              {s.clear}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <ResultPanel
            score={report.score}
            summary={report.ready ? s.ready : s.notReady}
            items={report.issues.map((i) => ({
              key: `${i.code}-${i.section}`,
              severity: i.severity,
              text: `${s.headings[i.section]}：${s.issues[i.code]}`,
            }))}
          />
          <section aria-labelledby="prompt-preview-heading">
            <h3 id="prompt-preview-heading" className="mb-2 font-semibold">
              {s.preview}
            </h3>
            <pre className="min-h-24 overflow-x-auto rounded-card border border-line p-4 font-mono text-xs whitespace-pre-wrap dark:border-line-dark">
              {assembled || s.previewEmpty}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
