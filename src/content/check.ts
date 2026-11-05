import { hasFeature } from "@/lib/audiences";
import type { Audience, Feature } from "@/lib/audiences";
import { routes } from "@/lib/routes";
import type { ContentBundle } from "./bundle";
import { buildRouteTable, extractInternalLinks } from "./routes";
import type { ContentStatus, PathStep } from "./schema";

export interface ContentIssue {
  rule: "unique" | "reference" | "audience" | "link" | "planned" | "resource";
  source: string;
  message: string;
}

export interface CheckOptions {
  /** Whether a site-relative file exists under `public/`. */
  publicFileExists: (sitePath: string) => boolean;
}

/** Pure cross-reference checks over a schema-valid content bundle. */
export function checkContent(bundle: ContentBundle, options: CheckOptions): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const report = (rule: ContentIssue["rule"], source: string, message: string) =>
    issues.push({ rule, source, message });

  const unique = (kind: string, ids: readonly (string | number)[]) => {
    const seen = new Set<string | number>();
    for (const id of ids) {
      if (seen.has(id)) report("unique", kind, `duplicate id "${id}"`);
      seen.add(id);
    }
  };
  unique(
    "parts",
    bundle.parts.map((p) => p.id),
  );
  unique(
    "chapters",
    bundle.chapters.map((c) => c.id),
  );
  unique(
    "chapter numbers",
    bundle.chapters.map((c) => c.number),
  );
  unique(
    "cases",
    bundle.cases.map((c) => c.id),
  );
  unique(
    "paths",
    bundle.paths.map((p) => p.id),
  );
  unique(
    "labs",
    bundle.labs.map((l) => l.id),
  );
  unique(
    "resources",
    bundle.resources.map((r) => r.id),
  );
  unique(
    "verify",
    bundle.verify.map((r) => r.token),
  );
  unique(
    "syllabus weeks",
    bundle.syllabus.map((w) => w.week),
  );
  unique(
    "diagnosis",
    bundle.diagnosis.map((d) => d.id),
  );

  const status = {
    chapter: new Map(bundle.chapters.map((c) => [c.id, c.status])),
    case: new Map(bundle.cases.map((c) => [c.id, c.status])),
    lab: new Map(bundle.labs.map((l) => [l.id, l.status])),
  };
  const partIds = new Set(bundle.parts.map((p) => p.id));

  /** Check that `ref` exists, and that a published source does not point at planned content. */
  const ref = (
    kind: keyof typeof status,
    id: string,
    source: string,
    sourceStatus: ContentStatus,
  ) => {
    const target = status[kind].get(id);
    if (!target) return report("reference", source, `unknown ${kind} "${id}"`);
    if (sourceStatus === "published" && target === "planned") {
      report("planned", source, `published content links to planned ${kind} "${id}"`);
    }
  };

  const feature = (source: string, audiences: readonly Audience[], f: Feature) => {
    for (const a of audiences) {
      if (!hasFeature(a, f)) report("audience", source, `audience "${a}" has no "${f}" feature`);
    }
  };

  for (const c of bundle.chapters) {
    if (!partIds.has(c.part)) report("reference", `chapter ${c.id}`, `unknown part "${c.part}"`);
  }
  for (const c of bundle.cases) {
    feature(`case ${c.id}`, c.audiences, "cases");
    c.chapters.forEach((id) => ref("chapter", id, `case ${c.id}`, c.status));
  }
  for (const l of bundle.labs) {
    feature(`lab ${l.id}`, l.audiences, "labs");
    l.chapters.forEach((id) => ref("chapter", id, `lab ${l.id}`, l.status));
  }
  for (const p of bundle.paths) {
    const source = `path ${p.id}`;
    feature(source, [p.audience], "paths");
    p.steps.forEach((step) => checkStep(step, p.audience, source, p.status));
  }
  for (const w of bundle.syllabus) {
    const source = `syllabus week ${w.week}`;
    w.chapters.forEach((id) => ref("chapter", id, source, "published"));
    if (w.lab) ref("lab", w.lab, source, "published");
  }
  for (const d of bundle.diagnosis) {
    d.chapters.forEach((id) => ref("chapter", id, `diagnosis ${d.id}`, "published"));
  }

  function checkStep(step: PathStep, a: Audience, source: string, s: ContentStatus) {
    ref(step.kind, step.ref, source, s);
    const audienceOf =
      step.kind === "case"
        ? bundle.cases.find((c) => c.id === step.ref)?.audiences
        : step.kind === "lab"
          ? bundle.labs.find((l) => l.id === step.ref)?.audiences
          : undefined;
    if (audienceOf && !audienceOf.includes(a)) {
      report("audience", source, `${step.kind} "${step.ref}" is not available to "${a}"`);
    }
  }

  const table = buildRouteTable(bundle);
  const bodies = [
    ...bundle.chapters.map((c) => ({ source: `chapter ${c.id}`, status: c.status, body: c.body })),
    ...bundle.cases.map((c) => ({ source: `case ${c.id}`, status: c.status, body: c.body })),
  ];
  for (const { source, status: s, body } of bodies) {
    for (const href of extractInternalLinks(body)) {
      const target = table.get(href);
      if (!target) report("link", source, `broken internal link "${href}"`);
      else if (s === "published" && target.status === "planned") {
        report("planned", source, `published content links to planned page "${href}"`);
      }
    }
  }

  for (const r of bundle.resources) {
    const source = `resource ${r.id}`;
    if (r.status === "planned" && r.file) {
      report("planned", source, "planned resources must not offer a file");
    } else if (r.status !== "planned" && !r.file) {
      report("resource", source, "non-planned resources need a file");
    } else if (r.file && !options.publicFileExists(r.file)) {
      report("resource", source, `missing file public${r.file}`);
    }
  }

  if (!table.has(routes.home())) report("link", "routes", "home route missing");
  return issues;
}
