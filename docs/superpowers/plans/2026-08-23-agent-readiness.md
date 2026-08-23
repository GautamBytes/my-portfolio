# Agent Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio serve safe, useful, standards-compliant representations to agents while preserving the current human-facing design and behavior.

**Architecture:** Keep identity and agent guidance in a shared ESM data module, then derive homepage Markdown, llms.txt, and Person JSON-LD from it. Use a Next.js 16 proxy for RFC-aware `Accept` negotiation, route handlers for machine-readable responses, and a server-rendered custom 404 for browsers.

**Tech Stack:** Next.js 16.2.9 App Router, React 18, JavaScript/ESM, Node.js built-in test runner, Vercel-compatible HTTP responses.

## Global Constraints

- Preserve the current human-facing layout, interactions, contact form contract, and visual design.
- Do not expose private contact information or let agents submit contact actions without explicit user confirmation.
- Do not change `/api/contact` or `/api/youtube` behavior.
- Do not add runtime or test dependencies; use Node's built-in test runner and `fetch`.
- Use the Next.js 16 `proxy.js` convention, not deprecated `middleware.js`.
- Follow RFC 9110 selection rules for quality values, specificity, client order, and `q=0`.
- Serve negotiated Markdown as `text/markdown; charset=utf-8` and include `Accept` in `Vary` without deleting Next.js tokens.
- Follow the llms.txt v2 section order.
- Treat deployment as out of scope; verify production as a baseline and local production-build endpoints as the implementation result.

## File Map

- Create `app/data/site-profile.mjs`: canonical identity, biography, public profiles, best-fit work, and agent safety policy.
- Create `app/lib/agent-content.mjs`: pure Markdown, llms.txt, JSON-LD, and safe JSON serialization functions.
- Create `app/lib/content-negotiation.mjs`: pure `Accept` parser, representation selector, and `Vary` helper.
- Create `proxy.js`: page-request negotiation and Markdown rewrite.
- Create `app/api/markdown/[[...slug]]/route.js`: Markdown homepage and Markdown 404 responses.
- Create `app/llms.txt/route.js`: llms.txt response.
- Create `app/not-found.js`: useful HTML 404 UI.
- Modify `app/page.js`: shared biography, identity-bearing H1, and Person JSON-LD.
- Modify `app/layout.js`: canonical production metadata URL from shared profile data.
- Create `tests/agent-content.test.mjs`: machine-readable content unit tests.
- Create `tests/content-negotiation.test.mjs`: negotiation unit tests.
- Create `tests/http-agent-readiness.test.mjs`: built-app endpoint tests.
- Create `scripts/run-http-tests.mjs`: production-server test harness.
- Modify `package.json`: unit, HTTP, and complete check scripts.

---

### Task 1: Shared identity and machine-readable content

**Files:**
- Create: `app/data/site-profile.mjs`
- Create: `app/lib/agent-content.mjs`
- Create: `tests/agent-content.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `siteProfile: Readonly<object>`
- Produces: `renderPortfolioMarkdown({ profile, experiences, projects, skills }): string`
- Produces: `renderLlmsTxt(profile): string`
- Produces: `renderNotFoundMarkdown(profile): string`
- Produces: `buildPersonJsonLd(profile): object`
- Produces: `serializeJsonLd(value): string`

- [ ] **Step 1: Add the unit-test script and failing content tests**

Set these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node --test tests/*.test.mjs",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "check": "npm test && npm run lint && npm run typecheck && npm run build"
  }
}
```

Create `tests/agent-content.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import { siteProfile } from '../app/data/site-profile.mjs';
import {
  buildPersonJsonLd,
  renderLlmsTxt,
  renderNotFoundMarkdown,
  renderPortfolioMarkdown,
  serializeJsonLd,
} from '../app/lib/agent-content.mjs';

const portfolio = {
  experiences: [{ title: 'Engineer', company: 'Example Org', duration: 'Present', description: 'Builds open-source systems.' }],
  projects: [{ title: 'Example Project', description: 'A useful project.', technologies: ['Next.js'], github: 'https://github.com/example/project' }],
  skills: { technical: [{ category: 'WEB', items: [{ name: 'TypeScript' }] }], soft: ['Communication'] },
};

test('portfolio Markdown identifies Gautam and requires confirmation for contact actions', () => {
  const markdown = renderPortfolioMarkdown({ profile: siteProfile, ...portfolio });
  assert.match(markdown, /^# Gautam Manchandani/m);
  assert.match(markdown, /## When to use this portfolio/);
  assert.match(markdown, /explicit user confirmation/i);
  assert.match(markdown, /Example Project/);
  assert.ok(markdown.length > 500);
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/data/site-profile.mjs`.

- [ ] **Step 3: Add the shared profile data**

Create `app/data/site-profile.mjs`:

```js
export const siteProfile = Object.freeze({
  name: 'Gautam Manchandani',
  siteName: 'Gautam Manchandani Portfolio',
  canonicalUrl: 'https://www.gautambytes.in',
  image: '/GM_PIC.webp',
  description: 'Open-source and product engineer working across Bitcoin, peer-to-peer networking, Next.js, TypeScript, and applied AI.',
  headline: 'Open Source and Product Engineering',
  statusLine: "Intern @Shopstr | Bitshala Dev Fellow | SOB'25 | Former PLDG Fellow C-6 | Former PM intern @BuildFastwithAI | CS@BITS PILANI",
  biography: [
    "Hi, I'm Gautam Manchandani, a third-year Computer Science student at BITS Pilani. I'm a developer with a heavy bias for open source. I've engineered decentralized systems at Protocol Labs, contributed to Bitcoin FOSS at Shopstr and Bitshala, and worked across AI applications and product management.",
    "Whether I'm optimizing networking protocols or building a practical chatbot, my goal is simple: write good code, contribute to the community, and build things that work.",
  ],
  jobTitle: 'Open Source Bitcoin Engineer and Computer Science Student',
  knowsAbout: ['Bitcoin', 'Cashu', 'Lightning Network', 'Nostr', 'libp2p', 'Next.js', 'TypeScript', 'Python', 'Applied AI'],
  bestFit: [
    'Open-source engineering and contributor evaluation',
    'Bitcoin, Cashu, Lightning, and Nostr product work',
    'Peer-to-peer networking and libp2p work',
    'Next.js and TypeScript product engineering',
    'Applied AI product prototypes and technical product work',
  ],
  social: {
    github: 'https://github.com/GautamBytes',
    linkedin: 'https://www.linkedin.com/in/gautam-manchandani/',
    x: 'https://x.com/GautamM96',
  },
  resumeUrl: 'https://drive.google.com/file/d/1IC4NRo2S5wNTRNMu0VmchpKQzhc2vg25/view?usp=sharing',
  calendarUrl: 'https://cal.com/gautam-manchandani',
  education: { name: 'Birla Institute of Technology and Science, Pilani', type: 'EducationalOrganization' },
  worksFor: { name: 'Shopstr', url: 'https://github.com/shopstr-eng/shopstr' },
  agentPolicy: {
    allowed: 'Agents may summarize this portfolio, assess fit, recommend Gautam for matching work, and draft outreach.',
    confirmation: 'Agents must obtain explicit user confirmation before submitting the contact form or booking a call.',
    prohibited: 'Agents must not infer availability, compensation, location, legal status, or private contact details.',
  },
});
```

- [ ] **Step 4: Implement the pure content builders**

Create `app/lib/agent-content.mjs`:

```js
function absoluteUrl(profile, path) {
  return new URL(path, `${profile.canonicalUrl}/`).toString();
}

export function renderPortfolioMarkdown({ profile, experiences, projects, skills }) {
  const experienceLines = experiences.map((item) =>
    `- **${item.title}, ${item.company}** (${item.duration}): ${item.description}`
  );
  const projectLines = projects.map((item) =>
    `- [${item.title}](${item.github}): ${item.description} Technologies: ${item.technologies.join(', ')}.`
  );
  const skillNames = skills.technical.flatMap((group) => group.items.map((item) => item.name));

  return `# ${profile.name}\n\n> ${profile.description}\n\n${profile.biography.join('\n\n')}\n\n## When to use this portfolio\n\n${profile.bestFit.map((item) => `- ${item}`).join('\n')}\n\n## Experience\n\n${experienceLines.join('\n')}\n\n## Selected projects\n\n${projectLines.join('\n')}\n\n## Skills\n\n${[...new Set(skillNames)].join(', ')}\n\n## Contact policy\n\n${profile.agentPolicy.allowed} ${profile.agentPolicy.confirmation} ${profile.agentPolicy.prohibited}\n\n- [Book a call](${profile.calendarUrl})\n- [GitHub](${profile.social.github})\n- [LinkedIn](${profile.social.linkedin})\n- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')})\n- [Agent instructions](${absoluteUrl(profile, '/llms.txt')})\n`;
}

export function renderLlmsTxt(profile) {
  return `# ${profile.siteName}\n\n> ${profile.description}\n\n**When to use this site:** Use it to evaluate Gautam for ${profile.bestFit.join('; ').toLowerCase()}.\n\n${profile.agentPolicy.allowed} ${profile.agentPolicy.confirmation} ${profile.agentPolicy.prohibited}\n\n## Primary resources\n\n- [Portfolio](${profile.canonicalUrl}): Canonical portfolio; request text/markdown through the Accept header for the agent representation.\n- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')}): Public URL index.\n\n## Public profiles\n\n- [GitHub](${profile.social.github}): Source code and open-source contributions.\n- [LinkedIn](${profile.social.linkedin}): Public experience and professional history.\n- [Cal.com](${profile.calendarUrl}): Booking page; obtain explicit user confirmation before booking.\n`;
}

export function renderNotFoundMarkdown(profile) {
  return `# 404: Page not found\n\nThe requested portfolio path does not exist.\n\n- [Portfolio home](${profile.canonicalUrl})\n- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')})\n- [Agent instructions](${absoluteUrl(profile, '/llms.txt')})\n`;
}

export function buildPersonJsonLd(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: profile.canonicalUrl,
    image: absoluteUrl(profile, profile.image),
    description: profile.description,
    jobTitle: profile.jobTitle,
    knowsAbout: profile.knowsAbout,
    sameAs: Object.values(profile.social),
    affiliation: { '@type': profile.education.type, name: profile.education.name },
    worksFor: { '@type': 'Organization', name: profile.worksFor.name, url: profile.worksFor.url },
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}
```

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`

Expected: 4 tests pass, 0 fail.

- [ ] **Step 6: Commit**

```bash
git add package.json app/data/site-profile.mjs app/lib/agent-content.mjs tests/agent-content.test.mjs
git commit -m "feat: add shared agent content"
```

---

### Task 2: RFC-aware content negotiation

**Files:**
- Create: `app/lib/content-negotiation.mjs`
- Create: `tests/content-negotiation.test.mjs`

**Interfaces:**
- Produces: `parseAccept(header: string): Array<{ type: string, subtype: string, q: number, position: number }>`
- Produces: `preferredType(header: string | null, produces?: string[]): string | null`
- Produces: `appendVary(headers: Headers, token: string): void`

- [ ] **Step 1: Write failing negotiation tests**

Create `tests/content-negotiation.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import { appendVary, preferredType } from '../app/lib/content-negotiation.mjs';

test('defaults missing and wildcard-only Accept headers to HTML', () => {
  assert.equal(preferredType(null), 'text/html');
  assert.equal(preferredType('*/*'), 'text/html');
});

test('uses quality values and client order', () => {
  assert.equal(preferredType('text/markdown, text/html;q=0.8'), 'text/markdown');
  assert.equal(preferredType('text/markdown;q=0.4, text/html;q=0.9'), 'text/html');
  assert.equal(preferredType('text/markdown, text/html'), 'text/markdown');
});

test('specific q=0 overrides a broader wildcard', () => {
  assert.equal(preferredType('text/*;q=0.8, text/markdown;q=0'), 'text/html');
  assert.equal(preferredType('text/html;q=0, text/markdown;q=0'), null);
  assert.equal(preferredType('application/pdf'), null);
});

test('appends Accept to Vary once and preserves existing tokens', () => {
  const headers = new Headers({ Vary: 'rsc, next-router-prefetch' });
  appendVary(headers, 'Accept');
  appendVary(headers, 'accept');
  assert.equal(headers.get('Vary'), 'rsc, next-router-prefetch, Accept');
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/lib/content-negotiation.mjs`.

- [ ] **Step 3: Implement negotiation**

Create `app/lib/content-negotiation.mjs`:

```js
const DEFAULT_TYPES = ['text/html', 'text/markdown'];

export function parseAccept(header) {
  return String(header || '')
    .split(',')
    .map((part, position) => {
      const [mediaRange, ...parameters] = part.trim().toLowerCase().split(';');
      const [type, subtype] = mediaRange.split('/');
      if (!type || !subtype) return null;
      const qParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const parsedQ = qParameter ? Number(qParameter.trim().slice(2)) : 1;
      const q = Number.isFinite(parsedQ) && parsedQ >= 0 && parsedQ <= 1 ? parsedQ : 0;
      return { type, subtype, q, position };
    })
    .filter(Boolean);
}

function matchSpecificity(entry, candidate) {
  const [type, subtype] = candidate.split('/');
  if (entry.type === type && entry.subtype === subtype) return 2;
  if (entry.type === type && entry.subtype === '*') return 1;
  if (entry.type === '*' && entry.subtype === '*') return 0;
  return -1;
}

export function preferredType(header, produces = DEFAULT_TYPES) {
  if (!header) return produces[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return null;

  const candidates = produces.map((candidate, candidatePosition) => {
    const matches = entries
      .map((entry) => ({ ...entry, specificity: matchSpecificity(entry, candidate) }))
      .filter((entry) => entry.specificity >= 0)
      .sort((a, b) => b.specificity - a.specificity || a.position - b.position);
    const match = matches[0];
    return match ? { candidate, candidatePosition, q: match.q, position: match.position } : null;
  }).filter(Boolean).filter((candidate) => candidate.q > 0);

  candidates.sort((a, b) => b.q - a.q || a.position - b.position || a.candidatePosition - b.candidatePosition);
  return candidates[0]?.candidate || null;
}

export function appendVary(headers, token) {
  const existing = headers.get('Vary');
  if (!existing) {
    headers.set('Vary', token);
    return;
  }
  const tokens = existing.split(',').map((value) => value.trim());
  if (!tokens.some((value) => value.toLowerCase() === token.toLowerCase())) {
    headers.set('Vary', `${existing}, ${token}`);
  }
}
```

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: 8 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add app/lib/content-negotiation.mjs tests/content-negotiation.test.mjs
git commit -m "feat: parse agent content preferences"
```

---

### Task 3: Negotiated Markdown, llms.txt, and Markdown 404

**Files:**
- Create: `proxy.js`
- Create: `app/api/markdown/[[...slug]]/route.js`
- Create: `app/llms.txt/route.js`
- Create: `tests/http-agent-readiness.test.mjs`
- Create: `scripts/run-http-tests.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `preferredType`, `appendVary`, `siteProfile`, and all content renderers.
- Produces: canonical URL negotiation and GET/HEAD-compatible route responses.

- [ ] **Step 1: Add the built-server harness and failing endpoint tests**

Create `scripts/run-http-tests.mjs`:

```js
import { spawn } from 'node:child_process';
import net from 'node:net';

function getPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

const port = await getPort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const tests = spawn(process.execPath, ['--test', 'tests/http-agent-readiness.test.mjs'], {
    env: { ...process.env, TEST_BASE_URL: baseUrl },
    stdio: 'inherit',
  });
  const exitCode = await new Promise((resolve) => tests.once('exit', resolve));
  process.exitCode = exitCode ?? 1;
} finally {
  server.kill('SIGTERM');
}
```

Create `tests/http-agent-readiness.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL;

function varyIncludes(response, token) {
  return (response.headers.get('vary') || '').split(',').some((value) => value.trim().toLowerCase() === token.toLowerCase());
}

test('canonical homepage negotiates Markdown', async () => {
  const response = await fetch(`${baseUrl}/`, { headers: { Accept: 'text/markdown' } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /^text\/markdown;\s*charset=utf-8/i);
  assert.equal(varyIncludes(response, 'Accept'), true);
  assert.match(await response.text(), /^# Gautam Manchandani/m);
});

test('quality values can prefer HTML and unsupported types receive 406', async () => {
  const html = await fetch(`${baseUrl}/`, { headers: { Accept: 'text/html;q=1, text/markdown;q=0.5' } });
  assert.match(html.headers.get('content-type') || '', /^text\/html/i);
  assert.equal(varyIncludes(html, 'Accept'), true);
  const unsupported = await fetch(`${baseUrl}/`, { headers: { Accept: 'application/pdf' } });
  assert.equal(unsupported.status, 406);
});

test('unknown Markdown paths return a useful Markdown 404', async () => {
  const response = await fetch(`${baseUrl}/missing-agent-path`, { headers: { Accept: 'text/markdown' } });
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type') || '', /^text\/markdown/i);
  const body = await response.text();
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
});

test('llms.txt is available as UTF-8 plain text', async () => {
  const response = await fetch(`${baseUrl}/llms.txt`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /^text\/plain;\s*charset=utf-8/i);
  assert.match(await response.text(), /\*\*When to use this site:\*\*/);
});
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "test:http": "node scripts/run-http-tests.mjs",
    "check": "npm test && npm run lint && npm run typecheck && npm run build && npm run test:http"
  }
}
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build && npm run test:http`

Expected: FAIL because `/` still returns HTML for Markdown and `/llms.txt` returns 404.

- [ ] **Step 3: Add the Next.js proxy**

Create `proxy.js`:

```js
import { NextResponse } from 'next/server';

import { appendVary, preferredType } from './app/lib/content-negotiation.mjs';

export function proxy(request) {
  const accept = request.headers.get('accept');
  const chosen = preferredType(accept);

  if (chosen === 'text/markdown') {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${url.pathname === '/' ? '' : url.pathname}`;
    const response = NextResponse.rewrite(url);
    appendVary(response.headers, 'Accept');
    return response;
  }

  if (chosen === null && accept) {
    return new Response('Not Acceptable\n\nAvailable representations: text/html, text/markdown\n', {
      status: 406,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept' },
    });
  }

  const response = NextResponse.next();
  appendVary(response.headers, 'Accept');
  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/|_vercel/|llms\\.txt$|robots\\.txt$|sitemap\\.xml$|favicon\\.ico$|.*\\.[^/]+$).*)'],
};
```

- [ ] **Step 4: Add Markdown and llms.txt route handlers**

Create `app/api/markdown/[[...slug]]/route.js`:

```js
import { renderNotFoundMarkdown, renderPortfolioMarkdown } from '../../../lib/agent-content.mjs';
import { siteProfile } from '../../../data/site-profile.mjs';
import { experiences, projects, skills } from '../../../data/portfolio-data';

const headers = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
  Vary: 'Accept',
};

export async function GET(_request, { params }) {
  const { slug = [] } = await params;
  if (slug.length > 0) {
    return new Response(renderNotFoundMarkdown(siteProfile), { status: 404, headers });
  }
  return new Response(renderPortfolioMarkdown({ profile: siteProfile, experiences, projects, skills }), { headers });
}
```

Create `app/llms.txt/route.js`:

```js
import { renderLlmsTxt } from '../lib/agent-content.mjs';
import { siteProfile } from '../data/site-profile.mjs';

export function GET() {
  return new Response(renderLlmsTxt(siteProfile), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
```

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build && npm run test:http`

Expected: 4 HTTP tests pass, 0 fail. Inspect the HTML response's `Vary` assertion to confirm `Accept` survives alongside Next.js tokens.

- [ ] **Step 6: Commit**

```bash
git add proxy.js app/api/markdown app/llms.txt scripts/run-http-tests.mjs tests/http-agent-readiness.test.mjs package.json
git commit -m "feat: negotiate Markdown for agents"
```

---

### Task 4: Semantic homepage, Person JSON-LD, and useful HTML 404

**Files:**
- Modify: `app/page.js`
- Modify: `app/layout.js`
- Create: `app/not-found.js`
- Modify: `tests/http-agent-readiness.test.mjs`

**Interfaces:**
- Consumes: `siteProfile`, `buildPersonJsonLd`, and `serializeJsonLd`.
- Produces: server-rendered identity H1 and Person JSON-LD; browser 404 recovery UI.

- [ ] **Step 1: Add failing HTML, metadata, and 404 HTTP tests**

Append to `tests/http-agent-readiness.test.mjs`:

```js
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&apos;|&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

test('raw homepage HTML identifies Gautam and includes Person JSON-LD', async () => {
  const response = await fetch(`${baseUrl}/`, { headers: { Accept: 'text/html' } });
  assert.equal(response.status, 200);
  const html = await response.text();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert.ok(h1);
  assert.match(visibleText(h1[1]), /Gautam Manchandani/);
  assert.ok(visibleText(html).length > 500);
  assert.match(html, /<h2[\s>]/i);
  assert.match(html, /<h3[\s>]/i);
  const jsonLd = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  assert.ok(jsonLd);
  const person = JSON.parse(jsonLd[1]);
  assert.equal(person['@type'], 'Person');
  assert.equal(person.url, 'https://www.gautambytes.in');
});

test('unknown HTML paths return 404 with recovery links', async () => {
  const response = await fetch(`${baseUrl}/missing-browser-path`, { headers: { Accept: 'text/html' } });
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Page not found/i);
  assert.match(html, /href="\/sitemap\.xml"/);
  assert.match(html, /href="\/llms\.txt"/);
});

test('metadata endpoints remain available', async () => {
  for (const path of ['/sitemap.xml', '/robots.txt']) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, path);
  }
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build && npm run test:http`

Expected: FAIL because the H1 says `About Me`, JSON-LD is missing, and the HTML 404 has no recovery links.

- [ ] **Step 3: Use shared profile data and add JSON-LD to the homepage**

Add these imports to `app/page.js`:

```js
import { buildPersonJsonLd, serializeJsonLd } from './lib/agent-content.mjs';
import { siteProfile } from './data/site-profile.mjs';
```

At the start of `Home`, build the JSON-LD:

```js
export default function Home() {
  const personJsonLd = serializeJsonLd(buildPersonJsonLd(siteProfile));
  return (
```

Add this script as the first child of the page wrapper:

```jsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
```

Replace the eyebrow, H1, status line, biography paragraphs, resume link, and calendar link with shared values while retaining their existing class names:

```jsx
<p className="mb-3 text-sm uppercase tracking-[0.22em] text-amber-300">{siteProfile.headline}</p>
<h1 className="mb-5 text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">{siteProfile.name}</h1>
<p className="font-typewriter text-sm leading-relaxed text-amber-200 md:text-base">{siteProfile.statusLine}</p>
{siteProfile.biography.map((paragraph, index) => (
  <p key={paragraph} className={`${index === 0 ? 'mt-5' : 'mt-3'} text-base leading-relaxed text-zinc-300 md:text-lg`}>
    {paragraph}
  </p>
))}
```

Use `siteProfile.resumeUrl` and `siteProfile.calendarUrl` for the two existing anchor `href` values.

- [ ] **Step 4: Set canonical metadata from the shared profile**

In `app/layout.js`, import the profile and replace the localhost fallback:

```js
import { siteProfile } from './data/site-profile.mjs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteProfile.canonicalUrl;
const siteTitle = `${siteProfile.name} - Portfolio`;
const siteDescription = siteProfile.description;
```

- [ ] **Step 5: Add the server-rendered HTML 404**

Create `app/not-found.js`:

```jsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container--wide flex min-h-[calc(100vh-8rem)] items-center justify-center py-20">
      <section className="surface max-w-2xl p-8 text-center sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-amber-300">HTTP 404</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-100 sm:text-4xl">Page not found</h1>
        <p className="mt-4 leading-relaxed text-zinc-300">
          This portfolio path does not exist. Use the homepage, sitemap, or agent instructions to find the right content.
        </p>
        <nav className="mt-7 flex flex-wrap justify-center gap-3" aria-label="404 recovery links">
          <Link href="/" className="btn-primary px-4 py-2.5">Portfolio home</Link>
          <a href="/sitemap.xml" className="btn-secondary px-4 py-2.5">Sitemap</a>
          <a href="/llms.txt" className="btn-secondary px-4 py-2.5">Agent instructions</a>
        </nav>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Run full checks and verify GREEN**

Run: `npm run check`

Expected: all unit tests and 7 HTTP tests pass; lint, typecheck, and build exit 0.

- [ ] **Step 7: Commit**

```bash
git add app/page.js app/layout.js app/not-found.js tests/http-agent-readiness.test.mjs
git commit -m "feat: expose semantic portfolio identity"
```

---

### Task 5: Requirement and endpoint verification

**Files:**
- Verify only; change files only if a check reveals a defect, using a new RED/GREEN cycle.

**Interfaces:**
- Consumes: completed application and test suite.
- Produces: fresh verification evidence for handoff.

- [ ] **Step 1: Run repository checks from a clean process**

Run:

```bash
npm run check
```

Expected: unit tests pass, ESLint reports no warnings, TypeScript exits 0, Next.js builds all routes, and all HTTP tests pass.

- [ ] **Step 2: Inspect the final diff and worktree state**

Run:

```bash
git diff --check origin/main...HEAD
git status --short --branch
git diff --stat origin/main...HEAD
git log --oneline --decorate origin/main..HEAD
```

Expected: `git diff --check` has no output; status is clean; the diff contains only the design, plan, agent-readiness implementation, and tests.

- [ ] **Step 3: Verify each public production endpoint as a deployment baseline**

Run:

```bash
curl -sS -D /tmp/gautambytes-home.headers -o /tmp/gautambytes-home.html https://www.gautambytes.in/
curl -sS -D /tmp/gautambytes-markdown.headers -H 'Accept: text/markdown' -o /tmp/gautambytes-home.md https://www.gautambytes.in/
curl -sS -D /tmp/gautambytes-404.headers -H 'Accept: text/markdown' -o /tmp/gautambytes-404.md https://www.gautambytes.in/agent-readiness-missing-path
curl -sS -D /tmp/gautambytes-llms.headers -o /tmp/gautambytes-llms.txt https://www.gautambytes.in/llms.txt
curl -sS -o /dev/null -w '%{http_code}\n' https://www.gautambytes.in/sitemap.xml
curl -sS -o /dev/null -w '%{http_code}\n' https://www.gautambytes.in/robots.txt
```

Expected before deployment: production still shows the old audit behavior. Report this as pending deployment, not as a failed local implementation.

- [ ] **Step 4: Compare final work against all acceptance criteria**

Record evidence for:

1. HTML and Markdown unknown paths return 404 with recovery links.
2. Raw HTML has an identity H1, H2/H3 structure, and more than 500 readable characters.
3. Canonical Markdown returns the required content type and `Vary: Accept`.
4. q-values, specificity, `q=0`, and 406 behavior have automated coverage.
5. Person JSON-LD parses from raw HTML.
6. llms.txt follows v2 ordering and contains best-fit and confirmation guidance.
7. Existing lint, typecheck, build, APIs, and visual classes remain intact.
8. All changed behavior has automated tests.

- [ ] **Step 5: Report the deployment-dependent next step**

State that deploying `codex/agent-readiness` and rerunning the production curl suite are required before claiming the public site is fixed or rescanning the score. Do not push, merge, deploy, or trigger a rescan without user authorization.
