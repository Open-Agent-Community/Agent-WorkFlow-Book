"use client";

import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import type { RunChange } from "./corrections";
import { correctionText, roleTone, statusTone } from "./present";
import type { ReviewState } from "./review";
import { ResultsTable, TableFrame, td, th } from "./Tables";
import type { ReconResult } from "./types";

const r = t.labs.recon;
const f = r.fix;

/** Code re-runs the same rules on corrected data; this shows what the human's fixes changed. */
export function RerunPanel({
  state,
  result,
  after,
  changes,
}: {
  state: ReviewState;
  result: ReconResult;
  after: ReconResult;
  changes: readonly RunChange[];
}) {
  const applied = result.exceptions.flatMap((e) => {
    const c = state.corrections[e.id];
    return c ? [{ id: e.id, text: correctionText(c) }] : [];
  });
  const status = (s: RunChange["before"], missing: string) =>
    s ? <Badge tone={statusTone[s]}>{r.lineStatus[s]}</Badge> : <Badge>{missing}</Badge>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line p-3 text-sm dark:border-line-dark">
        <p className="mb-2 flex items-center gap-2 font-medium">
          <Badge tone={roleTone.human}>{r.roles.human.label}</Badge>
          {f.rerun.appliedHeading}
        </p>
        {applied.length === 0 ? (
          <p className="text-ink-muted dark:text-ink-dark-muted">{f.rerun.empty}</p>
        ) : (
          <ul className="space-y-1">
            {applied.map((a) => (
              <li key={a.id}>
                <span className="font-mono font-medium">{a.id}</span>：{a.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="flex flex-wrap items-center gap-2 text-sm">
        <Badge tone={roleTone.code}>{r.roles.code.label}</Badge>
        {f.rerun.summary(applied.length, result.exceptions.length, after.exceptions.length)}
      </p>

      <TableFrame label={f.rerun.compareCaption}>
        <thead>
          <tr>
            {[f.rerun.shipmentId, f.rerun.before, f.rerun.after].map((h) => (
              <th key={h} scope="col" className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {changes.map((c) => (
            <tr key={c.key}>
              <td className={cn(td, "font-mono whitespace-nowrap")}>{c.shipmentId || "—"}</td>
              <td className={td}>{status(c.before, f.added)}</td>
              <td className={td}>
                <span className="flex flex-wrap items-center gap-2">
                  {status(c.after, f.merged)}
                  {c.changed ? <Badge tone="brand">{f.rerun.changed}</Badge> : null}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableFrame>

      <ResultsTable result={after} label={f.rerun.resultCaption} />
    </div>
  );
}
