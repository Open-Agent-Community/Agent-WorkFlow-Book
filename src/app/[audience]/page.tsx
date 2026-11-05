import { LinkCard, PageHero, Section, SimulationBadge, StatusBadge } from "@/components/ui";
import { listCases, listLabs, listPaths } from "@/content";
import { t } from "@/i18n";
import { hasFeature } from "@/lib/audiences";
import type { AudienceParams } from "@/lib/params";
import { requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params);
  return buildMetadata({
    title: t.audiences[a].label,
    description: t.audiences[a].tagline,
    path: routes.audience(a),
  });
}

export default async function AudiencePage({ params }: { params: AudienceParams }) {
  const a = await requireAudience(params);
  const extra: Array<{ href: string; title: string }> = [];
  if (hasFeature(a, "syllabus"))
    extra.push({ href: routes.syllabus(a), title: t.features.syllabus });
  if (hasFeature(a, "diagnosis")) {
    extra.push({ href: routes.diagnosis(a), title: t.features.diagnosis });
  }

  return (
    <>
      <PageHero title={t.audiences[a].label} lead={t.audiences[a].tagline} />
      <Section title={t.features.paths} id="paths">
        <div className="grid gap-4 sm:grid-cols-2">
          {listPaths(a).map((p) => (
            <LinkCard
              key={p.id}
              href={routes.path(a, p.id)}
              title={p.title}
              meta={<StatusBadge status={p.status} />}
            >
              {p.summary}
            </LinkCard>
          ))}
        </div>
      </Section>
      <Section title={t.features.labs} id="labs">
        <div className="grid gap-4 sm:grid-cols-3">
          {listLabs(a).map((lab) => (
            <LinkCard
              key={lab.id}
              href={routes.lab(a, lab.id)}
              title={lab.title}
              meta={<SimulationBadge />}
            >
              {lab.summary}
            </LinkCard>
          ))}
        </div>
      </Section>
      <Section title={t.features.cases} id="cases">
        <div className="grid gap-4 sm:grid-cols-2">
          {listCases(a).map((c) => (
            <LinkCard
              key={c.id}
              href={routes.case(a, c.id)}
              title={c.title}
              meta={<StatusBadge status={c.status} />}
            >
              {c.summary}
            </LinkCard>
          ))}
          <LinkCard href={routes.cases(a)} title={`${t.features.cases} →`} />
        </div>
      </Section>
      {extra.length > 0 ? (
        <Section title={t.audiences[a].label} id="more">
          <div className="grid gap-4 sm:grid-cols-2">
            {extra.map((e) => (
              <LinkCard key={e.href} href={e.href} title={e.title} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
