import { ChapterList } from "@/components/content/ChapterList";
import { PageHero, Section } from "@/components/ui";
import { listChaptersInPart, listParts } from "@/content";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: t.book.title,
  description: t.book.lead,
  path: routes.book(),
});

export default function BookPage() {
  return (
    <>
      <PageHero title={t.book.title} lead={t.book.lead} />
      {listParts().map((part) => (
        <Section key={part.id} id={part.id} title={`${t.book.part(part.number)} · ${part.title}`}>
          <p className="mb-4 text-sm text-ink-muted dark:text-ink-dark-muted">{part.summary}</p>
          <ChapterList chapters={listChaptersInPart(part.id)} />
        </Section>
      ))}
    </>
  );
}
