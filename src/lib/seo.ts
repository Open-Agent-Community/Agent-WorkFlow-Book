import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { ContentStatus } from "@/content/schema";
import { t } from "@/i18n";

export interface MetadataInput {
  title?: string;
  description?: string;
  /** Site-relative path, e.g. `/book`. */
  path: string;
  status?: ContentStatus;
  /** Force noindex (e.g. lookup results). */
  noindex?: boolean;
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

/** Central metadata builder: canonical URL, Open Graph, and noindex for planned content. */
export function buildMetadata(input: MetadataInput): Metadata {
  const title = input.title ? `${input.title} · ${siteConfig.name}` : siteConfig.name;
  const description = input.description ?? t.site.description;
  const url = absoluteUrl(input.path);
  const noindex = input.noindex || input.status === "planned";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: siteConfig.name,
      title,
      description,
      url,
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
