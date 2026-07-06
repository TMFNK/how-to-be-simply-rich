# How to Be Rich Atlas Redesign

## Context

This project is a static website about forms of wealth that are not reducible to money. The current homepage presents all topics as a flat grid of equal-weight cards. That structure makes the site easy to generate, but hard to understand quickly: visitors must choose before the site has oriented them.

The approved direction is to optimize the homepage for browsing the full map of the idea, not for random selection and not for philosophy-first reading.

## Goal

Turn the site into a fast, legible atlas of non-financial wealth.

Success means:

- A first-time visitor can understand the thesis of the site in under 10 seconds.
- All topics remain reachable in one click from the homepage.
- The homepage communicates hierarchy instead of showing a flat wall of options.
- Topic pages become shorter, clearer, and more actionable.

## Non-Goals

- Do not convert the project to a framework or CMS.
- Do not add accounts, persistence, search, or heavy client-side interaction.
- Do not turn the site into a blog, feed, or journaling app.

## Core Product Thesis

The site is a map of the kinds of wealth that make a life feel full.

Visitors should arrive, understand the major territories of the map, and then open one area for reflection or practice.

## Information Architecture

### Homepage Role

`index.html` becomes the orientation page for the whole project. Its job is to explain the idea quickly and present the map in grouped domains.

### Domain Model

The homepage organizes the existing topics into five domains:

1. `Inner Life`
   - `mind`
   - `contentment`
   - `resilience`
   - `faith`
   - `wisdom`
2. `Relationships`
   - `love`
   - `family`
   - `connection`
   - `empathy`
   - `kindness`
   - `community`
3. `Vitality`
   - `health`
   - `time`
   - `blessings`
   - `gratitude`
4. `Growth`
   - `knowledge`
   - `curiosity`
   - `creativity`
   - `purpose`
   - `growth`
5. `Living Fully`
   - `adventure`
   - `experiences`
   - `happiness`

### Utility Links

Below the atlas, include a compact utility strip:

- Random topic
- About / philosophy
- How to use the site

The random entry remains available, but it is no longer the primary interaction.

## Homepage Content Model

### Hero

The homepage begins with a short thesis and an equally short instruction:

- Thesis: define the site as a map of non-financial wealth
- Instruction: tell the visitor to browse a domain and choose one area

The hero should be brief. It should not compete with the atlas.

### Atlas Panels

Each domain is displayed as a large panel containing:

- Domain name
- One-sentence description
- Linked topic list

The panels are the central browsing interface and should be visually distinct from the topic pages.

### Interaction Rules

- Keep everything visible by default on desktop.
- Avoid nested accordions or hidden layers on the homepage.
- On mobile, panels can stack vertically, but the hierarchy must remain obvious.

## Topic Page Model

Each topic page should move away from ten expandable cards and toward one compact reflection page.

### Page Structure

1. Title
2. One-line definition of the kind of wealth
3. Short paragraph on why it matters
4. Three-part practice section:
   - `Notice`
   - `Choose`
   - `Practice`
5. Optional reflection prompts or examples
6. Footer navigation:
   - Back to atlas
   - Random topic
   - Previous / next topic if useful

### Writing Standard

Each page should feel readable in a single sitting. Content should be tighter and less repetitive than the current card stack pattern.

The three-part structure should make every page feel consistent:

- `Notice` identifies what to pay attention to
- `Choose` frames a concrete intention or decision
- `Practice` gives a small action the visitor can take today

## Visual Direction

The visual system should support speed and clarity.

### Principles

- Quiet, intentional, and fast
- More typographic than decorative
- Warm and human rather than app-like

### Style

- Warm paper-like background
- Dark ink text
- One restrained accent color
- Clear spacing and hierarchy
- Minimal shadows and minimal chrome

### Layout Character

The homepage should feel like an atlas or field guide, not a dashboard and not a generic card catalog.

## File-Level Changes

- `index.html`
  - Replace flat topic grid with the atlas homepage
- Topic pages such as `time.html`, `love.html`, `health.html`
  - Rewrite to the compact topic-page template
- `about.html`
  - Reposition as philosophy and usage guidance
- `styles.css`
  - Establish the shared visual system for atlas and topic pages
- `README.md`
  - Rewrite to describe the product as a map of non-financial wealth and document the new structure

## README Direction

The README should be rewritten to match the redesign. It should:

- Explain the core idea clearly
- Describe the atlas model and domain grouping
- Explain how visitors should use the site
- Document the static site structure
- Explain how to edit or add topic pages

It should be less autobiographical and more useful as a project document.

## Technical Constraints

- Keep the site static HTML, CSS, and light JavaScript
- Preserve simple hosting compatibility
- Avoid adding dependencies unless clearly justified

## QA Criteria

- Homepage is understandable in under 10 seconds
- Every topic is one click away from the homepage
- Mobile layout remains readable and uncluttered
- Topic pages are visibly shorter and more focused than before
- Visual hierarchy is stronger than the current flat grid

## Open Questions Resolved

- Primary homepage job: `Browse the map`
- Recommended homepage pattern: `Atlas View`
- Topic-page pattern: compact reflection structure instead of expandable card stacks
- README rewrite: approved as part of the redesign effort

## Implementation Notes

Implementation should start with the homepage and shared styles, then update representative topic pages, then apply the topic-page template to the remaining pages, then rewrite the README to match the shipped structure.
