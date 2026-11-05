import { SITE_URL } from "@/lib/seo";

type Crumb = { name: string; href: string };
/** Describe the same hierarchy as the page's existing return/navigation links. */
export function SeoBreadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "首页", href: "/" }, ...items].map((item, index) => {
      const url = new URL(item.href, SITE_URL);
      url.search = "";
      url.hash = "";
      return { "@type": "ListItem", position: index + 1, name: item.name, item: url.href };
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
