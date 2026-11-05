# AgentFlow Learn

> 《智能体工作流设计》配套学习平台：章节导读、学习路径、虚构案例与浏览器内的确定性模拟实验，
> 面向读者、高校、企业与 FDE（一线交付工程师）。站点默认语言为简体中文。

AgentFlow Learn is the companion website for a book and course on agent workflow design. It
serves four audiences (`reader`, `campus`, `enterprise`, `fde`) from one typed content model,
with validated content, deterministic labs and a strict set of quality gates.

**All book, case and path content in this repository is placeholder text.**

## What is real and what is simulated

| Area               | Status in v1                                                                          |
| ------------------ | ------------------------------------------------------------------------------------- |
| Chapter guides     | Real pages. Titles and summaries are **placeholders** (`placeholder: true`).          |
| Learning paths     | Real pages built from typed data. Some are `preview` or `planned`.                    |
| Case studies       | Real pages. All companies, people and data are **fictional**.                         |
| Labs               | **Simulations.** Fixed, unit-tested rules running in the browser. No model calls.     |
| Downloads          | Real Markdown templates under `public/resources/` (placeholder content).              |
| Credential lookup  | **Demo only.** Looks up `DEMO-` records in a content file. Not a certificate service. |
| Accounts, payments | Not implemented. There is no database, auth, payment or analytics.                    |
| Network calls      | None. The site makes no external API calls and loads no third-party scripts.          |

Every lab shows a "Simulation / 模拟" badge. Every `/verify` page shows a persistent demo banner.
Content with status `planned` is labelled, set to `noindex` and left out of the sitemap.

## Quick start

Requirements: Node.js 20 or later, and pnpm 10.

```bash
pnpm install
```

```bash
cp .env.example .env.local
```

```bash
pnpm dev
```

Then open <http://localhost:3000>.

## Scripts

| Script               | What it does                                                          |
| -------------------- | --------------------------------------------------------------------- |
| `pnpm dev`           | Start the dev server                                                  |
| `pnpm build`         | Production build (`output: "standalone"`)                             |
| `pnpm start`         | Serve the production build                                            |
| `pnpm lint`          | ESLint (next + typescript-eslint, max 250 lines/file, 100 chars/line) |
| `pnpm typecheck`     | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`)                   |
| `pnpm format`        | Prettier (write). `pnpm format:check` verifies only.                  |
| `pnpm test`          | Vitest unit and component tests                                       |
| `pnpm test:e2e`      | Playwright smoke and axe tests against `pnpm start` (build first)     |
| `pnpm content:check` | Validate content schemas and cross-references                         |
| `pnpm check`         | lint + typecheck + test + content:check + build                       |

CI (`.github/workflows/ci.yml`) runs `format:check` and `check`, then the Playwright smoke test
on the built output.

## Architecture

```text
src/
  app/                 routes only (thin pages); one [audience] segment for all audiences
  components/ui/       primitives: Button, Card, StatusBadge, PageHero, Breadcrumbs, Prose, ...
  components/layout/   header, footer, audience switcher, theme toggle, skip link
  components/content/  content-aware building blocks (chapter list, path steps, ...)
  components/seo/      JsonLd (the only dangerouslySetInnerHTML; escapes "<")
  features/labs/<lab>/ rules.ts (pure), rules.test.ts, <Lab>.tsx (client UI)
  content/             schema.ts, index.ts (loaders), chapters/, cases/, pages/, *.ts data
  i18n/                all UI strings (zh-CN)
  lib/                 audiences.ts, routes.ts, seo.ts, params.ts, utils.ts
  config/site.ts       env-driven site configuration
scripts/content-check.ts
e2e/                   Playwright smoke + axe
```

Key rules:

- **One audience model.** `src/lib/audiences.ts` defines `AUDIENCES` and a `features` map.
  Routes, static params, content checks and the sitemap all derive from it. If an audience
  lacks a feature (for example `/reader/syllabus`), the page returns 404.
- **Content is validated data.** Long-form text is Markdown with Zod-validated frontmatter.
  Structured data is typed `.ts`. Pages read content only through `src/content/index.ts`.
- **Cross-references are enforced.** `pnpm content:check` verifies unique ids, path, case and
  lab references, audience and feature validity, internal Markdown links, resource files, and
  that published content never links to planned content.
- **One status model.** `ContentStatus = "published" | "preview" | "planned"`, rendered only by
  `StatusBadge`.
- **Labs separate logic from UI.** `rules.ts` is pure and deterministic. The UI is a thin
  reducer-driven client component built from native, keyboard-operable controls with an
  `aria-live` result panel.
- **Styling.** Tailwind CSS 4 tokens are defined via `@theme` in `src/app/globals.css`, the
  only CSS file. Dark mode is class-based. A tiny inline script in the root layout applies the
  saved theme before hydration, and it only toggles the `dark` class.

## Adding content

- **Chapter:** add `src/content/chapters/chNN.md`. The file name must equal the `id`.
- **Case:** add `src/content/cases/<id>.md` with `audiences: [...]` and related `chapters`.
- **Path, lab or resource:** add an entry to `paths.ts`, `labs.ts` or `resources.ts`. A new lab
  kind also needs a component registered in `src/features/labs/registry.tsx`.
- **UI text:** add strings to `src/i18n/zh-CN.ts` (or `zh-CN-labs.ts`), never inline in
  components.

Then run `pnpm content:check`.

## Configuration

All configuration comes from `NEXT_PUBLIC_*` environment variables read in
`src/config/site.ts`. See `.env.example`. Do not commit personal contact details, phone
numbers, QR codes or contact images.

## Deployment

The build uses `output: "standalone"`. To deploy, ship `.next/standalone`, plus `.next/static`
copied to `.next/standalone/.next/static`, plus `public/` copied to `.next/standalone/public`.
Then run `node server.js`. Set `NEXT_PUBLIC_SITE_URL` before building so canonical URLs and the
sitemap are correct.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

**TODO:** no license has been chosen yet, so this repository does not include a `LICENSE` file.
Until the maintainers publish one, no rights to use, modify or redistribute the code or content
are granted beyond what applicable law allows.
