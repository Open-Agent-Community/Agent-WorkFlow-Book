import { ButtonLink, Container } from "@/components/ui";
import { t } from "@/i18n";
import { routes } from "@/lib/routes";

export const metadata = { title: t.notFound.title, robots: { index: false } };

export default function NotFound() {
  return (
    <Container className="py-20">
      <h1 className="text-2xl font-bold">{t.notFound.title}</h1>
      <p className="mt-3 text-ink-muted dark:text-ink-dark-muted">{t.notFound.lead}</p>
      <ButtonLink href={routes.home()} className="mt-6">
        {t.notFound.home}
      </ButtonLink>
    </Container>
  );
}
