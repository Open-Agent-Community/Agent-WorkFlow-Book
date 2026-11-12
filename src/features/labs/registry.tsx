import type { ComponentType } from "react";
import type { Lab } from "@/content/schema";
import { FlowBuilderLab } from "./flow-builder/FlowBuilderLab";
import { PromptStructureLab } from "./prompt-structure/PromptStructureLab";
import { QuickstartLab } from "./quickstart/QuickstartLab";
import { ShipmentReconciliationLab } from "./shipment-reconciliation/ShipmentReconciliationLab";

/** Maps each lab kind from content to its client component. */
const LABS: Record<Lab["kind"], ComponentType> = {
  "flow-builder": FlowBuilderLab,
  "prompt-structure": PromptStructureLab,
  quickstart: QuickstartLab,
  "shipment-reconciliation": ShipmentReconciliationLab,
};

export function LabView({ kind }: { kind: Lab["kind"] }) {
  const Component = LABS[kind];
  return <Component />;
}
