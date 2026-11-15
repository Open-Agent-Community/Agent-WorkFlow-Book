/** Glue between the pure reconciliation modules and zh-CN labels. No business logic here. */
import { t } from "@/i18n";
import type { ReconNoteParams } from "@/i18n/zh-CN-recon";
import type { AgentNote } from "./agent";
import type { Correction } from "./corrections";
import type { ReportLabels } from "./report";
import { formatCents, formatRefs } from "./report";
import type { FieldIssue } from "./validate";

const r = t.labs.recon;

export const yuan = (cents: number) => formatCents(cents, true);

/** One-line description of a reviewer's correction, used on screen and in the CSV. */
export function correctionText(c: Correction): string {
  if (c.kind === "keep-row") return r.fix.text["keep-row"](r.ref("shipments", c.row));
  if (c.kind === "reassign-invoice") {
    return r.fix.text["reassign-invoice"](r.ref("invoices", c.row), c.shipmentId);
  }
  const value = c.field === "quantity" ? String(c.value) : formatCents(c.value);
  return r.fix.text["fill-field"](r.ref(c.table, c.row), r.fields[c.field], value);
}

export const reportLabels: ReportLabels = {
  headers: r.export.headers,
  lineStatus: r.lineStatus,
  kinds: r.kinds,
  severity: r.severity,
  decisions: r.review.decisions,
  ref: r.ref,
  duplicate: r.duplicateMark,
  correction: correctionText,
  merged: r.fix.merged,
  yes: r.export.yes,
  no: r.export.no,
};

export const signed = (n: number) => (n > 0 ? `+${n}` : String(n));
export const signedYuan = (cents: number) => (cents > 0 ? "+" : "") + yuan(cents);

const fieldText = (f: FieldIssue) =>
  `${r.fields[f.field]}（${r.ref(f.ref.table, f.ref.row)}，${r.problems[f.problem]}）`;

export function noteParams({ exception: e }: AgentNote): ReconNoteParams {
  const d = e.diff ?? { quantity: 0, amountCents: 0 };
  return {
    shipment: e.shipmentId,
    invoices: e.invoiceIds.join("、"),
    refs: formatRefs(e.refs, reportLabels, e.duplicateRefs),
    fields: e.fields.map(fieldText).join("；"),
    qty: String(Math.abs(d.quantity)),
    amount: yuan(Math.abs(d.amountCents)),
    signedQty: signed(d.quantity),
    signedAmount: signedYuan(d.amountCents),
  };
}

export const noteText = (note: AgentNote) => r.agent.notes[note.suggestion](noteParams(note));
export const suggestionText = (note: AgentNote) => r.agent.suggestions[note.suggestion];

export const severityTone = { high: "danger", medium: "warn", low: "neutral" } as const;
export const decisionTone = { open: "warn", resolved: "ok", "follow-up": "warn" } as const;
export const statusTone = {
  matched: "ok",
  difference: "warn",
  "needs-review": "danger",
  incomplete: "danger",
  "not-invoiced": "warn",
  "unmatched-invoice": "danger",
} as const;
export const roleTone = { code: "brand", agent: "sim", human: "ok" } as const;
