import { Breadcrumbs, Container, LinkCard, PageHero, StatusBadge } from "@/components/ui";
import { listPaths } from "@/content";
import { t } from "@/i18n";
import type { AudienceParams } from "@/lib/params";
import { audienceParams, requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => audienceParams("paths");

export async function generateMetadata({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "paths");
  return buildMetadata({
    title: `${t.paths.title} · ${t.audiences[a].label}`,
    path: routes.paths(a),
  });
}

export default async function PathsPage({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params, "paths");
  const paths = listPaths(a);
  return (
    <>
      <PageHero title={t.paths.title} eyebrow={t.audiences[a].label} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.paths.title, href: routes.paths(a) },
          ]}
        />
        {paths.length === 0 ? <p className="mt-6">{t.paths.empty}</p> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {paths.map((p) => (
            <LinkCard
              key={p.id}
              href={routes.path(a, p.id)}
              title={p.title}
              meta={
                <>
                  <StatusBadge status={p.status} />
                  <span className="text-xs">{t.paths.hours(p.estimatedHours)}</span>
                </>
              }
            >
              {p.summary}
            </LinkCard>
          ))}
        </div>
      </Container>
    </>
  );
}
