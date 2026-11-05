import { describe, expect, it } from "vitest";
import {
  AUDIENCE_META,
  AUDIENCES,
  audiencesWithFeature,
  hasFeature,
  isAudience,
} from "./audiences";

describe("audience model", () => {
  it("has metadata for every audience", () => {
    for (const a of AUDIENCES) expect(AUDIENCE_META[a].id).toBe(a);
  });

  it("recognises valid audiences only", () => {
    expect(isAudience("campus")).toBe(true);
    expect(isAudience("admin")).toBe(false);
    expect(isAudience(undefined)).toBe(false);
  });

  it("gates audience-specific features", () => {
    expect(hasFeature("campus", "syllabus")).toBe(true);
    expect(hasFeature("reader", "syllabus")).toBe(false);
    expect(audiencesWithFeature("diagnosis")).toEqual(["enterprise"]);
  });
});
