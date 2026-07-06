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
