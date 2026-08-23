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
