# Atlas Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat topic-picker site with an atlas-style homepage, a shared compact topic-page template, and a rewritten README that documents the new structure.

**Architecture:** Keep the project static. Move the information model into a shared JavaScript data file, render the homepage atlas from domain/topic data, and render each topic page from one shared topic-page script keyed by the current filename. Add lightweight structural tests so the redesign can be verified without a browser framework.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Python `unittest`

---

## Chunk 1: Structural Verification

### Task 1: Add failing structural tests

**Files:**
- Create: `tests/test_site_structure.py`
- Verify against: `index.html`, `about.html`, `README.md`, `siteData.js`

- [ ] **Step 1: Write the failing test**

Add tests that assert:
- homepage contains the five atlas domain headings
- homepage links to all topic pages including `faith.html`
- topic data defines `notice`, `choose`, and `practice` for each topic
- about page includes clear usage guidance
- README describes the atlas model

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the current homepage, README, and shared data file do not match the new structure.

## Chunk 2: Shared Content Model

### Task 2: Create a shared data source for the atlas and topic pages

**Files:**
- Create: `siteData.js`
- Modify: `richThings.js`

- [ ] **Step 1: Write the failing test**

Extend the structural test to require:
- five domains with descriptions
- ordered topic list
- complete topic metadata for all topic pages

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the shared data file is missing.

- [ ] **Step 3: Write minimal implementation**

Create `siteData.js` with:
- `topicOrder`
- `atlasDomains`
- `topicContent`

Update `richThings.js` to include `faith` and keep the random-topic list aligned with `topicOrder`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: PASS for shared-data assertions, with other end-state assertions still failing until later tasks finish.

## Chunk 3: Homepage and Topic Renderer

### Task 3: Replace the homepage with the atlas view

**Files:**
- Modify: `index.html`
- Create: `homepage.js`
- Modify: `styles.css`

- [ ] **Step 1: Write the failing test**

Assert that the homepage contains:
- atlas intro copy
- five domain panels
- topic links grouped by domain
- utility links for random and about

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the current homepage is still a flat grid.

- [ ] **Step 3: Write minimal implementation**

Rewrite `index.html` as a shell page with semantic sections and ids.
Use `homepage.js` to render atlas panels from `siteData.js`.
Update `styles.css` to define the atlas visual system.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: Homepage assertions PASS.

### Task 4: Replace all topic pages with one shared compact template

**Files:**
- Create: `topicPage.js`
- Modify: `time.html`
- Modify: `experiences.html`
- Modify: `connection.html`
- Modify: `purpose.html`
- Modify: `creativity.html`
- Modify: `adventure.html`
- Modify: `love.html`
- Modify: `family.html`
- Modify: `health.html`
- Modify: `gratitude.html`
- Modify: `blessings.html`
- Modify: `mind.html`
- Modify: `knowledge.html`
- Modify: `wisdom.html`
- Modify: `happiness.html`
- Modify: `curiosity.html`
- Modify: `kindness.html`
- Modify: `empathy.html`
- Modify: `contentment.html`
- Modify: `resilience.html`
- Modify: `community.html`
- Modify: `growth.html`
- Modify: `faith.html`

- [ ] **Step 1: Write the failing test**

Assert that each topic page includes:
- shared shell hooks for the renderer
- topic navigation
- compact reflection structure via shared content keys

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the topic pages still contain old card stacks.

- [ ] **Step 3: Write minimal implementation**

Create `topicPage.js` to infer the slug from the filename and render:
- heading
- definition
- why-it-matters paragraph
- `Notice`, `Choose`, `Practice`
- reflection prompts
- atlas/random/prev-next navigation

Replace all topic HTML files with the same lightweight shell that mounts the renderer.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: Topic-page assertions PASS.

## Chunk 4: Philosophy and Documentation

### Task 5: Rewrite the about page

**Files:**
- Modify: `about.html`

- [ ] **Step 1: Write the failing test**

Assert that `about.html` explains:
- what the atlas is
- how to browse it
- how to use one page at a time

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the current page is more origin-story oriented.

- [ ] **Step 3: Write minimal implementation**

Rewrite `about.html` into a concise philosophy and usage page that matches the new structure.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: About-page assertions PASS.

### Task 6: Rewrite the README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**

Assert that `README.md` includes:
- atlas framing
- domain structure
- static file structure
- basic edit instructions

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: FAIL because the README still describes the old topic-picker framing.

- [ ] **Step 3: Write minimal implementation**

Rewrite the README around the shipped atlas architecture and authoring workflow.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: README assertions PASS.

## Chunk 5: Final Verification

### Task 7: Run full verification

**Files:**
- Verify: `tests/test_site_structure.py`
- Verify: `index.html`, `about.html`, topic pages, `README.md`

- [ ] **Step 1: Run the full test suite**

Run: `python3 -m unittest tests/test_site_structure.py -v`
Expected: PASS

- [ ] **Step 2: Run a static sanity check**

Run: `python3 -m py_compile tests/test_site_structure.py`
Expected: PASS

- [ ] **Step 3: Sanity-check rendered file references**

Run: `python3 - <<'PY'\nfrom pathlib import Path\npages = [p.name for p in Path('.').glob('*.html')]\nprint('\\n'.join(sorted(pages)))\nPY`
Expected: topic pages, `index.html`, and `about.html` all present.

