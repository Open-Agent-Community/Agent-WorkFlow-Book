"use client";

import { useState } from "react";
import { t } from "@/i18n";
import { DataPicker, errorText } from "./DataPicker";
import type { Source } from "./DataPicker";
import { invoicesToCsv, readInvoices, readShipments, shipmentsToCsv } from "./csv-import";
import {
  ADVANCED_INVOICES,
  ADVANCED_SHIPMENTS,
  SAMPLE_INVOICES,
  SAMPLE_SHIPMENTS,
} from "./sample-data";
import type { Dataset } from "./Workflow";
import { Workflow } from "./Workflow";

const d = t.labs.recon.data;
const BUILT_IN: Record<Exclude<Source, "custom">, Dataset> = {
  basic: { shipments: SAMPLE_SHIPMENTS, invoices: SAMPLE_INVOICES },
  advanced: { shipments: ADVANCED_SHIPMENTS, invoices: ADVANCED_INVOICES },
};
const SHIPMENT_HEADERS = ["shipmentId", "customer", "sku", "quantity", "amount"] as const;
const INVOICE_HEADERS = ["invoiceId", "shipmentId", "quantity", "amount"] as const;

/** Holds the chosen dataset; the workflow below is remounted whenever the data changes. */
export function ShipmentReconciliationLab() {
  const [active, setActive] = useState<{ source: Source; data: Dataset; run: number }>({
    source: "basic",
    data: BUILT_IN.basic,
    run: 0,
  });
  const [choice, setChoice] = useState<Source>("basic");
  const [texts, setTexts] = useState({ shipments: "", invoices: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [loadedNote, setLoadedNote] = useState("");

  const use = (source: Source, data: Dataset) =>
    setActive((prev) => ({ source, data, run: prev.run + 1 }));
  const template = () =>
    setTexts({
      shipments: shipmentsToCsv(
        active.data.shipments,
        SHIPMENT_HEADERS.map((c) => d.columns[c]),
      ),
      invoices: invoicesToCsv(
        active.data.invoices,
        INVOICE_HEADERS.map((c) => d.columns[c]),
      ),
    });

  const picker = (
    <DataPicker
      active={active.source}
      choice={choice}
      shipmentsText={texts.shipments}
      invoicesText={texts.invoices}
      errors={errors}
      loadedNote={loadedNote}
      onChoose={(s) => {
        setChoice(s);
        setErrors([]);
        setLoadedNote("");
        if (s === "custom") {
          if (!texts.shipments && !texts.invoices) template();
        } else if (s !== active.source) use(s, BUILT_IN[s]);
      }}
      onText={(table, text) => setTexts((prev) => ({ ...prev, [table]: text }))}
      onTemplate={template}
      onLoad={() => {
        const s = readShipments(texts.shipments);
        const i = readInvoices(texts.invoices);
        const problems = [
          ...(s.ok ? [] : [d.errorIn(d.shipmentsLabel, errorText(s.error))]),
          ...(i.ok ? [] : [d.errorIn(d.invoicesLabel, errorText(i.error))]),
        ];
        setErrors(problems);
        if (!s.ok || !i.ok) return setLoadedNote("");
        setLoadedNote(d.loaded(s.rows.length, i.rows.length));
        use("custom", { shipments: s.rows, invoices: i.rows });
      }}
    />
  );

  return <Workflow key={active.run} data={active.data} picker={picker} />;
}
