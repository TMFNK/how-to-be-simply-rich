<p align="center">
  <img src="docs/images/banner.svg" alt="Atlas of Wealth" width="100%">
</p>

<p align="center">
  <a href="https://github.com/TMFNK/how-to-be-simply-rich/actions/workflows/deploy.yml"><img src="https://github.com/TMFNK/how-to-be-simply-rich/actions/workflows/deploy.yml/badge.svg" alt="Deploy status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License: AGPL v3"></a>
  <img src="https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white" alt="Built with Vite">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <a href="https://tmfnk.github.io/how-to-be-simply-rich/"><img src="https://img.shields.io/badge/live-atlas--of--wealth-946c1f" alt="Live site"></a>
</p>

<p align="center"><strong><a href="https://tmfnk.github.io/how-to-be-simply-rich/">🌐 View the live atlas</a></strong></p>

A static atlas of non-financial wealth: 23 areas of life worth being rich in, grouped into 5 domains, each with a definition, a reason it matters, and a three-part daily practice.

The site treats richness as a landscape rather than a flat checklist. Instead of opening on a wall of equal-weight topics, the homepage groups the ideas into a few larger domains so visitors can browse the full map first and then choose one area to reflect on.

## Contents

- [What the Site Does](#what-the-site-does)
- [Atlas Structure](#atlas-structure)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Editing Content](#editing-content)
- [Running Checks](#running-checks)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## What the Site Does

The homepage works as an atlas of five domains:

- Inner Life
- Relationships
- Vitality
- Growth
- Living Fully

Each domain links to a set of topics such as `time`, `love`, `health`, `wisdom`, or `adventure`. Every topic follows the same compact structure:

- a short definition
- why it matters
- three practice prompts: `Notice`, `Choose`, `Practice`
- a small set of reflection questions

## Atlas Structure

The current domain model is:

- `Inner Life`: mind, contentment, resilience, faith, wisdom
- `Relationships`: love, family, connection, empathy, kindness, community
- `Vitality`: health, time, blessings, gratitude
- `Growth`: knowledge, curiosity, creativity, purpose, growth
- `Living Fully`: adventure, experiences, happiness

## Quick Start

```bash
git clone https://github.com/TMFNK/how-to-be-simply-rich.git
cd how-to-be-simply-rich
npm install
npm run dev
```

Open the printed local URL — that's the whole setup.

## Project Structure

- `index.html`: single-page app shell (nav + `#app` mount point)
- `src/main.ts`: boots the app, wires hash routing and the Random link
- `src/router.ts`: resolves `location.hash` to a route
- `src/views.ts`: renders each route's markup (home, topic, about, not-found)
- `src/content.ts`: topic order, domain model, and topic content (typed)
- `src/types.ts`: `Domain` and `TopicContent` types
- `src/style.css`: shared visual system
- `src/*.test.ts`: Vitest unit tests for content integrity and routing
- `docs/superpowers/specs/`: approved design specs
- `docs/superpowers/plans/`: implementation plans

## Editing Content

To change the structure of the site:

1. Edit `src/content.ts` to update the domain model or topic copy.
2. Edit `src/views.ts` if the homepage framing or atlas layout should change.
3. Edit `src/style.css` to adjust the visual system.

To add a new topic:

1. Add the slug to `topicOrder` in `src/content.ts`.
2. Add the topic to the correct domain in `atlasDomains`.
3. Add a `topicContent` entry with `title`, `domain`, `definition`, `why`, `notice`, `choose`, `practice`, and `prompts`.
4. Run `npm test` — `content.test.ts` checks every slug has a complete entry and belongs to exactly one domain.

## Running Checks

Install dependencies once with `npm install`, then:

```bash
npm run dev     # local dev server
npm test        # Vitest unit tests
npm run build   # type-check + production build to dist/
```

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the PR checklist, and how to report bugs or suggest features.

## License

Licensed under [AGPL-3.0](LICENSE).

## Credits

Created by TMFNK. Based on Kashcha.
