import Link from "next/link";
import { Breadcrumbs, Container, PageHero, StatusBadge } from "@/components/ui";
import { getChapter, getSyllabus, listLabs, listResources } from "@/content";
import { t } from "@/i18n";
import { hasFeature } from "@/lib/audiences";
import type { AudienceParams } from "@/lib/params";
import { audienceParams, requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => audienceParams("syllabus");

export async function generateMetadata({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "syllabus");
  return buildMetadata({
    title: t.syllabus.title,
    description: t.syllabus.lead,
    path: routes.syllabus(a),
  });
}

export default async function SyllabusPage({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "syllabus");
  const labs = new Map(listLabs(a).map((l) => [l.id, l]));
  return (
    <>
      <PageHero title={t.syllabus.title} eyebrow={t.audiences[a].label} lead={t.syllabus.lead} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.syllabus.title, href: routes.syllabus(a) },
          ]}
        />
        <ol className="mt-6 space-y-4">
          {getSyllabus().map((w) => {
            const lab = w.lab ? labs.get(w.lab) : undefined;
            return (
              <li
                key={w.week}
                className="rounded-card border border-line p-4 dark:border-line-dark"
              >
                <h2 className="font-semibold">
                  {t.syllabus.week(w.week)} · {w.topic}
                </h2>
                <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[6rem_1fr]">
                  <dt className="text-ink-muted dark:text-ink-dark-muted">{t.syllabus.chapters}</dt>
                  <dd>
                    {w.chapters.map((id, i) => (
                      <span key={id}>
                        {i > 0 ? "、" : ""}
                        <Link href={routes.chapter(id)} className="underline underline-offset-4">
                          {getChapter(id)?.title ?? id}
                        </Link>
                      </span>
                    ))}
                  </dd>
                  {lab ? (
                    <>
                      <dt className="text-ink-muted dark:text-ink-dark-muted">{t.syllabus.lab}</dt>
                      <dd>
                        <Link href={routes.lab(a, lab.id)} className="underline underline-offset-4">
                          {lab.title}
                        </Link>
                      </dd>
                    </>
                  ) : null}
                  <dt className="text-ink-muted dark:text-ink-dark-muted">{t.syllabus.activity}</dt>
                  <dd>{w.activity}</dd>
                </dl>
              </li>
            );
          })}
        </ol>
        {hasFeature(a, "teachingPack") ? (
          <section aria-labelledby="pack-heading" className="mt-10">
            <h2 id="pack-heading" className="mb-3 text-lg font-semibold">
              {t.syllabus.teachingPack}
            </h2>
            <ul className="space-y-2">
              {listResources(a).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2">
                  <span>{r.title}</span>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
            <Link href={routes.resources()} className="mt-3 inline-block text-sm underline">
              {t.resources.title} →
            </Link>
          </section>
        ) : null}
      </Container>
    </>
  );
}
