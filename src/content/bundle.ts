import { parts as rawParts } from "./book";
import { diagnosis as rawDiagnosis } from "./diagnosis";
import { labs as rawLabs } from "./labs";
import { parseList, readMarkdownDir } from "./markdown";
import { paths as rawPaths } from "./paths";
import { resources as rawResources } from "./resources";
import {
  CaseFrontmatterSchema,
  ChapterFrontmatterSchema,
  DiagnosisDimensionSchema,
  LabSchema,
  PartSchema,
  PathSchema,
  ResourceSchema,
  SyllabusWeekSchema,
  VerifyRecordSchema,
} from "./schema";
import type {
  Case,
  Chapter,
  DiagnosisDimension,
  Lab,
  LearningPath,
  Part,
  Resource,
  SyllabusWeek,
  VerifyRecord,
} from "./schema";
import { syllabus as rawSyllabus } from "./syllabus";
import { verifyRecords as rawVerify } from "./verify";

export interface ContentBundle {
  parts: Part[];
  chapters: Chapter[];
  cases: Case[];
  paths: LearningPath[];
  labs: Lab[];
  resources: Resource[];
  verify: VerifyRecord[];
  syllabus: SyllabusWeek[];
  diagnosis: DiagnosisDimension[];
}

let cached: ContentBundle | undefined;

/** Load and schema-validate all content. Throws `ContentError` on the first invalid entry. */
export function loadBundle(): ContentBundle {
  if (cached) return cached;
  cached = {
    parts: parseList("book.ts", PartSchema, rawParts),
    chapters: readMarkdownDir("chapters", ChapterFrontmatterSchema).sort(
      (a, b) => a.number - b.number,
    ),
    cases: readMarkdownDir("cases", CaseFrontmatterSchema),
    paths: parseList("paths.ts", PathSchema, rawPaths),
    labs: parseList("labs.ts", LabSchema, rawLabs),
    resources: parseList("resources.ts", ResourceSchema, rawResources),
    verify: parseList("verify.ts", VerifyRecordSchema, rawVerify),
    syllabus: parseList("syllabus.ts", SyllabusWeekSchema, rawSyllabus),
    diagnosis: parseList("diagnosis.ts", DiagnosisDimensionSchema, rawDiagnosis),
  };
  return cached;
}
