import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, PageHero, SimulationBadge, StatusBadge } from "@/components/ui";
import { getChapter, getLab, loadBundle } from "@/content";
import { LabShell } from "@/features/labs/LabShell";
import { LabView } from "@/features/labs/registry";
import { t } from "@/i18n";
import { hasFeature } from "@/lib/audiences";
import { requireAudience } from "@/lib/params";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ audience: string; labId: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return loadBundle().labs.flatMap((l) =>
    l.audiences.filter((a) => hasFeature(a, "labs")).map((a) => ({ audience: a, labId: l.id })),
  );
}

async function load(params: Params) {
  const a = await requireAudience(params, "labs");
  const lab = getLab(a, (await params).labId);
  if (!lab) notFound();
  return { a, lab };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { a, lab } = await load(params);
  return buildMetadata({
    title: lab.title,
    description: lab.summary,
    path: routes.lab(a, lab.id),
    status: lab.status,
  });
}

export default async function LabPage({ params }: { params: Params }) {
  const { a, lab } = await load(params);
  const chapters = lab.chapters.map(getChapter).filter((c) => c !== undefined);
  return (
    <>
      <PageHero
        title={lab.title}
        eyebrow={`${t.audiences[a].label} · ${t.labs.title}`}
        lead={lab.summary}
        meta={
          <>
            <SimulationBadge />
            <StatusBadge status={lab.status} />
          </>
        }
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: t.audiences[a].label, href: routes.audience(a) },
            { name: lab.title, href: routes.lab(a, lab.id) },
          ]}
        />
        <div className="mt-6">
          <LabShell title={lab.title}>
            <LabView kind={lab.kind} />
          </LabShell>
        </div>
        {chapters.length > 0 ? (
          <p className="mt-6 text-sm">
            {t.labs.relatedChapters}：
            {chapters.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? "、" : ""}
                <Link href={routes.chapter(c.id)} className="underline underline-offset-4">
                  {c.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </Container>
    </>
  );
}
