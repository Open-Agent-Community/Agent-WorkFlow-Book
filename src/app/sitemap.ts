import type { MetadataRoute } from "next";
import { indexableHrefs, loadBundle } from "@/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableHrefs(loadBundle()).map((href) => ({ url: absoluteUrl(href) }));
}
