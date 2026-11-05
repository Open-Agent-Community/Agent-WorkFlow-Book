import { describe, expect, it } from "vitest";
import type { ContentBundle } from "./bundle";
import { loadBundle } from "./bundle";
import { checkContent } from "./check";

const exists = () => true;
const fresh = (): ContentBundle => structuredClone(loadBundle());
const rules = (b: ContentBundle, publicFileExists = exists) =>
  checkContent(b, { publicFileExists }).map((i) => `${i.rule}: ${i.source}: ${i.message}`);

describe("checkContent", () => {
  it("passes on the seed content", () => {
    expect(rules(fresh())).toEqual([]);
  });

  it("flags duplicate ids", () => {
    const b = fresh();
    const first = b.cases[0];
    if (!first) throw new Error("fixture needs a case");
    b.cases.push({ ...first });
    expect(rules(b)).toContain(`unique: cases: duplicate id "${first.id}"`);
  });

  it("flags paths that reference missing chapters", () => {
    const b = fresh();
    b.paths[0]?.steps.push({ kind: "chapter", ref: "ch99", note: "missing" });
    expect(rules(b).some((r) => r.includes('unknown chapter "ch99"'))).toBe(true);
  });

  it("flags audiences without the needed feature", () => {
    const b = fresh();
    const path = b.paths[0];
    if (!path) throw new Error("fixture needs a path");
    path.steps.push({ kind: "lab", ref: "quickstart", note: "x" });
    path.audience = "enterprise";
    expect(rules(b).some((r) => r.includes('"quickstart" is not available to "enterprise"'))).toBe(
      true,
    );
  });

  it("flags broken internal links", () => {
    const b = fresh();
    const ch = b.chapters[0];
    if (!ch) throw new Error("fixture needs a chapter");
    ch.body += "\n\n[坏链接](/book/chapters/nope)";
    expect(rules(b)).toContain(
      `link: chapter ${ch.id}: broken internal link "/book/chapters/nope"`,
    );
  });

  it("flags published content that links to planned content", () => {
    const b = fresh();
    const ch = b.chapters.find((c) => c.status === "published");
    const planned = b.chapters.find((c) => c.status === "planned");
    if (!ch || !planned) throw new Error("fixture needs published and planned chapters");
    ch.body += `\n\n[x](/book/chapters/${planned.id})`;
    expect(rules(b).some((r) => r.startsWith(`planned: chapter ${ch.id}`))).toBe(true);
  });

  it("flags published paths with planned steps", () => {
    const b = fresh();
    const path = b.paths.find((p) => p.status === "published");
    path?.steps.push({ kind: "chapter", ref: "ch13", note: "planned" });
    expect(rules(b).some((r) => r.includes('links to planned chapter "ch13"'))).toBe(true);
  });

  it("flags missing resource files and planned downloads", () => {
    const b = fresh();
    const planned = b.resources.find((r) => r.status === "planned");
    if (planned) planned.file = "/resources/x.md";
    const out = rules(b, () => false);
    expect(out.some((r) => r.startsWith("resource:") && r.includes("missing file"))).toBe(true);
    expect(out.some((r) => r.includes("planned resources must not offer a file"))).toBe(true);
  });
});
