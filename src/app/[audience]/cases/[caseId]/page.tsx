import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, PageHero, Prose, StatusBadge, StatusNote } from "@/components/ui";
import { getCase, getChapter, loadBundle } from "@/content";
import { t } from "@/i18n";
import { hasFeature } from "@/lib/audiences";
import { requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ audience: string; caseId: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return loadBundle().cases.flatMap((c) =>
    c.audiences.filter((a) => hasFeature(a, "cases")).map((a) => ({ audience: a, caseId: c.id })),
  );
}

async function load(params: Params) {
  const a = await requireAudience(params, "cases");
  const item = getCase(a, (await params).caseId);
  if (!item) notFound();
  return { a, item };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { a, item } = await load(params);
  return buildMetadata({
    title: item.title,
    description: item.summary,
    path: routes.case(a, item.id),
    status: item.status,
  });
}

export default async function CasePage({ params }: { params: Params }) {
  const { a, item } = await load(params);
  const chapters = item.chapters.map(getChapter).filter((c) => c !== undefined);
  return (
    <>
      <PageHero
        title={item.title}
        eyebrow={`${t.audiences[a].label} · ${t.cases.title}`}
        lead={item.summary}
        meta={
          <>
            <StatusBadge status={item.status} />
            <span className="text-sm">
              {t.cases.industry}：{item.industry}
            </span>
          </>
        }
      >
        <StatusNote status={item.status} />
      </PageHero>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.cases.title, href: routes.cases(a) },
            { name: item.title, href: routes.case(a, item.id) },
          ]}
        />
        <article className="mt-6">
          <Prose markdown={item.body} />
        </article>
        {chapters.length > 0 ? (
          <section aria-labelledby="chapters-heading" className="mt-10">
            <h2 id="chapters-heading" className="mb-3 text-lg font-semibold">
              {t.cases.relatedChapters}
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              {chapters.map((c) => (
                <li key={c.id}>
                  <Link href={routes.chapter(c.id)} className="hover:underline">
                    {t.book.chapter(c.number)} {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
