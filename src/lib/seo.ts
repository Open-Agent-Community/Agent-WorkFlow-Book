import type { Metadata } from "next";
import { BOOK } from "@/content/book";
import { SITE } from "@/content/site";

export const SITE_URL = "https://agentflow.moyingsmart.cn";

/** Keep canonical and share metadata consistent; never inherit the homepage URL. */
export function pageSeo(path: string, metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string"
    ? metadata.title.replace(/[｜|]\s*智能体工作流设计$/, "") : SITE.name;
  const description = typeof metadata.description === "string" ? metadata.description : SITE.description;
  const url = new URL(path, SITE_URL).href;
  const images = [{ url: new URL(BOOK.cover.src, SITE_URL).href, width: BOOK.cover.width, height: BOOK.cover.height, alt: BOOK.title }];
  return {
    ...metadata,
    title,
    alternates: { ...metadata.alternates, canonical: url },
    openGraph: { type: "website", locale: "zh_CN", siteName: SITE.name, title, description, url, images },
    twitter: { card: "summary_large_image", title, description, images: images.map(image => image.url) },
  };
}
