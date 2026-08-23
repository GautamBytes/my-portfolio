import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL;

function varyIncludes(response, token) {
  return (response.headers.get('vary') || '')
    .split(',')
    .some((value) => value.trim().toLowerCase() === token.toLowerCase());
}

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

test('canonical homepage negotiates Markdown', async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { Accept: 'text/markdown' },
  });

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get('content-type') || '',
    /^text\/markdown;\s*charset=utf-8/i
  );
  assert.equal(varyIncludes(response, 'Accept'), true);
  assert.match(await response.text(), /^# Gautam Manchandani/m);
});

test('quality values can prefer HTML', async () => {
  const html = await fetch(`${baseUrl}/`, {
    headers: { Accept: 'text/html;q=1, text/markdown;q=0.5' },
  });

  assert.match(html.headers.get('content-type') || '', /^text\/html/i);
});

test('unsupported types receive 406', async () => {
  const unsupported = await fetch(`${baseUrl}/`, {
    headers: { Accept: 'application/pdf' },
  });

  assert.equal(unsupported.status, 406);
  assert.equal(varyIncludes(unsupported, 'Accept'), true);
});

test('unknown Markdown paths return a useful Markdown 404', async () => {
  const response = await fetch(`${baseUrl}/missing-agent-path`, {
    headers: { Accept: 'text/markdown' },
  });

  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type') || '', /^text\/markdown/i);

  const body = await response.text();
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
});

test('llms.txt is available as UTF-8 plain text', async () => {
  const response = await fetch(`${baseUrl}/llms.txt`);

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get('content-type') || '',
    /^text\/plain;\s*charset=utf-8/i
  );
  assert.match(await response.text(), /\*\*When to use this site:\*\*/);
});

test('raw homepage HTML identifies Gautam with structured readable content', async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { Accept: 'text/html' },
  });

  assert.equal(response.status, 200);
  const html = await response.text();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert.ok(h1);
  assert.match(visibleText(h1[1]), /Gautam Manchandani/);
  assert.ok(visibleText(html).length > 500);
  assert.match(html, /<h2[\s>]/i);
  assert.match(html, /<h3[\s>]/i);
});

test('raw homepage HTML includes Person JSON-LD', async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { Accept: 'text/html' },
  });
  const html = await response.text();
  const jsonLd = html.match(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
  );

  assert.ok(jsonLd);
  const person = JSON.parse(jsonLd[1]);
  assert.equal(person['@type'], 'Person');
  assert.equal(person.url, 'https://www.gautambytes.in');
});

test('unknown HTML paths return 404 with recovery links', async () => {
  const response = await fetch(`${baseUrl}/missing-browser-path`, {
    headers: { Accept: 'text/html' },
  });

  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Page not found/i);
  assert.match(html, /href="\/sitemap\.xml"/);
  assert.match(html, /href="\/llms\.txt"/);
});

test('metadata endpoints use canonical production URLs', async () => {
  const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /https:\/\/www\.gautambytes\.in/);

  const robots = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.match(
    await robots.text(),
    /Sitemap: https:\/\/www\.gautambytes\.in\/sitemap\.xml/
  );
});
