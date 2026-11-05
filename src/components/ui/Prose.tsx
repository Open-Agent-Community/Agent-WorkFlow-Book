import Link from "next/link";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-7">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-warn/60 bg-surface-muted px-4 py-1 text-sm text-ink-muted dark:bg-surface-dark-muted dark:text-ink-dark-muted">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-sm dark:bg-surface-dark-muted">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line px-3 py-2 text-left dark:border-line-dark">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-line px-3 py-2 dark:border-line-dark">{children}</td>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-brand-700 underline underline-offset-4 dark:text-brand-300">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        rel="noopener noreferrer"
        className="text-brand-700 underline underline-offset-4 dark:text-brand-300"
      >
        {children}
      </a>
    ),
};

/** Renders trusted repository Markdown. Raw HTML is not enabled. */
export function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-3xl">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
