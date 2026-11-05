import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  Container,
  LinkCard,
  PageHero,
  Prose,
  SimulationBadge,
  StatusBadge,
  StatusNote,
} from "@/components/ui";
import { getChapter, listCases, listChapters, listLabs, listParts } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ chapterId: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return listChapters().map((c) => ({ chapterId: c.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const chapter = getChapter((await params).chapterId);
  if (!chapter) return {};
  return buildMetadata({
    title: chapter.title,
    description: chapter.summary,
    path: routes.chapter(chapter.id),
    status: chapter.status,
  });
}

export default async function ChapterPage({ params }: { params: Params }) {
  const chapter = getChapter((await params).chapterId);
  if (!chapter) notFound();
  const all = listChapters();
  const index = all.findIndex((c) => c.id === chapter.id);
  const prev = all[index - 1];
  const next = all[index + 1];
  const part = listParts().find((p) => p.id === chapter.part);
  const labs = listLabs().filter((l) => l.chapters.includes(chapter.id));
  const cases = listCases().filter((c) => c.chapters.includes(chapter.id));

  return (
    <>
      <PageHero
        title={chapter.title}
        eyebrow={`${part ? `${t.book.part(part.number)} · ` : ""}${t.book.chapter(chapter.number)}`}
        lead={chapter.summary}
        meta={<StatusBadge status={chapter.status} />}
      >
        <StatusNote status={chapter.status} />
      </PageHero>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.nav.home, href: routes.home() },
            { name: t.book.title, href: routes.book() },
            { name: chapter.title, href: routes.chapter(chapter.id) },
          ]}
        />
        <article className="mt-6">
          <Prose markdown={chapter.body} />
        </article>
        {labs.length + cases.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-10">
            <h2 id="related-heading" className="mb-4 text-lg font-semibold">
              {t.book.related}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {labs.map((lab) => (
                <LinkCard
                  key={lab.id}
                  href={routes.lab(lab.audiences[0] ?? "reader", lab.id)}
                  title={lab.title}
                  meta={<SimulationBadge />}
                >
                  {lab.summary}
                </LinkCard>
              ))}
              {cases.map((c) => (
                <LinkCard
                  key={c.id}
                  href={routes.case(c.audiences[0] ?? "reader", c.id)}
                  title={c.title}
                  meta={<StatusBadge status={c.status} />}
                >
                  {c.summary}
                </LinkCard>
              ))}
            </div>
          </section>
        ) : null}
        <nav aria-label={t.book.title} className="mt-10 flex justify-between gap-4 text-sm">
          {prev ? (
            <Link href={routes.chapter(prev.id)} className="hover:underline">
              ← {t.book.prev}：{prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={routes.chapter(next.id)} className="text-right hover:underline">
              {t.book.next}：{next.title} →
            </Link>
          ) : null}
        </nav>
      </Container>
    </>
  );
}
