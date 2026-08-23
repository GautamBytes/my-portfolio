import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL;

function varyIncludes(response, token) {
  return (response.headers.get('vary') || '')
    .split(',')
    .some((value) => value.trim().toLowerCase() === token.toLowerCase());
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
