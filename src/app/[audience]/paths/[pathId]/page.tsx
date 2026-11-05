import { notFound } from "next/navigation";
import { PathSteps } from "@/components/content/PathSteps";
import { Breadcrumbs, Container, PageHero, StatusBadge, StatusNote } from "@/components/ui";
import { getPath, loadBundle } from "@/content";
import { t } from "@/i18n";
import { hasFeature } from "@/lib/audiences";
import { requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ audience: string; pathId: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return loadBundle()
    .paths.filter((p) => hasFeature(p.audience, "paths"))
    .map((p) => ({ audience: p.audience, pathId: p.id }));
}

async function load(params: Params) {
  const a = await requireAudience(params, "paths");
  const path = getPath(a, (await params).pathId);
  if (!path) notFound();
  return { a, path };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { a, path } = await load(params);
  return buildMetadata({
    title: path.title,
    description: path.summary,
    path: routes.path(a, path.id),
    status: path.status,
  });
}

export default async function PathPage({ params }: { params: Params }) {
  const { a, path } = await load(params);
  return (
    <>
      <PageHero
        title={path.title}
        eyebrow={`${t.audiences[a].label} · ${t.paths.title}`}
        lead={path.summary}
        meta={
          <>
            <StatusBadge status={path.status} />
            <span className="text-sm">{t.paths.hours(path.estimatedHours)}</span>
          </>
        }
      >
        <StatusNote status={path.status} />
      </PageHero>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: t.paths.title, href: routes.paths(a) },
            { name: path.title, href: routes.path(a, path.id) },
          ]}
        />
        <h2 className="mt-8 mb-4 text-lg font-semibold">{t.paths.steps}</h2>
        <PathSteps path={path} />
      </Container>
    </>
  );
}
