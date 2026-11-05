import type { ReactNode } from "react";
import { audienceParams, requireAudience } from "@/lib/params";

export const dynamicParams = false;

export function generateStaticParams() {
  return audienceParams();
}

export default async function AudienceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ audience: string }>;
}) {
  await requireAudience(params);
  return children;
}
