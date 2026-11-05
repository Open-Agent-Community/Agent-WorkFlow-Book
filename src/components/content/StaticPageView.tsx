import { notFound } from "next/navigation";
import { Container, PageHero, Prose } from "@/components/ui";
import { getPage } from "@/content";
import { t } from "@/i18n";

export function StaticPageView({ id }: { id: string }) {
  const page = getPage(id);
  if (!page) notFound();
  return (
    <>
      <PageHero title={page.title} lead={t.legal.updated(page.updated)} />
      <Container className="py-8">
        <Prose markdown={page.body} />
      </Container>
    </>
  );
}
