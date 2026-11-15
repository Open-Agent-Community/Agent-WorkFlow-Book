"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "../shared/fields";
import type { Correction, CorrectionOption, RunChange } from "./corrections";
import { parseValue } from "./corrections";
import { correctionText, roleTone, statusTone } from "./present";
import { formatCents } from "./report";
import type { ReconException } from "./types";

const r = t.labs.recon;
const f = r.fix;
const choice =
  "flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm " +
  "has-[:checked]:border-brand-500 dark:border-line-dark";

/** Before → after status of the line an exception belongs to, as recomputed by code. */
export function Recheck({ change }: { change: RunChange }) {
  const status = (s: RunChange["before"], missing: string) =>
    s ? <Badge tone={statusTone[s]}>{r.lineStatus[s]}</Badge> : <Badge>{missing}</Badge>;
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm">
      <Badge tone={roleTone.code}>{r.roles.code.label}</Badge>
      <span>{f.recheck}：</span>
      <span className="font-mono">{change.shipmentId || "—"}</span>
      {status(change.before, f.added)}
      <span aria-hidden="true">→</span>
      {status(change.after, f.merged)}
    </p>
  );
}

export function CorrectionEditor({
  exception,
  option,
  correction,
  change,
  onChange,
}: {
  exception: ReconException;
  option: CorrectionOption | null;
  correction: Correction | undefined;
  change: RunChange | undefined;
  onChange: (c: Correction | null) => void;
}) {
  const initial =
    correction?.kind === "fill-field"
      ? correction.field === "quantity"
        ? String(correction.value)
        : formatCents(correction.value)
      : "";
  const [draft, setDraft] = useState(initial);
  const [invalid, setInvalid] = useState(false);
  const name = `fix-${exception.id}`;

  return (
    <div className="mt-4 border-t border-line pt-4 dark:border-line-dark">
      <p className="text-sm font-medium">{f.heading}</p>
      <p className="mt-1 mb-3 text-xs text-ink-muted dark:text-ink-dark-muted">
        {option ? f.hint : f.none}
      </p>

      {option?.kind === "keep-row" ? (
        <div role="radiogroup" aria-label={f.heading} className="flex flex-wrap gap-2">
          <label className={choice}>
            <input type="radio" name={name} checked={!correction} onChange={() => onChange(null)} />
            {f.noChange}
          </label>
          {option.rows.map((row) => (
            <label key={row} className={choice}>
              <input
                type="radio"
                name={name}
                checked={correction?.kind === "keep-row" && correction.row === row}
                onChange={() => onChange({ kind: "keep-row", row })}
              />
              {f.keepRow(r.ref("shipments", row))}
            </label>
          ))}
        </div>
      ) : null}

      {option?.kind === "fill-field" ? (
        <div>
          <label htmlFor={name} className={labelClass}>
            {f.fillLabel(r.fields[option.field], r.ref(option.table, option.row))}
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id={name}
              type="text"
              inputMode="decimal"
              value={draft}
              aria-invalid={invalid}
              aria-describedby={`${name}-hint`}
              onChange={(e) => {
                setDraft(e.target.value);
                setInvalid(false);
              }}
              className={cn(inputClass, "max-w-40")}
            />
            <Button
              variant="secondary"
              onClick={() => {
                const value = parseValue(option.field, draft);
                setInvalid(value === null);
                if (value !== null) onChange({ ...option, value });
              }}
            >
              {f.apply}
            </Button>
            <Button
              variant="ghost"
              disabled={!correction}
              onClick={() => {
                setDraft("");
                setInvalid(false);
                onChange(null);
              }}
            >
              {f.clear}
            </Button>
          </div>
          <p id={`${name}-hint`} className="mt-1 text-xs text-ink-muted dark:text-ink-dark-muted">
            {invalid ? f.invalid : ""}
            {f.fillHint[option.field]}
          </p>
        </div>
      ) : null}

      {option?.kind === "reassign-invoice" ? (
        <div>
          <label htmlFor={name} className={labelClass}>
            {f.reassignLabel(exception.invoiceIds.join("、"))}
          </label>
          <select
            id={name}
            value={correction?.kind === "reassign-invoice" ? correction.shipmentId : ""}
            onChange={(e) => {
              const shipmentId = option.shipmentIds.find((id) => id === e.target.value);
              onChange(
                shipmentId ? { kind: "reassign-invoice", row: option.row, shipmentId } : null,
              );
            }}
            className={cn(inputClass, "max-w-56")}
          >
            <option value="">{f.noChange}</option>
            {option.shipmentIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {correction ? (
        <div className="mt-3 space-y-2" aria-live="polite">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <Badge tone="ok">{f.applied}</Badge>
            {correctionText(correction)}
          </p>
          {change ? <Recheck change={change} /> : null}
        </div>
      ) : null}
    </div>
  );
}
