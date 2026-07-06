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
