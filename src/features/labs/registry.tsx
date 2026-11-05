import type { Lab } from "@/content/schema";

/** Maps a lab kind to its client component. Lab UIs land in P3. */
export function LabView({ kind }: { kind: Lab["kind"] }) {
  return (
    <p className="text-sm text-ink-muted dark:text-ink-dark-muted" data-lab-kind={kind}>
      …
    </p>
  );
}
