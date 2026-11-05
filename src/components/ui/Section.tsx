import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  title,
  id,
  children,
}: {
  title?: string;
  id?: string;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section aria-labelledby={headingId} className="py-8">
      <Container>
        {title ? (
          <h2 id={headingId} className="mb-4 text-xl font-semibold">
            {title}
          </h2>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
