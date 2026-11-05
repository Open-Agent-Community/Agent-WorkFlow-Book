import { serializeJsonLd } from "@/lib/seo";

/**
 * The only use of dangerouslySetInnerHTML in the app (allowed for this file in eslint config).
 * Content is serialised by `serializeJsonLd`, which escapes `<`.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
