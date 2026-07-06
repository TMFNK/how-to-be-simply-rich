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
