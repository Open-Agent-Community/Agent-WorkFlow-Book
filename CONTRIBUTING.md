# Contributing to AgentFlow Learn

Thanks for helping. This guide covers what a pull request needs in order to be merged.

## Ground rules

- **Write your own content.** Do not copy code, text, images, QR codes or branding from other
  sites or repositories.
- **Say what is placeholder, fictional or simulated.** Use `placeholder: true` on draft content,
  keep cases fictional, and never present a lab or the `/verify` demo as a real service.
- **No secrets, tracking or network calls.** Do not add analytics, third-party scripts, external
  API calls, credentials or personal data.
- **No binaries.** Do not commit raster images, archives or build output. Prefer SVG, and record
  every image in `public/images/CREDITS.md`.
- **Ask before adding a dependency.** The stack is intentionally small (see README).

## Workflow

1. Open an issue describing the change, or comment on an existing one.
2. Create a branch from `main`.
3. Make the change and run:

   ```bash
   pnpm check
   ```

   For UI changes, also run the end-to-end smoke test (it needs a prior `pnpm build`):

   ```bash
   pnpm test:e2e
   ```

4. Use [Conventional Commits](https://www.conventionalcommits.org/), for example
   `feat(content): add chapter 14` or `fix(labs): handle empty flow`.
5. Open a pull request that explains what changed, why, and how you verified it.

## Code conventions

- TypeScript strict mode: no `any`, no `@ts-ignore` or `@ts-expect-error`.
- Files stay under 250 lines and lines under 100 characters. ESLint and Prettier enforce both.
- Pages in `src/app` stay thin. Put logic in `src/lib`, `src/content` or `src/features`.
- Read content only through `src/content/index.ts`. Never read raw files from a page.
- UI strings go in `src/i18n/`. Hard-coded copy in components will be flagged in review.
- Only `src/components/ui` primitives and Tailwind tokens from `globals.css` are used for
  styling. Do not add new CSS files.
- `dangerouslySetInnerHTML` is used only in `src/components/seo/JsonLd.tsx`.

## Labs

Each lab lives in `src/features/labs/<lab>/`:

- `rules.ts`: pure and deterministic, with no I/O, randomness, dates or model calls.
- `rules.test.ts`: unit tests covering every rule.
- `<Lab>.tsx`: a thin client component using native, keyboard-operable controls.

Register the component in `src/features/labs/registry.tsx` and add the lab's metadata to
`src/content/labs.ts`. The shared `LabShell` adds the required "Simulation / 模拟" badge.

## Content

Run `pnpm content:check` after changing anything in `src/content`. It fails on duplicate ids,
unknown references, audiences without the needed feature, broken internal links, missing
resource files, and published content that links to planned content.
