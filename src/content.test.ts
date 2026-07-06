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
