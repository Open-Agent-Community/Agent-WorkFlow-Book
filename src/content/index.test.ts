import { describe, expect, it } from "vitest";
import { AUDIENCES } from "@/lib/audiences";
import { routes } from "@/lib/routes";
import {
  buildRouteTable,
  getCase,
  getChapter,
  getLab,
  getPath,
  getVerifyRecord,
  listChapters,
  listParts,
  listPaths,
  loadBundle,
} from "./index";
import { extractInternalLinks } from "./routes";

describe("content loaders", () => {
  it("loads 13 chapters across 4 parts, in order", () => {
    const chapters = listChapters();
    expect(chapters).toHaveLength(13);
    expect(listParts()).toHaveLength(4);
    expect(chapters.map((c) => c.number)).toEqual(chapters.map((_, i) => i + 1));
  });

  it("parses Markdown bodies and frontmatter", () => {
    const ch = getChapter("ch01");
    expect(ch?.placeholder).toBe(true);
    expect(ch?.body).toContain("占位内容");
  });

  it("has at least one path per audience", () => {
    for (const a of AUDIENCES) expect(listPaths(a).length).toBeGreaterThan(0);
  });

  it("scopes cases, paths and labs to audiences", () => {
    expect(getCase("enterprise", "invoice-triage")).toBeDefined();
    expect(getCase("reader", "invoice-triage")).toBeUndefined();
    expect(getPath("campus", "first-workflow")).toBeUndefined();
    expect(getLab("enterprise", "quickstart")).toBeUndefined();
  });

  it("normalises verify tokens and keeps them demo-only", () => {
    expect(getVerifyRecord(" demo-2026-a1b2 ")?.state).toBe("valid");
    expect(loadBundle().verify.every((r) => r.token.startsWith("DEMO-"))).toBe(true);
  });

  it("builds a route table that includes feature-gated pages", () => {
    const table = buildRouteTable(loadBundle());
    expect(table.has(routes.syllabus("campus"))).toBe(true);
    expect(table.has(routes.syllabus("reader"))).toBe(false);
    expect(table.get(routes.chapter("ch13"))?.status).toBe("planned");
  });
});

describe("extractInternalLinks", () => {
  it("returns internal paths without hash, query or trailing slash", () => {
    const md = '[a](/book/) [b](/x/y#z) [c](https://e.org) [d](/q?x=1 "t") [e](//cdn)';
    expect(extractInternalLinks(md)).toEqual(["/book", "/x/y", "/q"]);
  });
});
