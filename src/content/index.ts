/**
 * Typed content API. Pages and components import content only from this module.
 */
import type { Audience } from "@/lib/audiences";
import { loadBundle } from "./bundle";
import type {
  Case,
  Chapter,
  Lab,
  LearningPath,
  Part,
  Resource,
  StaticPage,
  VerifyRecord,
} from "./schema";

export type * from "./schema";
export { buildRouteTable } from "./routes";
export { loadBundle } from "./bundle";

export const listParts = (): Part[] => loadBundle().parts;
export const listChapters = (): Chapter[] => loadBundle().chapters;
export const getChapter = (id: string): Chapter | undefined =>
  loadBundle().chapters.find((c) => c.id === id);
export const listChaptersInPart = (partId: string): Chapter[] =>
  listChapters().filter((c) => c.part === partId);

export const listPaths = (audience: Audience): LearningPath[] =>
  loadBundle().paths.filter((p) => p.audience === audience);
export const getPath = (audience: Audience, id: string): LearningPath | undefined =>
  listPaths(audience).find((p) => p.id === id);

export const listCases = (audience?: Audience): Case[] =>
  loadBundle().cases.filter((c) => !audience || c.audiences.includes(audience));
export const getCase = (audience: Audience, id: string): Case | undefined =>
  listCases(audience).find((c) => c.id === id);

export const listLabs = (audience?: Audience): Lab[] =>
  loadBundle().labs.filter((l) => !audience || l.audiences.includes(audience));
export const getLab = (audience: Audience, id: string): Lab | undefined =>
  listLabs(audience).find((l) => l.id === id);

export const listResources = (audience?: Audience): Resource[] =>
  loadBundle().resources.filter((r) => !audience || r.audiences.includes(audience));

export const listVerifyRecords = (): VerifyRecord[] => loadBundle().verify;
export const getVerifyRecord = (token: string): VerifyRecord | undefined =>
  loadBundle().verify.find((r) => r.token === token.trim().toUpperCase());

export const getPage = (id: string): StaticPage | undefined =>
  loadBundle().pages.find((p) => p.id === id);

export const getSyllabus = () => loadBundle().syllabus;
export const getDiagnosis = () => loadBundle().diagnosis;

/** Resolve a path step to its title and status. */
export function resolveStep(kind: "chapter" | "case" | "lab", ref: string) {
  const b = loadBundle();
  const list: Array<{ id: string; title: string; status: Chapter["status"] }> =
    kind === "chapter" ? b.chapters : kind === "case" ? b.cases : b.labs;
  return list.find((item) => item.id === ref);
}
