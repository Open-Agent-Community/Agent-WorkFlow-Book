/**
 * The single audience model. Every audience-aware route, loader and check derives from here.
 * Human-readable labels live in the i18n dictionary, keyed by audience id.
 */
export const AUDIENCES = ["reader", "campus", "enterprise", "fde"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const FEATURES = [
  "paths",
  "cases",
  "labs",
  "syllabus",
  "teachingPack",
  "diagnosis",
] as const;
export type Feature = (typeof FEATURES)[number];

export interface AudienceMeta {
  readonly id: Audience;
  /** Display order in switchers and lists. */
  readonly order: number;
  /** Tailwind token name used for the audience accent. */
  readonly accent: "brand" | "ok" | "warn" | "sim";
  readonly features: readonly Feature[];
}

export const AUDIENCE_META: Readonly<Record<Audience, AudienceMeta>> = {
  reader: { id: "reader", order: 1, accent: "brand", features: ["paths", "cases", "labs"] },
  campus: {
    id: "campus",
    order: 2,
    accent: "ok",
    features: ["paths", "cases", "labs", "syllabus", "teachingPack"],
  },
  enterprise: {
    id: "enterprise",
    order: 3,
    accent: "warn",
    features: ["paths", "cases", "labs", "diagnosis"],
  },
  fde: { id: "fde", order: 4, accent: "sim", features: ["paths", "cases", "labs"] },
};

export function isAudience(value: unknown): value is Audience {
  return typeof value === "string" && (AUDIENCES as readonly string[]).includes(value);
}

export function hasFeature(audience: Audience, feature: Feature): boolean {
  return AUDIENCE_META[audience].features.includes(feature);
}

export function audiencesWithFeature(feature: Feature): Audience[] {
  return AUDIENCES.filter((a) => hasFeature(a, feature));
}
