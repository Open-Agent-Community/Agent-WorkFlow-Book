import Link from "next/link";
import { Breadcrumbs, Card, Container, PageHero } from "@/components/ui";
import { getChapter, getDiagnosis } from "@/content";
import { t } from "@/i18n";
import type { AudienceParams } from "@/lib/params";
import { audienceParams, requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => audienceParams("diagnosis");

export async function generateMetadata({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "diagnosis");
  return buildMetadata({
    title: t.diagnosis.title,
    description: t.diagnosis.lead,
    path: routes.diagnosis(a),
  });
}

export default async function DiagnosisPage({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "diagnosis");
  return (
    <>
      <PageHero title={t.diagnosis.title} eyebrow={t.audiences[a].label} lead={t.diagnosis.lead} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.diagnosis.title, href: routes.diagnosis(a) },
          ]}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {getDiagnosis().map((d) => (
            <Card key={d.id}>
              <h2 className="font-semibold">{d.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {d.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              {d.chapters.length > 0 ? (
                <p className="mt-3 text-sm text-ink-muted dark:text-ink-dark-muted">
                  {t.diagnosis.readMore}：
                  {d.chapters.map((id, i) => (
                    <span key={id}>
                      {i > 0 ? "、" : ""}
                      <Link href={routes.chapter(id)} className="underline underline-offset-4">
                        {getChapter(id)?.title ?? id}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
