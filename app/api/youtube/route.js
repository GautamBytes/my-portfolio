import { NextResponse } from 'next/server';

const REVALIDATE_SECONDS = 3600;
const CACHE_CONTROL = `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`;

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

function mapUpstreamErrorStatus(status) {
  if (status === 403) {
    return 403;
  }

  if (status === 429) {
    return 429;
  }

  return 502;
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return json({ success: false, error: 'Missing configuration', code: 'MISSING_CONFIG' }, 500);
  }

  const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
  const videoUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`;

  try {
    const [statsResponse, videoResponse] = await Promise.all([
      fetch(statsUrl, { next: { revalidate: REVALIDATE_SECONDS } }),
      fetch(videoUrl, { next: { revalidate: REVALIDATE_SECONDS } }),
    ]);

    if (!statsResponse.ok || !videoResponse.ok) {
      const failingResponse = !statsResponse.ok ? statsResponse : videoResponse;
      const failingBody = await parseJsonSafe(failingResponse);
      const status = mapUpstreamErrorStatus(failingResponse.status);
      const upstreamMessage =
        failingBody?.error?.message ||
        (status === 403 ? 'YouTube API quota exceeded or access denied.' : 'YouTube upstream request failed.');

      return json(
        {
          success: false,
          error: upstreamMessage,
          code: 'UPSTREAM_ERROR',
        },
        status
      );
    }

    const [statsData, videoData] = await Promise.all([statsResponse.json(), videoResponse.json()]);

    const statistics = statsData?.items?.[0]?.statistics || null;
    const latestVideo = videoData?.items?.[0] || null;

    if (!statistics && !latestVideo) {
      return json({ success: false, error: 'Data not found', code: 'NOT_FOUND' }, 404);
    }

    return json({
      success: true,
      data: {
        subscriberCount: statistics?.subscriberCount || null,
        viewCount: statistics?.viewCount || null,
        video: latestVideo
          ? {
              title: latestVideo.snippet?.title || '',
              videoId: latestVideo.id?.videoId || null,
              thumbnail: latestVideo.snippet?.thumbnails?.high?.url || null,
              link: latestVideo.id?.videoId ? `https://www.youtube.com/watch?v=${latestVideo.id.videoId}` : null,
              publishedAt: latestVideo.snippet?.publishedAt || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('YouTube API route failure', { name: error?.name, message: error?.message });
    return json({ success: false, error: 'Internal Server Error', code: 'UPSTREAM_ERROR' }, 500);
  }
}

