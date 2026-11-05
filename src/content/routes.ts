import { AUDIENCES, hasFeature } from "@/lib/audiences";
import { routes } from "@/lib/routes";
import type { ContentBundle } from "./bundle";
import type { ContentStatus } from "./schema";

export interface RouteEntry {
  href: string;
  status: ContentStatus;
}

/** Every internal page the site serves, derived from content. Used by checks and the sitemap. */
export function buildRouteTable(bundle: ContentBundle): Map<string, RouteEntry> {
  const table = new Map<string, RouteEntry>();
  const add = (href: string, status: ContentStatus = "published") =>
    table.set(href, { href, status });

  [routes.home(), routes.book(), routes.resources(), routes.privacy(), routes.terms()].forEach(
    (href) => add(href),
  );
  add(routes.verify());
  for (const c of bundle.chapters) add(routes.chapter(c.id), c.status);
  for (const r of bundle.verify) add(routes.verifyToken(r.token));

  for (const a of AUDIENCES) {
    add(routes.audience(a));
    if (hasFeature(a, "paths")) {
      add(routes.paths(a));
      for (const p of bundle.paths) if (p.audience === a) add(routes.path(a, p.id), p.status);
    }
    if (hasFeature(a, "cases")) {
      add(routes.cases(a));
      for (const c of bundle.cases)
        if (c.audiences.includes(a)) add(routes.case(a, c.id), c.status);
    }
    if (hasFeature(a, "labs")) {
      for (const l of bundle.labs) if (l.audiences.includes(a)) add(routes.lab(a, l.id), l.status);
    }
    if (hasFeature(a, "syllabus")) add(routes.syllabus(a));
    if (hasFeature(a, "diagnosis")) add(routes.diagnosis(a));
  }
  return table;
}

/** Extract site-internal links (`/...`) from Markdown, without query or hash. */
export function extractInternalLinks(markdown: string): string[] {
  const links: string[] = [];
  const pattern = /\]\((\/[^)\s]*)(?:\s+"[^"]*")?\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const raw = match[1];
    if (!raw || raw.startsWith("//")) continue;
    const clean = raw.split(/[?#]/)[0] ?? raw;
    links.push(clean.length > 1 ? clean.replace(/\/$/, "") : clean);
  }
  return links;
}
