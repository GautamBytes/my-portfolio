import {
  renderNotFoundMarkdown,
  renderPortfolioMarkdown,
} from '../../../lib/agent-content.mjs';
import { siteProfile } from '../../../data/site-profile.mjs';
import {
  experiences,
  projects,
  skills,
} from '../../../data/portfolio-data';

const markdownHeaders = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
  Vary: 'Accept',
};

export async function GET(_request, { params }) {
  const { slug = [] } = await params;

  if (slug.length > 0) {
    return new Response(renderNotFoundMarkdown(siteProfile), {
      status: 404,
      headers: markdownHeaders,
    });
  }

  return new Response(
    renderPortfolioMarkdown({
      profile: siteProfile,
      experiences,
      projects,
      skills,
    }),
    { headers: markdownHeaders }
  );
}
