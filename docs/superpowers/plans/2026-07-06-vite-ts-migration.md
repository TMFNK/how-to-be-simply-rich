# Vite + TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this project's static multi-page HTML/JS site with a Vite + TypeScript single-page app (hash routing), Vitest tests, and GitHub Pages CI, matching the sibling `Gutenberg-Stacks` project's stack.

**Architecture:** Flat Vite project at the repo root (no `web/` subfolder — there's no data pipeline to separate it from). One `index.html` entry point mounts a `#app` div; `src/router.ts` resolves `location.hash` to a route (`home`, `topic/:slug`, `about`, `not-found`); `src/views.ts` renders each route's markup via `innerHTML` (matching the existing `topicPage.js` rendering style); `src/content.ts` holds the topic/domain data ported from `siteData.js`.

**Tech Stack:** Vite `^8.1.1`, TypeScript `~6.0.2`, Vitest `^3.2.4`, Node 22, no framework, no runtime dependencies.

## Global Constraints

- `devDependencies` versions must match exactly: `typescript: ~6.0.2`, `vite: ^8.1.1`, `vitest: ^3.2.4` (copied verbatim from `Gutenberg-Stacks/web/package.json` per the design spec's "same stack" goal).
- No runtime `dependencies` — no search library, no framework.
- `vite.config.ts` base path: `/how-to-be-simply-rich/` on build, `/` on dev.
- CI uses `node-version: 22`, deploy branch is `main` (current repo default branch, already renamed from `master`).
- No GitHub remote is created or pushed to as part of this plan (per spec, out of scope).
- All old per-topic `.html` URLs are replaced by hash routes; no redirects (spec: no live deployment exists to redirect from).

---

### Task 1: Scaffold the Vite + TypeScript project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html` (repo root — replaces the existing static one in Task 4, minimal placeholder for now)
- Create: `src/main.ts` (placeholder, replaced in Task 4)

**Interfaces:**
- Produces: a working `npm run build` / `npm run dev` / `npm test` toolchain that later tasks add real source files into.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "how-to-be-simply-rich",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.1.1",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/how-to-be-simply-rich/' : '/',
}));
```

- [ ] **Step 4: Create a placeholder `src/main.ts`**

```ts
document.body.textContent = 'scaffold ok';
```

- [ ] **Step 5: Create a placeholder root `index.html`**

Note: this file already exists as the old static homepage. Overwrite it entirely with this minimal shell for now — Task 4 replaces it again with the real app shell.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Atlas of Wealth</title>
</head>
<body>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` created, no errors.

- [ ] **Step 7: Verify the build works**

Run: `npm run build`
Expected: exits 0, creates `dist/index.html` and `dist/assets/*.js`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html src/main.ts
git commit -m "Scaffold Vite + TypeScript project"
```

---

### Task 2: Port topic/domain content into typed TypeScript

**Files:**
- Create: `src/types.ts`
- Create: `src/content.ts`
- Create: `src/content.test.ts`
- Reference (read-only, do not modify): `siteData.js` (repo root — source of the data being ported; deleted in Task 5)

**Interfaces:**
- Produces: `TopicContent` interface, `Domain` interface (from `types.ts`); `topicOrder: string[]`, `atlasDomains: Domain[]`, `topicContent: Record<string, TopicContent>` (from `content.ts`). These are consumed by Task 3 (`router.ts` needs `topicOrder`) and Task 4 (`main.ts`/`views.ts` need all three).

- [ ] **Step 1: Write the failing test — create `src/content.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { atlasDomains, topicContent, topicOrder } from './content';

const DOMAIN_NAMES = ['Inner Life', 'Relationships', 'Vitality', 'Growth', 'Living Fully'];

describe('topicOrder and topicContent', () => {
  it('has a topicContent entry for every slug in topicOrder', () => {
    for (const slug of topicOrder) {
      expect(topicContent[slug]).toBeDefined();
    }
  });

  it('every topicContent entry has all required fields', () => {
    for (const slug of topicOrder) {
      const topic = topicContent[slug];
      expect(topic.title).toBeTruthy();
      expect(topic.domain).toBeTruthy();
      expect(topic.definition).toBeTruthy();
      expect(topic.why).toBeTruthy();
      expect(topic.notice).toBeTruthy();
      expect(topic.choose).toBeTruthy();
      expect(topic.practice).toBeTruthy();
      expect(topic.prompts.length).toBeGreaterThan(0);
    }
  });
});

describe('atlasDomains', () => {
  it('has exactly the five expected domain names, in order', () => {
    expect(atlasDomains.map((d) => d.name)).toEqual(DOMAIN_NAMES);
  });

  it('places every topicOrder slug in exactly one domain', () => {
    const allDomainTopics = atlasDomains.flatMap((d) => d.topics);
    expect(allDomainTopics.slice().sort()).toEqual([...topicOrder].sort());
    expect(new Set(allDomainTopics).size).toBe(allDomainTopics.length);
  });

  it("each topic's domain field matches the domain it's listed under", () => {
    for (const domain of atlasDomains) {
      for (const slug of domain.topics) {
        expect(topicContent[slug].domain).toBe(domain.name);
      }
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/content.test.ts`
Expected: FAIL — `Cannot find module './content'` (file doesn't exist yet).

- [ ] **Step 3: Create `src/types.ts`**

```ts
export interface TopicContent {
  title: string;
  domain: string;
  definition: string;
  why: string;
  notice: string;
  choose: string;
  practice: string;
  prompts: string[];
}

export interface Domain {
  name: string;
  description: string;
  topics: string[];
}
```

- [ ] **Step 4: Create `src/content.ts`**

Port the three declarations from `siteData.js` (repo root) verbatim — same slugs, same order, same copy — adding `export`, a `Domain[]` type annotation on `atlasDomains`, and a `Record<string, TopicContent>` type annotation on `topicContent`. Read `siteData.js` in full first; the content below must match it exactly (23 topics, 5 domains).

```ts
import type { Domain, TopicContent } from './types';

export const topicOrder: string[] = [
  "time",
  "experiences",
  "connection",
  "purpose",
  "creativity",
  "adventure",
  "love",
  "family",
  "health",
  "gratitude",
  "blessings",
  "mind",
  "knowledge",
  "wisdom",
  "happiness",
  "curiosity",
  "kindness",
  "empathy",
  "contentment",
  "resilience",
  "community",
  "growth",
  "faith",
];

export const atlasDomains: Domain[] = [
  {
    name: "Inner Life",
    description: "The inner weather that shapes how you meet the world.",
    topics: ["mind", "contentment", "resilience", "faith", "wisdom"],
  },
  {
    name: "Relationships",
    description: "The forms of wealth that are built through attention, trust, and care.",
    topics: ["love", "family", "connection", "empathy", "kindness", "community"],
  },
  {
    name: "Vitality",
    description: "The conditions that give you energy, steadiness, and room to breathe.",
    topics: ["health", "time", "blessings", "gratitude"],
  },
  {
    name: "Growth",
    description: "The capacities that expand what you can understand, make, and become.",
    topics: ["knowledge", "curiosity", "creativity", "purpose", "growth"],
  },
  {
    name: "Living Fully",
    description: "The textures of a full life: memory, delight, novelty, and aliveness.",
    topics: ["adventure", "experiences", "happiness"],
  },
];

export const topicContent: Record<string, TopicContent> = {
  time: {
    title: "Time",
    domain: "Vitality",
    definition: "Time wealth means having enough space to direct your attention intentionally.",
    why: "A day can be full and still feel poor if it is fragmented beyond recognition. Time wealth is not about squeezing more in. It is about protecting what matters, reducing leakage, and making your hours look like your values.",
    notice: "Notice where your day gets spent by inertia instead of by choice.",
    choose: "Choose one block of time this week that deserves deliberate protection.",
    practice: "Put one meaningful activity on your calendar before the noise gets there first.",
    prompts: [
      "What part of your schedule feels owned by someone else?",
      "Which activity leaves you feeling more spacious afterward?",
      "What can you stop agreeing to for the next seven days?",
    ],
  },
  experiences: {
    title: "Experiences",
    domain: "Living Fully",
    definition: "Experience wealth means letting life contain texture, novelty, and memory.",
    why: "A rich life is not built from accumulation alone. It is built from moments that wake you up, teach you something, or stay with you years later. Experience wealth grows when you leave room for memorable days.",
    notice: "Notice when your weeks start to blur together into repeatable routines.",
    choose: "Choose one experience that will give this month a distinct shape.",
    practice: "Plan one specific outing, conversation, or experiment before the day ends.",
    prompts: [
      "What memory from the last year still feels alive in your body?",
      "What have you been postponing because it seems slightly inconvenient?",
      "What tiny adventure would make this week more vivid?",
    ],
  },
  connection: {
    title: "Connection",
    domain: "Relationships",
    definition: "Connection wealth means feeling genuinely linked to people, places, and reality.",
    why: "It is possible to be surrounded and still feel separate. Connection wealth comes from contact that is real enough to change your state: shared attention, honest conversation, and a sense that you are not moving through life alone.",
    notice: "Notice the difference between being updated on someone and actually feeling with them.",
    choose: "Choose one relationship that deserves more presence than convenience.",
    practice: "Send a message that opens a real exchange instead of a transactional check-in.",
    prompts: [
      "Who do you feel more yourself around?",
      "What usually interrupts your presence when you are with other people?",
      "Where in your life do you want more mutuality, not just contact?",
    ],
  },
  purpose: {
    title: "Purpose",
    domain: "Growth",
    definition: "Purpose wealth means knowing what deserves your effort right now.",
    why: "Purpose is not a grand slogan you discover once. It is a working orientation. It helps you decide what to pursue, what to refuse, and what kind of tiredness is worth it.",
    notice: "Notice which tasks drain you because they feel disconnected from any real aim.",
    choose: "Choose one responsibility that matters enough to deserve your best attention.",
    practice: "Write one sentence that explains why your current work matters to someone real.",
    prompts: [
      "What kind of contribution leaves you with clean fatigue instead of resentment?",
      "What are you saying yes to that does not belong to your deeper priorities?",
      "What would purpose look like at the scale of this week, not your whole life?",
    ],
  },
  creativity: {
    title: "Creativity",
    domain: "Growth",
    definition: "Creativity wealth means having room to make, combine, and express.",
    why: "Creativity is not reserved for artists. It is a way of relating to life that lets you shape something instead of only consuming what already exists. Creative wealth grows when you stay generative.",
    notice: "Notice how often you consume inspiration without turning any of it into output.",
    choose: "Choose one medium or problem where you want to make something imperfect but real.",
    practice: "Spend twenty focused minutes making a draft instead of collecting more inputs.",
    prompts: [
      "What do you keep wanting to make but rarely prioritize?",
      "What form of creativity feels playful rather than performative?",
      "Where have you confused polish with permission to begin?",
    ],
  },
  adventure: {
    title: "Adventure",
    domain: "Living Fully",
    definition: "Adventure wealth means choosing some uncertainty over total control.",
    why: "Adventure does not require extreme risk. It begins when you allow the unfamiliar to enter your life. A little uncertainty can restore alertness, courage, and gratitude for being alive.",
    notice: "Notice how quickly comfort becomes automatic and invisible.",
    choose: "Choose one situation where a little unpredictability would make you more awake.",
    practice: "Take a route, make a plan, or accept an invitation that slightly stretches your usual pattern.",
    prompts: [
      "What kind of risk makes you feel more alive rather than just unsafe?",
      "What would count as an adventure at your current season of life?",
      "Where are you over-optimizing for predictability?",
    ],
  },
  love: {
    title: "Love",
    domain: "Relationships",
    definition: "Love wealth means giving and receiving care with steadiness.",
    why: "Love is built less by intensity than by repeated acts of regard. Love wealth grows through presence, repair, generosity, and the willingness to let another person's wellbeing matter to you.",
    notice: "Notice the small moments when you can either turn toward someone or stay defended.",
    choose: "Choose one person to love more concretely this week.",
    practice: "Offer one act of care that reduces someone else's burden today.",
    prompts: [
      "Who feels safer because you are in their life?",
      "How do you usually withhold love when you feel tired or disappointed?",
      "What does dependable affection look like in practice?",
    ],
  },
  family: {
    title: "Family",
    domain: "Relationships",
    definition: "Family wealth means investing in the people you return to.",
    why: "Family wealth is not about perfection or sentimentality. It is about tending the ties that anchor you, whether inherited or chosen. It grows through rituals, repair, practical help, and memory.",
    notice: "Notice which family relationships feel undernourished rather than broken.",
    choose: "Choose one family bond that deserves more intentional tending.",
    practice: "Create or restart one small ritual that helps people stay in each other's lives.",
    prompts: [
      "What kind of family contact leaves you more grounded afterward?",
      "What does your family need more of: honesty, softness, or initiative?",
      "What inheritance do you want to strengthen or interrupt?",
    ],
  },
  health: {
    title: "Health",
    domain: "Vitality",
    definition: "Health wealth means having the energy to live your days well.",
    why: "Without health, many other forms of wealth become harder to enjoy or sustain. Health wealth is built through ordinary stewardship: sleep, movement, food, recovery, and the willingness to listen before the body has to shout.",
    notice: "Notice what your body has been asking for repeatedly.",
    choose: "Choose the health habit that would create the biggest downstream benefit if it stabilized.",
    practice: "Do the next obvious physical thing your future self will thank you for.",
    prompts: [
      "What behavior most affects your energy for the rest of the day?",
      "Which signal from your body have you normalized too quickly?",
      "What health action would make other good decisions easier?",
    ],
  },
  gratitude: {
    title: "Gratitude",
    domain: "Vitality",
    definition: "Gratitude wealth means noticing what is already supporting your life.",
    why: "Gratitude does not deny difficulty. It widens perception so hardship is not the only thing in view. Gratitude wealth changes the texture of a day by restoring proportion, sufficiency, and affection for what is already here.",
    notice: "Notice what you routinely benefit from without really registering it.",
    choose: "Choose one part of your life to appreciate in detail instead of in passing.",
    practice: "Name three specific supports from today and tell one person thank you.",
    prompts: [
      "What feels ordinary now that would have felt remarkable to an earlier version of you?",
      "Which person or system quietly makes your life easier every week?",
      "How does gratitude change your posture toward the rest of the day?",
    ],
  },
  blessings: {
    title: "Blessings",
    domain: "Vitality",
    definition: "Blessings wealth means recognizing gifts you did not earn alone.",
    why: "Some of what makes life possible arrives through grace, luck, timing, lineage, or help. Blessings wealth keeps you humble and receptive. It reminds you that not everything valuable is produced by effort alone.",
    notice: "Notice what in your life came partly through gift rather than control.",
    choose: "Choose one blessing you want to honor with more care.",
    practice: "Respond to one gift in your life by using it well or passing something on.",
    prompts: [
      "What advantage or tenderness have you received that still shapes your life?",
      "Which blessing have you started treating like a guarantee?",
      "How can gratitude become stewardship instead of just sentiment?",
    ],
  },
  mind: {
    title: "Mind",
    domain: "Inner Life",
    definition: "Mind wealth means cultivating clarity, attention, and inner steadiness.",
    why: "A crowded mind makes even good circumstances feel noisy. Mind wealth grows through reflection, concentration, perspective, and the habits that keep you from being dragged by every impulse or signal.",
    notice: "Notice what your attention is repeatedly getting captured by.",
    choose: "Choose one practice that helps your mind become quieter and more deliberate.",
    practice: "Spend ten uninterrupted minutes thinking, journaling, or sitting without input.",
    prompts: [
      "What currently fragments your attention the most?",
      "When do you feel mentally cleanest?",
      "What thought pattern needs less trust from you?",
    ],
  },
  knowledge: {
    title: "Knowledge",
    domain: "Growth",
    definition: "Knowledge wealth means building understanding you can apply and share.",
    why: "Information is cheap. Knowledge becomes wealth when it changes what you can see, explain, or do. It compounds through study, synthesis, and the discipline of revisiting what matters.",
    notice: "Notice the difference between collecting information and truly learning it.",
    choose: "Choose one subject worth understanding more deeply instead of skimming endlessly.",
    practice: "Study one idea long enough to explain it back in plain language.",
    prompts: [
      "What are you repeatedly curious about but only half-learning?",
      "What knowledge would genuinely improve your decisions this year?",
      "How can you turn passive intake into retained understanding?",
    ],
  },
  wisdom: {
    title: "Wisdom",
    domain: "Inner Life",
    definition: "Wisdom wealth means choosing well when life is ambiguous.",
    why: "Wisdom is not raw intelligence. It is judgment shaped by reflection, experience, patience, and humility. Wisdom wealth grows when you learn to see patterns, hold tradeoffs, and act without self-deception.",
    notice: "Notice where you are tempted to react before understanding the whole situation.",
    choose: "Choose one decision that deserves slower, calmer thinking.",
    practice: "Ask what is true, what matters, and what consequence you are underestimating.",
    prompts: [
      "Where do you already know the answer but resist it?",
      "What older lesson would help with a current problem?",
      "What would a wiser pace look like here?",
    ],
  },
  happiness: {
    title: "Happiness",
    domain: "Living Fully",
    definition: "Happiness wealth means making room for delight without making it a demand.",
    why: "Happiness is not the whole point of life, but life becomes thin when joy is always postponed. Happiness wealth grows through appreciation, play, beauty, relief, and the ability to receive good moments without suspicion.",
    notice: "Notice what reliably lifts your mood in a clean and durable way.",
    choose: "Choose one source of delight worth protecting from busyness.",
    practice: "Do one small thing today purely because it adds brightness to being alive.",
    prompts: [
      "What forms of joy leave you more open instead of more numb?",
      "Where have you made happiness too conditional?",
      "What simple pleasure have you outgrown only in theory?",
    ],
  },
  curiosity: {
    title: "Curiosity",
    domain: "Growth",
    definition: "Curiosity wealth means staying interested enough to keep learning.",
    why: "Curiosity keeps life from becoming inert. It fuels growth, conversation, humility, and surprise. Curious people notice more, ask better questions, and stay responsive to a changing world.",
    notice: "Notice where certainty has made you less observant than you think.",
    choose: "Choose one question that deserves exploration rather than a quick opinion.",
    practice: "Follow one thread of interest until you discover something you did not expect.",
    prompts: [
      "What topic have you secretly wanted to understand better?",
      "What question would make a conversation more alive?",
      "Where has defensiveness replaced interest?",
    ],
  },
  kindness: {
    title: "Kindness",
    domain: "Relationships",
    definition: "Kindness wealth means making life gentler for the people around you.",
    why: "Kindness is a form of practical abundance. It creates ease, dignity, and repair where harshness would multiply friction. Kindness wealth grows through habits of warmth, patience, and consideration.",
    notice: "Notice the moments where a small softness would materially improve someone's day.",
    choose: "Choose one setting where you want to be remembered as easier to be around.",
    practice: "Do one generous thing that costs little but changes the emotional temperature.",
    prompts: [
      "What does kindness look like when you are busy?",
      "Whom have you been treating with efficiency instead of warmth?",
      "How can you make your care more visible, not just assumed?",
    ],
  },
  empathy: {
    title: "Empathy",
    domain: "Relationships",
    definition: "Empathy wealth means sensing another person's experience without collapsing your own.",
    why: "Empathy widens your world. It helps you respond with accuracy instead of projection. Empathy wealth grows when you become more capable of listening, imagining, and making room for realities other than your own.",
    notice: "Notice when you start preparing your answer before the other person has really finished.",
    choose: "Choose one relationship where better understanding would matter more than being right.",
    practice: "Ask one follow-up question that helps someone feel more accurately seen.",
    prompts: [
      "What is harder for you: understanding pain or understanding difference?",
      "Where do you tend to substitute advice for attention?",
      "What would change if you assumed the other person makes sense from inside their experience?",
    ],
  },
  contentment: {
    title: "Contentment",
    domain: "Inner Life",
    definition: "Contentment wealth means feeling enoughness in the middle of ordinary life.",
    why: "Contentment is not passivity. It is freedom from the reflex that says life can only begin after the next acquisition or achievement. Contentment wealth makes the present inhabitable while you continue to grow.",
    notice: "Notice what your mind keeps insisting must change before you can relax.",
    choose: "Choose one area where enough would be healthier than more.",
    practice: "Pause long enough to enjoy one ordinary good thing without improving it.",
    prompts: [
      "What desire keeps promising relief but never quite delivers it?",
      "Where in your life is there already more than enough?",
      "What does sufficiency feel like in your body?",
    ],
  },
  resilience: {
    title: "Resilience",
    domain: "Inner Life",
    definition: "Resilience wealth means recovering without hardening.",
    why: "Resilience is not pretending things do not hurt. It is the capacity to bend, adapt, and repair while keeping your humanity intact. Resilience wealth is built through support, perspective, and repeated recovery.",
    notice: "Notice how you respond after setbacks: collapse, denial, or repair.",
    choose: "Choose one recovery habit that helps you return to yourself faster.",
    practice: "After the next stress spike, do one action that restores steadiness before you problem-solve.",
    prompts: [
      "What reliably helps you come back after a difficult day?",
      "Where have you confused toughness with resilience?",
      "Who helps you recover without pretending?",
    ],
  },
  community: {
    title: "Community",
    domain: "Relationships",
    definition: "Community wealth means belonging to circles of mutual care.",
    why: "Community turns private life into shared life. It gives support, accountability, celebration, and continuity. Community wealth grows when you participate instead of only consuming what others organize.",
    notice: "Notice where you already have weak ties that could become real belonging.",
    choose: "Choose one circle you want to contribute to instead of merely attending.",
    practice: "Make one concrete contribution that helps a group become more alive or functional.",
    prompts: [
      "Where do you feel welcomed, useful, and known?",
      "What kind of community do you wish existed more strongly around you?",
      "What would belonging require from you, not just provide to you?",
    ],
  },
  growth: {
    title: "Growth",
    domain: "Growth",
    definition: "Growth wealth means becoming more capable without losing your center.",
    why: "Growth is healthy when it enlarges your life rather than keeping you in permanent self-revision. Growth wealth is built through deliberate challenge, reflection, and the patience to improve over time.",
    notice: "Notice whether your current effort is stretching you or merely exhausting you.",
    choose: "Choose one edge where development would genuinely expand your life.",
    practice: "Take one repeatable step that moves you from intention into skill.",
    prompts: [
      "What kind of person are you trying to become through your current habits?",
      "Where would steady improvement matter more than intensity?",
      "What evidence would show that you are actually growing?",
    ],
  },
  faith: {
    title: "Faith",
    domain: "Inner Life",
    definition: "Faith wealth means trusting that meaning can exist beyond immediate proof.",
    why: "Faith is not only religious conviction. It can also mean trust, orientation, and a willingness to keep walking when certainty is unavailable. Faith wealth steadies action in seasons where evidence arrives slowly.",
    notice: "Notice where you demand certainty before taking the next honest step.",
    choose: "Choose one area where trust is healthier than endless control.",
    practice: "Take one small faithful action even if the whole path is still unclear.",
    prompts: [
      "What do you lean on when outcomes are uncertain?",
      "Where has fear disguised itself as rational delay?",
      "What would trust look like in practice this week?",
    ],
  },
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/content.test.ts`
Expected: PASS (10 tests).

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/content.ts src/content.test.ts
git commit -m "Port topic and domain content into typed content.ts"
```

---

### Task 3: Hash router

**Files:**
- Create: `src/router.ts`
- Create: `src/router.test.ts`

**Interfaces:**
- Consumes: `topicOrder: string[]` (from Task 2's `content.ts`, used only in the test as the valid-slugs list — `resolveRoute` itself takes slugs as a parameter, no import of `content.ts` needed in `router.ts` itself, keeping it decoupled).
- Produces: `Route` type (`{ name: 'home' } | { name: 'topic'; slug: string } | { name: 'about' } | { name: 'not-found' }`) and `resolveRoute(hash: string, validSlugs: string[]): Route`. Consumed by Task 4's `main.ts`.

- [ ] **Step 1: Write the failing test — create `src/router.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { resolveRoute } from './router';

const slugs = ['time', 'love'];

describe('resolveRoute', () => {
  it('resolves an empty hash to home', () => {
    expect(resolveRoute('', slugs)).toEqual({ name: 'home' });
  });

  it('resolves "#/" to home', () => {
    expect(resolveRoute('#/', slugs)).toEqual({ name: 'home' });
  });

  it('resolves "#/about" to about', () => {
    expect(resolveRoute('#/about', slugs)).toEqual({ name: 'about' });
  });

  it('resolves a known topic slug', () => {
    expect(resolveRoute('#/topic/time', slugs)).toEqual({ name: 'topic', slug: 'time' });
  });

  it('resolves an unknown topic slug to not-found', () => {
    expect(resolveRoute('#/topic/nope', slugs)).toEqual({ name: 'not-found' });
  });

  it('resolves an unrecognized path to not-found', () => {
    expect(resolveRoute('#/nonsense', slugs)).toEqual({ name: 'not-found' });
  });

  it('URL-decodes the topic slug', () => {
    expect(resolveRoute('#/topic/t%69me', slugs)).toEqual({ name: 'topic', slug: 'time' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/router.test.ts`
Expected: FAIL — `Cannot find module './router'`.

- [ ] **Step 3: Create `src/router.ts`**

```ts
export type Route =
  | { name: 'home' }
  | { name: 'topic'; slug: string }
  | { name: 'about' }
  | { name: 'not-found' };

export function resolveRoute(hash: string, validSlugs: string[]): Route {
  const path = hash.replace(/^#/, '') || '/';

  if (path === '/') return { name: 'home' };
  if (path === '/about') return { name: 'about' };

  if (path.startsWith('/topic/')) {
    const slug = decodeURIComponent(path.slice('/topic/'.length));
    if (validSlugs.includes(slug)) return { name: 'topic', slug };
    return { name: 'not-found' };
  }

  return { name: 'not-found' };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/router.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/router.ts src/router.test.ts
git commit -m "Add hash router"
```

---

### Task 4: Views, app shell, and styles

**Files:**
- Create: `src/views.ts`
- Modify: `src/main.ts` (replace Task 1's placeholder)
- Modify: `index.html` (repo root — replace Task 1's placeholder with the real app shell)
- Create: `src/style.css` (copy of the existing root `styles.css`, unchanged content)
- Reference (read-only): `styles.css` (repo root — copied verbatim, not modified; deleted in Task 5)

**Interfaces:**
- Consumes: `Domain`, `TopicContent` (from `src/types.ts`), `topicOrder`, `atlasDomains`, `topicContent` (from `src/content.ts`), `Route`, `resolveRoute` (from `src/router.ts`).
- Produces: `renderHome(mount, domains)`, `renderTopic(mount, topic, previousSlug, nextSlug)`, `renderAbout(mount)`, `renderNotFound(mount)` (from `views.ts`) — these are the last new interfaces in this plan; no later task consumes them.

- [ ] **Step 1: Copy `styles.css` to `src/style.css`**

Read `styles.css` (repo root) in full and write its exact contents, unchanged, to `src/style.css`.

- [ ] **Step 2: Create `src/views.ts`**

```ts
import type { Domain, TopicContent } from './types';

const DOMAIN_LABELS = ['Domain One', 'Domain Two', 'Domain Three', 'Domain Four', 'Domain Five'];

function capitalize(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function renderHome(mount: HTMLElement, domains: Domain[]): void {
  const panels = domains
    .map((domain, index) => {
      const topics = domain.topics
        .map((slug) => `<a class="topic-link" href="#/topic/${slug}">${capitalize(slug)}</a>`)
        .join('\n          ');
      return `
      <section class="domain-panel">
        <p class="eyebrow">${DOMAIN_LABELS[index]}</p>
        <h2>${domain.name}</h2>
        <p>${domain.description}</p>
        <div class="topic-list">
          ${topics}
        </div>
      </section>`;
    })
    .join('\n');

  mount.innerHTML = `
    <header class="hero">
      <p class="eyebrow">Atlas of Wealth</p>
      <h1 class="hero-title">A map of the kinds of wealth that make a life feel full.</h1>
      <p class="lede">Browse the domains, choose one area, and use it as a lens for today. The goal is not to consume everything. It is to see the shape of a rich life more clearly.</p>
    </header>

    <main class="atlas" aria-label="Atlas domains">
      ${panels}
    </main>

    <section class="utility-strip" aria-label="Atlas utilities">
      <a class="utility-link" href="#" data-random-topic="true">Open a random area</a>
      <a class="utility-link" href="#/about">Read the philosophy</a>
      <a class="utility-link" href="#/about">How to use this site</a>
    </section>

    <p class="closing-note">True wealth is easier to miss when every category looks equally urgent. This atlas slows the scan down and gives the idea a shape.</p>
  `;
}

export function renderTopic(
  mount: HTMLElement,
  topic: TopicContent,
  previousSlug: string,
  nextSlug: string,
): void {
  const prompts = topic.prompts.map((prompt) => `<li>${prompt}</li>`).join('');

  mount.innerHTML = `
    <section class="topic-shell">
      <p class="eyebrow">${topic.domain}</p>
      <h1 class="page-title">Rich in ${topic.title}</h1>
      <p class="lede">${topic.definition}</p>

      <section class="topic-block">
        <h2>Why it matters</h2>
        <p>${topic.why}</p>
      </section>

      <section class="practice-grid" aria-label="Practice structure">
        <article class="practice-card">
          <p class="practice-label">Notice</p>
          <p>${topic.notice}</p>
        </article>
        <article class="practice-card">
          <p class="practice-label">Choose</p>
          <p>${topic.choose}</p>
        </article>
        <article class="practice-card">
          <p class="practice-label">Practice</p>
          <p>${topic.practice}</p>
        </article>
      </section>

      <section class="topic-block">
        <h2>Reflection prompts</h2>
        <ul class="prompt-list">
          ${prompts}
        </ul>
      </section>

      <nav class="page-nav" aria-label="Topic navigation">
        <a class="utility-link" href="#/">Back to atlas</a>
        <a class="utility-link" href="#/topic/${previousSlug}">Previous area</a>
        <a class="utility-link" href="#" data-random-topic="true">Random area</a>
        <a class="utility-link" href="#/topic/${nextSlug}">Next area</a>
      </nav>
    </section>
  `;
}

export function renderAbout(mount: HTMLElement): void {
  mount.innerHTML = `
    <main class="about-layout">
      <section class="about-card about-hero">
        <p class="eyebrow">What this is</p>
        <h1 class="page-title">A quiet atlas for forms of wealth that money cannot hold on its own.</h1>
        <p class="lede">The project began with a simple question: what else should a person want to be rich in? The answer was not one thing. It was a landscape. This site maps the kinds of wealth that make a life feel fuller, steadier, and more humane.</p>
      </section>

      <section class="about-card" id="how-to-use">
        <h2>How to use this atlas</h2>
        <p>Browse the domains on the homepage until one area feels timely. Choose one area, open the page, and stay there long enough to absorb the definition, the why, and the three-part practice. The site is designed for one page at a time, not for binge-reading.</p>
      </section>

      <section class="about-card">
        <h2>How to browse</h2>
        <p>Some days you will know what you need. Other days it helps to scan the whole map first. Use the atlas when you want orientation. Use the random choice when you want surprise. Both paths are valid, but the structure is meant to make the full terrain easier to understand at a glance.</p>
      </section>

      <section class="about-card">
        <h2>Why these categories exist</h2>
        <p>The domains group ideas that support each other. Inner Life shapes your attention. Relationships shape belonging. Vitality shapes energy. Growth shapes capacity. Living Fully shapes memory and aliveness. None of them stand alone for long.</p>
      </section>

      <section class="about-card">
        <h2>Support and credits</h2>
        <p>Created by TMFNK. Based on Kashcha.</p>
      </section>
    </main>
  `;
}

export function renderNotFound(mount: HTMLElement): void {
  mount.innerHTML = `
    <section class="topic-shell">
      <p class="eyebrow">Not Found</p>
      <h1 class="page-title">This page is missing from the atlas.</h1>
      <p class="lede">Return to the homepage and choose another area.</p>
      <div class="page-nav">
        <a class="utility-link" href="#/">Back to atlas</a>
      </div>
    </section>
  `;
}
```

Note: the original per-page navs differed slightly (home had About/Random links, topic pages had Atlas/About, about.html had Atlas/"Start anywhere"). The SPA shell uses one persistent nav (About/Random) across all routes — the "Back to atlas" link inside each view covers the Atlas-link use case. This is a deliberate small consolidation, not an oversight.

- [ ] **Step 3: Replace `src/main.ts`**

```ts
import './style.css';
import { atlasDomains, topicContent, topicOrder } from './content';
import { resolveRoute } from './router';
import { renderAbout, renderHome, renderNotFound, renderTopic } from './views';

function goToRandomTopic(): void {
  const randomSlug = topicOrder[Math.floor(Math.random() * topicOrder.length)];
  location.hash = `#/topic/${randomSlug}`;
}

function wireRandomLinks(root: ParentNode): void {
  root.querySelectorAll('[data-random-topic]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      goToRandomTopic();
    });
  });
}

function render(): void {
  const mount = document.getElementById('app')!;
  const route = resolveRoute(location.hash, topicOrder);

  if (route.name === 'home') {
    renderHome(mount, atlasDomains);
    document.title = 'Atlas of Wealth';
  } else if (route.name === 'about') {
    renderAbout(mount);
    document.title = 'Atlas of Wealth - About';
  } else if (route.name === 'topic') {
    const topic = topicContent[route.slug];
    const currentIndex = topicOrder.indexOf(route.slug);
    const previousSlug = topicOrder[(currentIndex - 1 + topicOrder.length) % topicOrder.length];
    const nextSlug = topicOrder[(currentIndex + 1) % topicOrder.length];
    renderTopic(mount, topic, previousSlug, nextSlug);
    document.title = `Atlas of Wealth - ${topic.title}`;
  } else {
    renderNotFound(mount);
    document.title = 'Atlas of Wealth - Not Found';
  }

  wireRandomLinks(mount);
}

wireRandomLinks(document);
window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});
render();
```

- [ ] **Step 4: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TXT6313TGG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TXT6313TGG');
</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Atlas of Wealth</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="page-frame">
    <nav class="site-nav" aria-label="Primary">
      <a class="site-mark" href="#/">Atlas of Wealth</a>
      <div class="site-links">
        <a class="utility-link" href="#/about">About</a>
        <a class="utility-link" href="#" data-random-topic="true">Random</a>
      </div>
    </nav>
    <div id="app" aria-live="polite"></div>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS (all `content.test.ts` and `router.test.ts` tests, 17 total).

- [ ] **Step 6: Run the build**

Run: `npm run build`
Expected: exits 0, no TypeScript errors, `dist/index.html` and `dist/assets/*.js` produced.

- [ ] **Step 7: Manually verify in a browser**

Start the dev server (`npm run dev`), then check:
- `#/` shows the five domain panels with correct topic links.
- Clicking a topic link (e.g. Time) navigates to `#/topic/time` and shows its definition/why/practice/prompts.
- Previous/Next links on a topic page cycle correctly (verify wraparound: first topic's Previous goes to the last topic, last topic's Next goes to the first).
- Random (nav and in-page) jumps to a topic page.
- About (nav link and "Read the philosophy") shows the about content.
- An unknown hash (e.g. `#/topic/nope`) shows the not-found view.
- Browser back/forward buttons work (hash changes are history entries by default).

- [ ] **Step 8: Commit**

```bash
git add src/views.ts src/main.ts src/style.css index.html
git commit -m "Add views, app shell, and hash-routed navigation"
```

---

### Task 5: Remove legacy static site files

**Files:**
- Delete: `siteData.js`, `homepage.js`, `topicPage.js`, `richThings.js`, `styles.css` (repo root)
- Delete: `about.html` and all 23 per-topic `.html` files (`time.html`, `experiences.html`, `connection.html`, `purpose.html`, `creativity.html`, `adventure.html`, `love.html`, `family.html`, `health.html`, `gratitude.html`, `blessings.html`, `mind.html`, `knowledge.html`, `wisdom.html`, `happiness.html`, `curiosity.html`, `kindness.html`, `empathy.html`, `contentment.html`, `resilience.html`, `community.html`, `growth.html`, `faith.html`)
- Delete: `tests/test_site_structure.py`, `tests/__init__.py`, and the now-empty `tests/` directory

**Interfaces:** None — pure deletion, no new interfaces.

- [ ] **Step 1: Delete the legacy JS and CSS files**

```bash
git rm siteData.js homepage.js topicPage.js richThings.js styles.css
```

- [ ] **Step 2: Delete the legacy HTML pages**

```bash
git rm about.html time.html experiences.html connection.html purpose.html \
  creativity.html adventure.html love.html family.html health.html \
  gratitude.html blessings.html mind.html knowledge.html wisdom.html \
  happiness.html curiosity.html kindness.html empathy.html contentment.html \
  resilience.html community.html growth.html faith.html
```

- [ ] **Step 3: Delete the Python test suite**

```bash
git rm tests/test_site_structure.py tests/__init__.py
rmdir tests
```

- [ ] **Step 4: Verify nothing references the deleted files**

Run: `grep -rl "siteData\|homepage.js\|topicPage.js\|richThings" --include="*.html" --include="*.ts" .`
Expected: no output (the only remaining `.html` is the new root `index.html`, which doesn't reference any of these).

- [ ] **Step 5: Verify build and tests still pass**

Run: `npm run build && npm test`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git commit -m "Remove legacy static site files superseded by the Vite app"
```

---

### Task 6: Update docs (README, AGENTS.md, CONTRIBUTING.md)

**Files:**
- Modify: `README.md`
- Create: `AGENTS.md`
- Create: `CONTRIBUTING.md`

**Interfaces:** None — documentation only.

- [ ] **Step 1: Update `README.md`'s "Project Structure" section**

Replace the existing "Project Structure" section (the bullet list starting with `index.html: atlas homepage`) with:

```markdown
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
```

- [ ] **Step 2: Update `README.md`'s "Editing Content" section**

Replace the existing "Editing Content" section with:

```markdown
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
```

- [ ] **Step 3: Update `README.md`'s "Running Checks" section**

Replace:

```markdown
Run the structural verification suite with:

​```bash
python3 -m unittest tests/test_site_structure.py -v
​```

This project remains a simple static site and can be served by any static hosting setup.
```

With:

```markdown
Install dependencies once with `npm install`, then:

​```bash
npm run dev     # local dev server
npm test        # Vitest unit tests
npm run build   # type-check + production build to dist/
​```
```

(Use literal triple-backtick fences, not the escaped `​```` shown here — the escaping above is only to avoid breaking this plan document's own code fences.)

- [ ] **Step 4: Create `AGENTS.md`**

```markdown
## Learned Workspace Facts

- Atlas of Wealth is a static Vite + TypeScript single-page app, deployed to GitHub Pages. There is no backend and no data pipeline — all content is hand-authored directly in `src/content.ts`.
- Routing is hash-based (`#/`, `#/topic/<slug>`, `#/about`); there are no server-side routes and no per-topic `.html` files.
- `.claude/` is gitignored.
```

- [ ] **Step 5: Create `CONTRIBUTING.md`**

```markdown
# Contributing to Atlas of Wealth

Thanks for considering a contribution. This is a small, static-site project — the bar for pitching in is low.

## Getting set up

`npm install && npm run dev`.

## Before opening a PR

- `npm run build` (type-checks with `tsc` and builds with Vite) and `npm test` (Vitest) must pass.
- Keep changes scoped — small, focused PRs are much easier to review than ones that mix a fix with a refactor.
- Match the existing code style (no linter/formatter is enforced yet; read the surrounding file and follow it).
- If you change frontend behavior, describe how you tested it manually (this repo has no end-to-end test suite).

## Reporting bugs / suggesting features

Open a GitHub issue with what you expected vs. what happened (bugs), or the problem you're trying to solve (features).
```

- [ ] **Step 6: Commit**

```bash
git add README.md AGENTS.md CONTRIBUTING.md
git commit -m "Update docs for the Vite + TypeScript stack"
```

---

### Task 7: `.gitignore` and GitHub Actions deploy workflow

**Files:**
- Create: `.gitignore`
- Create: `.github/workflows/deploy.yml`

**Interfaces:** None.

- [ ] **Step 1: Create `.gitignore`**

```
node_modules
dist
.DS_Store
.claude/
```

- [ ] **Step 2: Check for already-tracked files that should now be ignored**

Run: `git status --short`
Expected: `node_modules/`, `dist/`, and `.DS_Store` (if present) show as untracked or are already absent from tracking — none should appear as tracked files needing `git rm --cached`. `.claude/settings.local.json` was never committed (first commit in this repo was Task-1-era `git init`, and `.claude/` was not added in any prior `git add`), so no cached removal is needed. If `git status` shows any of these as tracked, stop and report it rather than silently removing tracked files.

- [ ] **Step 3: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore .github/workflows/deploy.yml
git commit -m "Add .gitignore and GitHub Pages deploy workflow"
```

---

### Task 8: Final verification

**Files:** None — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS, all tests green.

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Confirm the working tree is clean**

Run: `git status`
Expected: `nothing to commit, working tree clean` (everything from Tasks 1-7 committed).

- [ ] **Step 4: Confirm the repo has no leftover legacy files**

Run: `git ls-files | grep -E '\.(html)$'`
Expected: only `index.html`.

Run: `git ls-files | grep -E '\.js$'`
Expected: no output (all legacy `.js` files removed; app code is `.ts`).
