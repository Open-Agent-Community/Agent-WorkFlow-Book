import type { Audience } from "./audiences";

/** Single source of internal hrefs. Pages, sitemap and content checks all use these. */
export const routes = {
  home: () => "/",
  book: () => "/book",
  chapter: (id: string) => `/book/chapters/${id}`,
  audience: (a: Audience) => `/${a}`,
  paths: (a: Audience) => `/${a}/paths`,
  path: (a: Audience, id: string) => `/${a}/paths/${id}`,
  cases: (a: Audience) => `/${a}/cases`,
  case: (a: Audience, id: string) => `/${a}/cases/${id}`,
  lab: (a: Audience, id: string) => `/${a}/labs/${id}`,
  syllabus: (a: Audience) => `/${a}/syllabus`,
  diagnosis: (a: Audience) => `/${a}/diagnosis`,
  resources: () => "/resources",
  privacy: () => "/privacy",
  terms: () => "/terms",
  verify: () => "/verify",
  verifyToken: (token: string) => `/verify/${token}`,
} as const;
