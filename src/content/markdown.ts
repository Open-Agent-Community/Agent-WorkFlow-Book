import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export class ContentError extends Error {
  constructor(
    readonly file: string,
    message: string,
  ) {
    super(`${file}: ${message}`);
    this.name = "ContentError";
  }
}

/** Read every `.md` file in a content folder and validate its frontmatter. */
export function readMarkdownDir<S extends z.ZodType>(
  folder: string,
  schema: S,
): Array<z.infer<S> & { body: string }> {
  const dir = path.join(CONTENT_ROOT, folder);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map((name) => {
    const file = `src/content/${folder}/${name}`;
    const raw = readFileSync(path.join(dir, name), "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"} ${i.message}`)
        .join("; ");
      throw new ContentError(file, `invalid frontmatter: ${detail}`);
    }
    const value = parsed.data as z.infer<S> & { id?: unknown };
    if (typeof value.id === "string" && `${value.id}.md` !== name) {
      throw new ContentError(file, `file name must match id "${value.id}"`);
    }
    return { ...value, body: content.trim() };
  });
}

/** Validate an array of structured records, reporting the source and index on failure. */
export function parseList<S extends z.ZodType>(
  source: string,
  schema: S,
  items: readonly unknown[],
): Array<z.infer<S>> {
  return items.map((item, index) => {
    const parsed = schema.safeParse(item);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"} ${i.message}`)
        .join("; ");
      throw new ContentError(`${source}[${index}]`, detail);
    }
    return parsed.data;
  });
}
