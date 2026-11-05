import Link from "next/link";
import { Badge, Container, PageHero } from "@/components/ui";
import { getVerifyRecord, listVerifyRecords } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ token: string }>;

export function generateStaticParams() {
  return listVerifyRecords().map((r) => ({ token: r.token }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { token } = await params;
  return buildMetadata({
    title: t.verify.title,
    path: routes.verifyToken(token),
    noindex: true,
  });
}

export default async function VerifyResultPage({ params }: { params: Params }) {
  const token = decodeURIComponent((await params).token);
  const record = getVerifyRecord(token);
  return (
    <>
      <PageHero title={t.verify.title} lead={<span className="font-mono">{token}</span>} />
      <Container className="py-8">
        {record ? (
          <div className="relative max-w-xl overflow-hidden rounded-lg border-2 border-dashed border-line p-6 dark:border-line-dark">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex -rotate-12 items-center justify-center text-3xl font-bold text-ink/10 select-none dark:text-ink-dark/10"
            >
              {t.verify.watermark}
            </p>
            <p className="mb-4">
              <Badge tone="warn">{t.verify.watermark}</Badge>
            </p>
            <dl className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
              <dt className="text-ink-muted dark:text-ink-dark-muted">{t.verify.holder}</dt>
              <dd>{record.holder}</dd>
              <dt className="text-ink-muted dark:text-ink-dark-muted">{t.verify.programme}</dt>
              <dd>{record.programme}</dd>
              <dt className="text-ink-muted dark:text-ink-dark-muted">{t.verify.issuedOn}</dt>
              <dd>{record.issuedOn}</dd>
              <dt className="text-ink-muted dark:text-ink-dark-muted">{t.verify.state}</dt>
              <dd>{t.verify.states[record.state]}</dd>
            </dl>
          </div>
        ) : (
          <p role="status" className="max-w-xl">
            {t.verify.notFound}
          </p>
        )}
        <Link href={routes.verify()} className="mt-6 inline-block text-sm underline">
          ← {t.verify.back}
        </Link>
      </Container>
    </>
  );
}
