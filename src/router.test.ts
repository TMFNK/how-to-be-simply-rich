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
