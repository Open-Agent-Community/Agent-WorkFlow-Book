import { t } from "@/i18n";
import { Badge } from "./Badge";

export function SimulationBadge() {
  return <Badge tone="sim">{t.labs.simulation}</Badge>;
}
