import assert from 'node:assert/strict';
import test from 'node:test';

import { experiences } from '../../app/data/portfolio-data.js';
import { siteProfile } from '../../app/data/site-profile.mjs';
import {
  buildPersonJsonLd,
  renderLlmsTxt,
  renderNotFoundMarkdown,
  renderPortfolioMarkdown,
  serializeJsonLd,
} from '../../app/lib/agent-content.mjs';

const portfolio = {
  experiences: [
    {
      title: 'Engineer',
      company: 'Example Org',
      duration: 'Present',
      description: 'Builds open-source systems.',
    },
  ],
  projects: [
    {
      title: 'Example Project',
      description: 'A useful project.',
      technologies: ['Next.js'],
      github: 'https://github.com/example/project',
    },
  ],
  skills: {
    technical: [{ category: 'WEB', items: [{ name: 'TypeScript' }] }],
    soft: ['Communication'],
  },
};

test('portfolio Markdown identifies Gautam and requires confirmation for contact actions', () => {
  const markdown = renderPortfolioMarkdown({ profile: siteProfile, ...portfolio });

  assert.match(markdown, /^# Gautam Manchandani/m);
  assert.match(markdown, /## When to use this portfolio/);
  assert.match(markdown, /explicit user confirmation/i);
  assert.match(markdown, /Example Project/);
  assert.ok(markdown.length > 500);
});

test('Shopstr experience shows the full-time promotion after the SWE internship', () => {
  const markdown = renderPortfolioMarkdown({
    profile: siteProfile,
    experiences,
    projects: [],
    skills: { technical: [], soft: [] },
  });
  const shopstrRoles = experiences
    .filter((item) => item.company === 'Shopstr')
    .map(({ title, duration }) => ({ title, duration }));

  assert.match(siteProfile.statusLine, /^Engineer @Shopstr \|/);
  assert.deepEqual(shopstrRoles, [
    { title: 'Open Source Bitcoin Engineer', duration: 'Aug 2026 - Present' },
    { title: 'SWE Intern', duration: 'Sep 2025 - Jul 2026' },
  ]);
  assert.ok(
    markdown.indexOf('Open Source Bitcoin Engineer, Shopstr') <
      markdown.indexOf('SWE Intern, Shopstr')
  );
  assert.match(markdown, /full-time/i);
});

test('llms.txt follows v2 ordering and uses link lists after H2 headings', () => {
  const body = renderLlmsTxt(siteProfile);
  const lines = body.trim().split('\n');

  assert.match(lines[0], /^# /);
  assert.match(lines[2], /^> /);
  assert.ok(body.indexOf('**When to use this site:**') < body.indexOf('\n## '));

  for (const section of body.split(/^## /m).slice(1)) {
    const entries = section.split('\n').slice(1).filter(Boolean);
    assert.ok(entries.length > 0);
    assert.ok(entries.every((line) => /^- \[[^\]]+\]\(https:\/\//.test(line)));
  }
});

test('Markdown 404 includes recovery links', () => {
  const body = renderNotFoundMarkdown(siteProfile);

  assert.match(body, /^# 404: Page not found/m);
  assert.match(body, /\/sitemap\.xml/);
  assert.match(body, /\/llms\.txt/);
});

test('Person JSON-LD contains public identity fields and serializes safely', () => {
  const jsonLd = buildPersonJsonLd(siteProfile);

  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(jsonLd['@type'], 'Person');
  assert.equal(jsonLd.name, 'Gautam Manchandani');
  assert.equal(jsonLd.url, 'https://www.gautambytes.in');
  assert.ok(jsonLd.sameAs.includes('https://github.com/GautamBytes'));
  assert.doesNotThrow(() => JSON.parse(serializeJsonLd(jsonLd)));
  assert.equal(serializeJsonLd({ value: '</script>' }).includes('</script>'), false);
});
