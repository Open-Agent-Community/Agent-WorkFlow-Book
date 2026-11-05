import type { ReactNode } from "react";
import { DemoBanner } from "@/components/ui";
import { t } from "@/i18n";

export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner>{t.verify.banner}</DemoBanner>
      {children}
    </>
  );
}
