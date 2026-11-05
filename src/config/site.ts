/**
 * Site-wide configuration. Values come from environment variables (see `.env.example`).
 * Only NEXT_PUBLIC_* values are read so they are safe to expose in the browser.
 */
function readUrl(value: string | undefined, fallback: string): string {
  const raw = value?.trim() || fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "AgentFlow Learn",
  url: readUrl(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@example.org",
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL?.trim() || "",
  locale: "zh-CN",
} as const;

export type SiteConfig = typeof siteConfig;
