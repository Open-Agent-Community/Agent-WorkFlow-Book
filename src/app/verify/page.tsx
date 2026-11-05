import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, Container, PageHero } from "@/components/ui";
import { listVerifyRecords } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: t.verify.title,
  description: t.verify.lead,
  path: routes.verify(),
  noindex: true,
});

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  const value = (Array.isArray(token) ? token[0] : token)?.trim().toUpperCase();
  if (value) redirect(routes.verifyToken(encodeURIComponent(value)));

  return (
    <>
      <PageHero title={t.verify.title} lead={t.verify.lead} />
      <Container className="py-8">
        <form action={routes.verify()} method="get" className="flex max-w-md flex-col gap-3">
          <label htmlFor="token" className="text-sm font-medium">
            {t.verify.tokenLabel}
          </label>
          <div className="flex gap-2">
            <input
              id="token"
              name="token"
              required
              autoComplete="off"
              placeholder="DEMO-XXXX-XXXX"
              className={cn(
                "min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono",
                "dark:border-line-dark dark:bg-surface-dark",
              )}
            />
            <Button type="submit">{t.verify.submit}</Button>
          </div>
        </form>
        <h2 className="mt-8 text-sm font-medium">{t.verify.examples}</h2>
        <ul className="mt-2 space-y-1 font-mono text-sm">
          {listVerifyRecords().map((r) => (
            <li key={r.token}>
              <Link href={routes.verifyToken(r.token)} className="underline underline-offset-4">
                {r.token}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
