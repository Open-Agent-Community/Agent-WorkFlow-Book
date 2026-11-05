import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink, LinkCard, PageHero, Section, SimulationBadge } from "@/components/ui";
import { listChaptersInPart, listLabs, listParts } from "@/content";
import { t } from "@/i18n";
import { AUDIENCES, AUDIENCE_META } from "@/lib/audiences";
import { routes } from "@/lib/routes";
import { websiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <PageHero title={t.home.title} lead={t.home.lead} eyebrow={t.site.tagline} />
      <Section title={t.home.chooseAudience} id="audiences">
        <div className="grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map((a) => (
            <LinkCard key={a} href={routes.audience(a)} title={t.audiences[a].label}>
              <p>{t.audiences[a].tagline}</p>
              <p className="mt-2 text-xs">
                {AUDIENCE_META[a].features.map((f) => t.features[f]).join(" · ")}
              </p>
            </LinkCard>
          ))}
        </div>
      </Section>
      <Section title={t.home.bookHeading} id="book">
        <div className="grid gap-4 sm:grid-cols-2">
          {listParts().map((p) => (
            <div key={p.id} className="rounded-card border border-line p-5 dark:border-line-dark">
              <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
                {t.book.part(p.number)} · {t.book.chapterCount(listChaptersInPart(p.id).length)}
              </p>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted dark:text-ink-dark-muted">{p.summary}</p>
            </div>
          ))}
        </div>
        <ButtonLink href={routes.book()} variant="secondary" className="mt-6">
          {t.home.openBook}
        </ButtonLink>
      </Section>
      <Section title={t.home.labsHeading} id="labs">
        <p className="mb-4 text-sm text-ink-muted dark:text-ink-dark-muted">{t.home.labsLead}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {listLabs().map((lab) => (
            <LinkCard
              key={lab.id}
              href={routes.lab(lab.audiences[0] ?? "reader", lab.id)}
              title={lab.title}
              meta={<SimulationBadge />}
            >
              {lab.summary}
            </LinkCard>
          ))}
        </div>
      </Section>
    </>
  );
}
