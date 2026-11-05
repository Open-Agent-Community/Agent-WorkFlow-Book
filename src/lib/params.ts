import { notFound } from "next/navigation";
import type { Audience, Feature } from "./audiences";
import { AUDIENCES, audiencesWithFeature, hasFeature, isAudience } from "./audiences";

export type AudienceParams = Promise<{ audience: string }>;

/** Resolve the `[audience]` segment, or 404 if it is unknown or lacks the feature. */
export async function requireAudience(
  params: Promise<{ audience: string }>,
  feature?: Feature,
): Promise<Audience> {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();
  if (feature && !hasFeature(audience, feature)) notFound();
  return audience;
}

/** Static params for audience pages, optionally limited to audiences with a feature. */
export function audienceParams(feature?: Feature): Array<{ audience: Audience }> {
  return (feature ? audiencesWithFeature(feature) : [...AUDIENCES]).map((audience) => ({
    audience,
  }));
}
