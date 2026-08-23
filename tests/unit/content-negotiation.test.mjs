import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appendVary,
  preferredType,
} from '../../app/lib/content-negotiation.mjs';

test('defaults missing and wildcard-only Accept headers to HTML', () => {
  assert.equal(preferredType(null), 'text/html');
  assert.equal(preferredType('*/*'), 'text/html');
});

test('uses quality values and client order', () => {
  assert.equal(
    preferredType('text/markdown, text/html;q=0.8'),
    'text/markdown'
  );
  assert.equal(
    preferredType('text/markdown;q=0.4, text/html;q=0.9'),
    'text/html'
  );
  assert.equal(preferredType('text/markdown, text/html'), 'text/markdown');
});

test('specific q=0 overrides a broader wildcard', () => {
  assert.equal(
    preferredType('text/*;q=0.8, text/markdown;q=0'),
    'text/html'
  );
  assert.equal(
    preferredType('text/html;q=0, text/markdown;q=0'),
    null
  );
  assert.equal(preferredType('application/pdf'), null);
});

test('appends Accept to Vary once and preserves existing tokens', () => {
  const headers = new Headers({ Vary: 'rsc, next-router-prefetch' });

  appendVary(headers, 'Accept');
  appendVary(headers, 'accept');

  assert.equal(headers.get('Vary'), 'rsc, next-router-prefetch, Accept');
});
