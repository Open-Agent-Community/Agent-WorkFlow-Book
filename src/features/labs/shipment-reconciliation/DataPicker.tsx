"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "../shared/fields";
import type { ImportError } from "./csv-import";
import { INVOICE_COLUMNS, MAX_CHARS, MAX_ROWS, SHIPMENT_COLUMNS } from "./csv-import";

const d = t.labs.recon.data;
export const SOURCES = ["basic", "advanced", "custom"] as const;
export type Source = (typeof SOURCES)[number];

const option =
  "flex cursor-pointer items-start gap-2 rounded-lg border border-line px-3 py-2 text-sm " +
  "has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:border-line-dark " +
  "dark:has-[:checked]:bg-brand-700/30";

export function errorText(e: ImportError): string {
  if (e.code === "missing-columns") {
    return d.errors["missing-columns"](
      e.columns.map((c) => d.columns[c as keyof typeof d.columns]).join("、"),
    );
  }
  return d.errors[e.code];
}

export interface PickerProps {
  /** Source of the data the workflow is running on. */
  active: Source;
  /** Source selected in the picker (custom is not active until loaded). */
  choice: Source;
  shipmentsText: string;
  invoicesText: string;
  errors: string[];
  loadedNote: string;
  onChoose: (s: Source) => void;
  onText: (table: "shipments" | "invoices", text: string) => void;
  onTemplate: () => void;
  onLoad: () => void;
}

export function DataPicker(p: PickerProps) {
  const cols = (c: readonly string[]) =>
    c.map((x) => d.columns[x as keyof typeof d.columns]).join("、");
  return (
    <div className="space-y-3 rounded-lg border border-line p-3 dark:border-line-dark">
      <fieldset>
        <legend className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium">
          {d.legend}
          <Badge tone="brand">{d.current(d.sources[p.active].split("：")[0] ?? "")}</Badge>
        </legend>
        <div className="grid gap-2 md:grid-cols-3">
          {SOURCES.map((s) => (
            <label key={s} className={option}>
              <input
                type="radio"
                name="recon-source"
                className="mt-1"
                checked={p.choice === s}
                onChange={() => p.onChoose(s)}
              />
              {d.sources[s]}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-xs text-ink-muted dark:text-ink-dark-muted">{d.switchNote}</p>

      {p.choice === "custom" ? (
        <div className="space-y-3">
          <p
            className={cn(
              "rounded-lg border border-warn/50 px-3 py-2 text-sm text-warn",
              "dark:text-amber-300",
            )}
          >
            {d.privacy}
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {(["shipments", "invoices"] as const).map((table) => (
              <div key={table}>
                <label htmlFor={`recon-csv-${table}`} className={labelClass}>
                  {table === "shipments" ? d.shipmentsLabel : d.invoicesLabel}
                </label>
                <textarea
                  id={`recon-csv-${table}`}
                  rows={8}
                  spellCheck={false}
                  maxLength={MAX_CHARS}
                  aria-describedby={`recon-csv-${table}-hint`}
                  value={table === "shipments" ? p.shipmentsText : p.invoicesText}
                  onChange={(e) => p.onText(table, e.target.value)}
                  className={cn(inputClass, "font-mono text-xs")}
                />
                <p
                  id={`recon-csv-${table}-hint`}
                  className="mt-1 text-xs text-ink-muted dark:text-ink-dark-muted"
                >
                  {d.columnsHint(cols(table === "shipments" ? SHIPMENT_COLUMNS : INVOICE_COLUMNS))}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-dark-muted">
            {d.limits(MAX_ROWS, MAX_CHARS)}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={p.onLoad}>{d.load}</Button>
            <Button variant="secondary" onClick={p.onTemplate}>
              {d.loadTemplate}
            </Button>
          </div>
        </div>
      ) : null}

      <div aria-live="polite" className="text-sm">
        {p.errors.length > 0 ? (
          <ul className="space-y-1">
            {p.errors.map((e) => (
              <li key={e} className="flex items-start gap-2">
                <Badge tone="danger" className="shrink-0">
                  {t.labs.severity.error}
                </Badge>
                {e}
              </li>
            ))}
          </ul>
        ) : (
          p.loadedNote && <p className="text-ok dark:text-green-300">{p.loadedNote}</p>
        )}
      </div>
    </div>
  );
}
