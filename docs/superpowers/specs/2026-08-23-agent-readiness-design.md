# Agent Readiness Design

## Goal

Raise the portfolio's agent-readiness score by fixing the five reported audit gaps while preserving the current human-facing layout, interactions, and contact safeguards.

## Baseline

The production homepage returns pre-rendered HTML with more than 500 characters of readable text. It includes one H1, but the H1 says "About Me" rather than identifying Gautam. The production site returns a real 404 for unknown paths, though its body is the generic Next.js error page. Requests with `Accept: text/markdown` receive the HTML representation, and the response does not vary on `Accept`. `/llms.txt` returns the same generic 404 page. The homepage has no JSON-LD.

The repository starts from `origin/main` at commit `d93c82c`. Its lint, typecheck, and production build pass before changes.

## Scope

This change will:

- provide useful HTML and Markdown 404 responses with a real 404 status;
- preserve server-rendered homepage content and improve its heading semantics;
- negotiate HTML and Markdown representations on the canonical homepage URL;
- add Person JSON-LD;
- publish a specification-compliant `/llms.txt` with concrete use guidance;
- add automated coverage for each changed behavior;
- verify the built application through HTTP requests.

This change will not redesign the portfolio, expose private contact information, let agents send messages without confirmation, remediate unrelated dependency audit findings, deploy the site, or change the contact API contract.

## Safety Policy for Agents

Agents may read and summarize the public portfolio, assess Gautam's fit for work, recommend him for matching opportunities, draft outreach, and direct users to the contact form or Cal.com page.

Agents must obtain explicit user confirmation before submitting the contact form or booking a call. They must not infer availability, compensation, location, legal status, or private contact details. `/llms.txt` and the negotiated Markdown representation will state this boundary.

## Architecture

### Shared identity source

Create a focused site-profile module for the canonical URL, public identity, biography, best-fit work, public profiles, and contact policy. The visible homepage, JSON-LD builder, Markdown renderer, and `llms.txt` renderer will consume that module. Existing project, experience, education, and skill arrays will remain in `portfolio-data.js`.

This split keeps stable identity and policy text in one place without forcing a broad rewrite of the existing portfolio data.

### Content negotiation

Add a Next.js 16 `proxy.js` at the repository root. It will run on page-like requests and skip API routes, Next.js internals, metadata endpoints, and static assets.

The proxy will parse `Accept` entries by media type, quality value, specificity, and client order. It will choose between `text/html` and `text/markdown` according to RFC 9110 semantics:

- no `Accept` header or a wildcard-only header defaults to HTML;
- a preferred, non-zero `text/markdown` value selects Markdown;
- a preferred, non-zero `text/html` value selects HTML;
- an explicit header that rejects every supported representation returns 406;
- `q=0` rejects that representation;
- a more specific media range overrides a wildcard for the same candidate.

Markdown requests will rewrite to an internal route handler. The canonical browser URL will remain unchanged. Every negotiated response will include `Accept` in `Vary`; existing Next.js `Vary` tokens must remain intact. Markdown responses will use `Content-Type: text/markdown; charset=utf-8`.

The implementation will follow the Accept Markdown Next.js recipe and use the Next.js 16 `proxy.js` convention rather than the deprecated `middleware.js` name.

### Markdown representation

An internal route handler will return a concise Markdown representation of the homepage. It will include:

- Gautam's name and professional summary;
- best-fit use cases;
- current experience and selected projects;
- skills and public evidence links;
- safe contact instructions;
- links to the canonical homepage, sitemap, and `/llms.txt`.

The renderer will build this response from the shared identity module and existing portfolio data. Unknown page paths will return a Markdown recovery document with status 404 and links to `/`, `/sitemap.xml`, and `/llms.txt`.

### HTML 404

Add `app/not-found.js` so browser requests to unknown paths keep the real 404 status and receive useful recovery links. The component will reuse the current visual language: dark surfaces, zinc text, amber accents, and existing button classes. It will not add client-side JavaScript.

### Raw HTML semantics

Keep the homepage as a Server Component. The H1 will identify Gautam while retaining the existing visual heading treatment. Section headings will follow H2, card headings H3, and nested skill-group headings H4. Tests will check that the raw response contains one identity-bearing H1, meaningful text without executing JavaScript, and a valid heading progression.

No content will be hidden solely to manipulate the audit. Screen-reader text may clarify the visible "About Me" label if the visual copy stays unchanged.

### JSON-LD

Add a server-rendered `<script type="application/ld+json">` to the homepage. It will describe a Schema.org `Person` with:

- `name`, `description`, `url`, and `image`;
- public `sameAs` profile URLs;
- `jobTitle` and `knowsAbout` values supported by the portfolio;
- `alumniOf` or current education using an `EducationalOrganization`;
- current public affiliations using `worksFor` where the portfolio supports them.

The JSON will come from trusted local data. Serialization will escape `<` to prevent a future text value from closing the script element.

### `/llms.txt`

Serve `/llms.txt` as UTF-8 plain text in the llms.txt v2 order:

1. one H1 site name;
2. one blockquote summary;
3. guidance without headings, including "When to use this site" and the human-confirmation policy;
4. H2 file-list sections whose entries use Markdown links with optional descriptions.

The primary links will point to the canonical homepage, its negotiated Markdown representation, the sitemap, GitHub, LinkedIn, and Cal.com. The file will tell agents to use the site when evaluating Gautam for open-source engineering, Bitcoin and payment work, peer-to-peer networking, Next.js and TypeScript work, or applied AI product projects. It will avoid claims that the visible portfolio does not support.

## Request Flow

For a browser request to `/`, the proxy chooses HTML, appends `Accept` to `Vary`, and lets the existing Server Component render.

For an agent request to `/` with Markdown preferred, the proxy rewrites to the internal Markdown handler. The handler returns the Markdown body, Markdown content type, and cache-safe `Vary` header.

For an unknown path, HTML clients reach `app/not-found.js` and receive 404. Markdown clients reach the internal handler and receive the recovery document with 404.

For a request that accepts neither HTML nor Markdown, the proxy returns 406 with a short plain-text explanation and `Vary: Accept`.

`/llms.txt`, `/sitemap.xml`, `/robots.txt`, API routes, and static assets bypass negotiation and keep their native representations.

## Shopstr Role Progression

Present Shopstr as a promotion ladder without erasing the earlier role:

1. `Open Source Bitcoin Engineer`, `Aug 2026 - Present`, described as a full-time engineering role;
2. `SWE Intern`, `Sep 2025 - Jul 2026`;
3. the existing `Mentee`, `May 2025 - Aug 2025`, remains unchanged.

Keep the current engineer and prior internship entries adjacent in the experience list so both HTML and negotiated Markdown communicate the progression. Update the compact status line from `Intern @Shopstr` to `Engineer @Shopstr`. The Person JSON-LD continues to use `Open Source Bitcoin Engineer` as the current job title and Shopstr as `worksFor`. This is a content-only change and must not alter the visual design or agent-action safety policy.

## Error Handling and Caching

- Unknown page paths return 404 for both representations.
- Unsupported `Accept` headers return 406 only when the client rejects every representation the page can produce.
- The Markdown handler does not expose filesystem paths or stack traces.
- Negotiated responses include `Vary: Accept` alongside framework-generated values.
- Machine-readable responses declare UTF-8 content types.
- Contact actions remain subject to the existing validation, honeypot, rate limit, and mail configuration.

## Testing

Use Node's built-in test runner for pure negotiation and content functions. Add tests that cover:

- Markdown preference, HTML preference, wildcards, quality values, specificity, client-order ties, and `q=0`;
- preservation and deduplication of existing `Vary` values;
- homepage Markdown content and safe contact guidance;
- compliant `llms.txt` ordering and link-list structure;
- valid Person JSON-LD with required identity fields.
- the Shopstr current role, prior internship dates, and promotion ordering in rendered Markdown.

Add built-app HTTP verification that starts the production server and checks:

- `/` returns 200 HTML, one identity-bearing H1, structured headings, JSON-LD, and more than 500 characters of readable text without JavaScript;
- `/` with `Accept: text/markdown` returns 200 Markdown and `Vary: Accept`;
- `/` with HTML preferred still returns HTML;
- an unsupported media type returns 406;
- an unknown HTML path returns 404 with recovery links;
- an unknown Markdown path returns 404 Markdown with recovery links;
- `/llms.txt`, `/sitemap.xml`, and `/robots.txt` return 200 with the expected content types and bodies.

Run the existing lint, typecheck, and production build after the new tests pass. Public production verification can occur only after deployment; the implementation handoff will list the exact curl commands and report the current production state separately from local results.

## Acceptance Criteria

1. Unknown paths return HTTP 404, and both HTML and Markdown clients receive actionable recovery links.
2. The raw homepage HTML contains meaningful server-rendered text, one identity-bearing H1, and a logical heading hierarchy.
3. `Accept: text/markdown` on the canonical homepage returns Markdown with `Content-Type: text/markdown; charset=utf-8` and `Vary` containing `Accept`.
4. Negotiation respects quality values and explicit rejections, including a 406 response when no supported type is acceptable.
5. The homepage includes valid, server-rendered Schema.org Person JSON-LD.
6. `/llms.txt` follows the published v2 structure and names concrete use cases and the human-confirmation policy.
7. Existing visual design, contact behavior, API behavior, and public page interactions remain unchanged.
8. Automated tests cover every changed behavior, and lint, typecheck, build, and built-app HTTP checks pass.

## Protocol References

- [Accept Markdown Next.js recipe](https://acceptmarkdown.com/recipes/nextjs)
- [Accept and quality-value guidance](https://acceptmarkdown.com/guides/accept-text-markdown)
- [Vary: Accept guidance](https://acceptmarkdown.com/guides/vary-accept)
- [llms.txt v2 proposal](https://llmstxt.org/)
- [Schema.org Person](https://schema.org/Person)
- [Next.js 16 proxy convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
