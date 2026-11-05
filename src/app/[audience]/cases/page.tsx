import { Breadcrumbs, Container, LinkCard, PageHero, StatusBadge } from "@/components/ui";
import { listCases } from "@/content";
import { t } from "@/i18n";
import type { AudienceParams } from "@/lib/params";
import { audienceParams, requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => audienceParams("cases");

export async function generateMetadata({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "cases");
  return buildMetadata({
    title: `${t.cases.title} · ${t.audiences[a].label}`,
    description: t.cases.lead,
    path: routes.cases(a),
  });
}

export default async function CasesPage({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "cases");
  const cases = listCases(a);
  return (
    <>
      <PageHero title={t.cases.title} eyebrow={t.audiences[a].label} lead={t.cases.lead} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.cases.title, href: routes.cases(a) },
          ]}
        />
        {cases.length === 0 ? <p className="mt-6">{t.cases.empty}</p> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <LinkCard
              key={c.id}
              href={routes.case(a, c.id)}
              title={c.title}
              meta={
                <>
                  <StatusBadge status={c.status} />
                  <span className="text-xs">{c.industry}</span>
                </>
              }
            >
              {c.summary}
            </LinkCard>
          ))}
        </div>
      </Container>
    </>
  );
}
