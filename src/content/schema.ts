import { z } from "zod";
import { AUDIENCES } from "@/lib/audiences";

export const CONTENT_STATUSES = ["published", "preview", "planned"] as const;
export const ContentStatusSchema = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

export const AudienceSchema = z.enum(AUDIENCES);

/** Lowercase kebab-case identifier used in URLs. */
export const IdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case");
const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");
const Text = z.string().trim().min(1);

export const PartSchema = z.object({
  id: IdSchema,
  number: z.number().int().positive(),
  title: Text,
  summary: Text,
});
export type Part = z.infer<typeof PartSchema>;

export const ChapterFrontmatterSchema = z.object({
  id: IdSchema,
  number: z.number().int().positive(),
  part: IdSchema,
  title: Text,
  summary: Text,
  status: ContentStatusSchema,
  placeholder: z.boolean(),
  keyPoints: z.array(Text).default([]),
});
export type Chapter = z.infer<typeof ChapterFrontmatterSchema> & { body: string };

export const CaseFrontmatterSchema = z.object({
  id: IdSchema,
  title: Text,
  summary: Text,
  industry: Text,
  audiences: z.array(AudienceSchema).min(1),
  chapters: z.array(IdSchema).default([]),
  status: ContentStatusSchema,
  placeholder: z.boolean(),
});
export type Case = z.infer<typeof CaseFrontmatterSchema> & { body: string };

export const PathStepSchema = z.object({
  kind: z.enum(["chapter", "case", "lab"]),
  ref: IdSchema,
  note: Text,
});
export type PathStep = z.infer<typeof PathStepSchema>;

export const PathSchema = z.object({
  id: IdSchema,
  audience: AudienceSchema,
  title: Text,
  summary: Text,
  estimatedHours: z.number().positive(),
  status: ContentStatusSchema,
  steps: z.array(PathStepSchema).min(1),
});
export type LearningPath = z.infer<typeof PathSchema>;

export const LAB_KINDS = ["flow-builder", "prompt-structure", "quickstart"] as const;
export const LabSchema = z.object({
  id: IdSchema,
  kind: z.enum(LAB_KINDS),
  title: Text,
  summary: Text,
  audiences: z.array(AudienceSchema).min(1),
  chapters: z.array(IdSchema).default([]),
  status: ContentStatusSchema,
});
export type Lab = z.infer<typeof LabSchema>;

export const ResourceSchema = z.object({
  id: IdSchema,
  title: Text,
  description: Text,
  format: z.enum(["markdown", "text", "svg"]),
  audiences: z.array(AudienceSchema).min(1),
  status: ContentStatusSchema,
  /** Site-relative path to a file under `public/`. Required unless planned. */
  file: z
    .string()
    .regex(/^\/resources\/[a-z0-9-]+\.(md|txt|svg)$/)
    .optional(),
});
export type Resource = z.infer<typeof ResourceSchema>;

export const VerifyRecordSchema = z.object({
  token: z.string().regex(/^DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/, "demo tokens must start with DEMO-"),
  holder: Text,
  programme: Text,
  issuedOn: DateSchema,
  state: z.enum(["valid", "revoked"]),
});
export type VerifyRecord = z.infer<typeof VerifyRecordSchema>;

export const SyllabusWeekSchema = z.object({
  week: z.number().int().positive(),
  topic: Text,
  chapters: z.array(IdSchema).min(1),
  lab: IdSchema.optional(),
  activity: Text,
});
export type SyllabusWeek = z.infer<typeof SyllabusWeekSchema>;

export const DiagnosisDimensionSchema = z.object({
  id: IdSchema,
  title: Text,
  questions: z.array(Text).min(1),
  chapters: z.array(IdSchema).default([]),
});
export type DiagnosisDimension = z.infer<typeof DiagnosisDimensionSchema>;
