import { Badge, Container, PageHero, StatusBadge, buttonClasses } from "@/components/ui";
import { listResources } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: t.resources.title,
  description: t.resources.lead,
  path: routes.resources(),
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero title={t.resources.title} lead={t.resources.lead} />
      <Container className="py-8">
        <ul className="space-y-4">
          {listResources().map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded-card border border-line p-4 sm:flex-row sm:items-center sm:justify-between dark:border-line-dark"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{r.title}</h2>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark-muted">
                  {r.description}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
                  <span>{t.resources.audiences}：</span>
                  {r.audiences.map((a) => (
                    <Badge key={a}>{t.audiences[a].label}</Badge>
                  ))}
                </p>
              </div>
              {r.file && r.status !== "planned" ? (
                <a href={r.file} download className={buttonClasses("secondary", "shrink-0")}>
                  {t.resources.download}
                  <span className="sr-only">：{r.title}</span>
                </a>
              ) : (
                <span className="text-sm text-ink-muted dark:text-ink-dark-muted">
                  {t.resources.unavailable}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
