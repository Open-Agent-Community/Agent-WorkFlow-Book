"use client";

import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { t } from "@/i18n";
import type { AgentBrief } from "./agent";
import type { RunChange } from "./corrections";
import { noteText, roleTone, severityTone, suggestionText } from "./present";
import { CSV_BOM, REPORT_FILENAME } from "./report";
import type { ReconResult } from "./rules";
import type { ReviewAction, ReviewState } from "./review";
import { reviewStats } from "./review";
import { RerunPanel } from "./RerunPanel";
import { ReviewPanel, UnresolvedNote } from "./ReviewPanel";
import type { InvoiceRow, ShipmentRow } from "./sample-data";
import { InvoiceTable, ResultsTable, ShipmentTable, TableFrame, td, th } from "./Tables";

const r = t.labs.recon;

export interface StageProps {
  state: ReviewState;
  dispatch: (a: ReviewAction) => void;
  shipments: readonly ShipmentRow[];
  invoices: readonly InvoiceRow[];
  result: ReconResult;
  /** The reconciliation re-run after the reviewer's corrections. */
  after: ReconResult;
  changes: RunChange[];
  brief: AgentBrief;
  csvRows: string[][];
  csv: string;
}

export const RoleBadge = ({ role }: { role: keyof typeof roleTone }) => (
  <Badge tone={roleTone[role]}>{r.roles[role].label}</Badge>
);

export function StageBody(props: StageProps) {
  const { state, shipments, invoices, result, brief } = props;
  switch (state.stage) {
    case "data":
      return (
        <div className="space-y-4">
          <ShipmentTable rows={shipments} label={r.tables.shipments} />
          <InvoiceTable rows={invoices} label={r.tables.invoices} />
        </div>
      );
    case "reconcile":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-line p-3 text-sm dark:border-line-dark">
            <p className="mb-2 flex items-center gap-2 font-medium">
              <RoleBadge role="code" />
              {r.checks.heading}
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {r.checks.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <ResultsTable result={result} />
        </div>
      );
    case "agent":
      return (
        <div className="space-y-3 rounded-card border-2 border-dashed border-sim/40 p-4">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <Badge tone="sim">{r.agent.badge}</Badge>
            <span className="text-ink-muted dark:text-ink-dark-muted">{r.agent.disclaimer}</span>
          </p>
          <p className="text-sm">
            {r.agent.headline(
              brief.lines,
              brief.matched,
              brief.exceptions,
              brief.bySeverity.high,
              brief.bySeverity.medium,
              brief.bySeverity.low,
            )}
          </p>
          <ol className="space-y-2">
            {brief.notes.map((n) => (
              <li
                key={n.exception.id}
                className="rounded-lg border border-line p-3 text-sm dark:border-line-dark"
              >
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium">{n.exception.id}</span>
                  <Badge tone={severityTone[n.exception.severity]}>
                    {r.severityLabel(r.severity[n.exception.severity])}
                  </Badge>
                  <span className="font-medium">{r.kinds[n.exception.kind]}</span>
                </p>
                <p className="mt-1">{noteText(n)}</p>
                <p className="mt-1 text-ink-muted dark:text-ink-dark-muted">
                  {r.agent.suggestionLabel}：{suggestionText(n)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      );
    case "review":
      return <ReviewPanel {...props} />;
    case "rerun":
      return <RerunPanel {...props} />;
    case "export":
      return <ExportPanel {...props} />;
  }
}

/** CSV columns in the on-page preview: id, result, exception, status, note, fix, re-run. */
const PREVIEW_COLUMNS = [0, 1, 10, 14, 15, 16, 17] as const;

function ExportPanel({ state, csvRows, csv }: StageProps) {
  const pick = (row: readonly string[]) => PREVIEW_COLUMNS.map((i) => row[i] ?? "");
  const [header = [], ...body] = csvRows;
  const href = `data:text/csv;charset=utf-8,${encodeURIComponent(CSV_BOM + csv)}`;
  return (
    <div className="space-y-4">
      <UnresolvedNote count={reviewStats(state).unresolved} />
      <a href={href} download={REPORT_FILENAME} className={buttonClasses("primary")}>
        {r.export.download}
      </a>
      <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
        {REPORT_FILENAME} · {r.export.rows(body.length, header.length)}
      </p>
      <TableFrame label={r.export.preview}>
        <thead>
          <tr>
            {pick(header).map((h) => (
              <th key={h} scope="col" className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {pick(row).map((cell, j) => (
                <td key={j} className={td}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableFrame>
    </div>
  );
}
