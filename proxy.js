import { NextResponse } from 'next/server';

import {
  appendVary,
  preferredType,
} from './app/lib/content-negotiation.mjs';

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
    return new Response(
      'Not Acceptable\n\nAvailable representations: text/html, text/markdown\n',
      {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          Vary: 'Accept',
        },
      }
    );
  }

  const response = NextResponse.next();
  appendVary(response.headers, 'Accept');
  return response;
}

export const config = {
  matcher: [
    '/((?!api/|_next/|_vercel/|llms\\.txt$|robots\\.txt$|sitemap\\.xml$|favicon\\.ico$|.*\\.[^/]+$).*)',
  ],
};
