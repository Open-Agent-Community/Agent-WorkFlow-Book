import { describe, expect, it } from "vitest";
import { indexableHrefs, loadBundle } from "@/content";
import { breadcrumbJsonLd, buildMetadata, serializeJsonLd } from "./seo";

describe("seo helpers", () => {
  it("escapes < in JSON-LD", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({ name: "</script><script>alert(1)</script>" });
  });

  it("marks planned and explicit noindex pages as noindex", () => {
    expect(buildMetadata({ path: "/x", status: "planned" }).robots).toEqual({
      index: false,
      follow: true,
    });
    expect(buildMetadata({ path: "/x", noindex: true }).robots).toMatchObject({ index: false });
    expect(buildMetadata({ path: "/x", status: "preview" }).robots).toMatchObject({ index: true });
  });

  it("builds canonical URLs and breadcrumb positions", () => {
    expect(buildMetadata({ path: "/book" }).alternates?.canonical).toBe(
      "http://localhost:3000/book",
    );
    const ld = breadcrumbJsonLd([
      { name: "a", href: "/" },
      { name: "b", href: "/book" },
    ]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
});

describe("sitemap", () => {
  it("is generated from content and excludes planned and demo pages", () => {
    const entries = indexableHrefs(loadBundle());
    expect(entries).toContain("/book/chapters/ch01");
    expect(entries).toContain("/campus/syllabus");
    expect(entries).not.toContain("/book/chapters/ch13");
    expect(entries).not.toContain("/fde/paths/production-operations");
    expect(entries.some((e) => e.startsWith("/verify"))).toBe(false);
  });
});
