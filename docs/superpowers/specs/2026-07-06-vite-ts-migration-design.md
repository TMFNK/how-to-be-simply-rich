# Vite + TypeScript Migration — Design Spec

**Date:** 2026-07-06
**Status:** Approved design, pre-implementation
**Purpose:** Align this project's tooling and repo conventions with the `Gutenberg-Stacks` sibling project — Vite + TypeScript + Vitest, hash-routed SPA, GitHub Pages deploy via GitHub Actions.

## Decisions made (brainstorm 2026-07-06)

| Decision | Choice |
|---|---|
| Frontend architecture | Single-page app with hash routing (`#/`, `#/topic/<slug>`, `#/about`), matching Gutenberg Stacks. Old per-topic URLs (`time.html`, `love.html`, ...) are replaced — no redirects, since the site isn't yet deployed anywhere. |
| Folder layout | Flat: Vite project at repo root, no `web/` subfolder. Gutenberg splits `web/` from `pipeline/`; this project has no data pipeline, so that split would be unused nesting. |
| Search | None. Gutenberg's MiniSearch bar exists to browse 1,000 books; this site has 24 hand-authored topics, small enough to browse via the domain map and Random button as today. |
| Data pipeline | None. Gutenberg's Python/uv pipeline builds content from a book catalog; this site's content is hand-written and lives directly in source. |
| Testing | Python `unittest` structural checks removed (they assert static per-topic `.html` files exist, which stops being true). Replaced with Vitest, mirroring Gutenberg's `*.test.ts`-next-to-source pattern. |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml`, adapted from Gutenberg's: `npm ci && npm test && npm run build`, deploy `dist/`. |
| Git remote | Out of scope. `git init` + local commits only — no GitHub remote created or pushed to as part of this work. |

## Architecture

### Entry point

`index.html` — single entry point. Carries over from the current `index.html`/`about.html`: the GA gtag script, Google Fonts `<link>` tags, and the site nav (Atlas of Wealth / About / Random). Body reduces to a nav plus a single `#app` mount div; all page content renders into it via the router.

### Source layout (`src/`)

- `types.ts` — `Domain`, `TopicSlug`, `TopicContent` interfaces.
- `content.ts` — `topicOrder`, `atlasDomains`, `topicContent`, ported directly from `siteData.js` with types added. This is the single source of truth for topic data; `richThings.js` (an unloaded, hand-synced duplicate of `topicOrder` per the current README) is deleted rather than ported.
- `router.ts` — resolves `location.hash` to a route:
  - `#/` or empty → home
  - `#/topic/<slug>` → topic (unknown slug → not-found)
  - `#/about` → about
  - anything else → not-found
- `views.ts` — `renderHome`, `renderTopic`, `renderAbout`, `renderNotFound`. Each takes the mount element (and route data where relevant) and produces the HTML currently produced by `index.html`'s atlas markup, `topicPage.js`, and `about.html`.
- `main.ts` — boots the app: reads the initial hash, renders the matching view, re-renders on `hashchange`, wires the Random link to jump to `#/topic/<random slug>`.
- `style.css` — moved from `styles.css` at repo root, contents unchanged.

### Behavior parity

- Random navigation (`data-random-topic` links) picks a random slug from `topicOrder` and sets `location.hash`, instead of navigating to `<slug>.html`.
- Topic view keeps the existing prev/next/random nav and the definition/why/notice-choose-practice/prompts layout.
- `document.title` updates per route, matching current per-page `<title>` behavior.

## Testing

- Delete `tests/test_site_structure.py` and `tests/__init__.py`.
- Add Vitest (`vitest`, `typescript`, `vite` as devDependencies):
  - `content.test.ts` — every slug in `topicOrder` has a `topicContent` entry with `definition`, `why`, `notice`, `choose`, `practice`, and non-empty `prompts`; every slug appears in exactly one `atlasDomains` entry; domain names match the five expected headings (Inner Life, Relationships, Vitality, Growth, Living Fully).
  - `router.test.ts` — hash strings resolve to the expected route for home, topic (valid and invalid slug), about, and unknown paths.
- `package.json` scripts: `dev` (`vite`), `build` (`tsc && vite build`), `preview` (`vite preview`), `test` (`vitest run`).

## Repo & CI

- `git init` at repo root, initial commit.
- `.gitignore`: `node_modules`, `dist`, `.DS_Store`, `.claude/`.
- `.github/workflows/deploy.yml`: on push to `main` (and `workflow_dispatch`), `npm ci`, `npm test`, `npm run build`, deploy `dist/` to GitHub Pages via `actions/deploy-pages`.
- `vite.config.ts`: `base: '/how-to-be-simply-rich/'` on build, `/` on dev. Assumption: eventual GitHub repo is named `how-to-be-simply-rich`; a one-line change if not.

## Docs

- `AGENTS.md` (new) — "Learned Workspace Facts" describing the SPA/hash-routing architecture, mirroring Gutenberg Stacks' `AGENTS.md` style.
- `CONTRIBUTING.md` (new) — frontend-only version of Gutenberg's `CONTRIBUTING.md` (no pipeline section): `npm install && npm run dev` to develop, `npm run build && npm test` before a PR.
- `README.md` — update "Project Structure" and "Running Checks" sections to describe the new `src/` layout and `npm test`, in place of the Python command and per-file structure.

## Files removed

- `homepage.js`, `topicPage.js`, `siteData.js`, `richThings.js`, `styles.css` (content moves into `src/`).
- All per-topic `*.html` files (`time.html`, `love.html`, ... — 23 files) and `about.html` (superseded by `renderAbout`).
- `tests/test_site_structure.py`, `tests/__init__.py`.

## Out of scope

Python data pipeline, MiniSearch, deck.gl visualization, GitHub remote creation/push, redirects from old URLs (no live deployment exists to redirect from).
