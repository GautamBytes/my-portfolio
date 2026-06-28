import { NextResponse } from 'next/server';

const REVALIDATE_SECONDS = 3600;
const CACHE_CONTROL = `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`;
const FETCH_TIMEOUT_MS = 10000;
const UPSTREAM_ERROR_MESSAGE = 'Unable to load YouTube content right now.';

function json(body, status = 200, headers = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': status >= 200 && status < 300 ? CACHE_CONTROL : 'no-store',
      ...headers,
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

function buildYoutubeUrl(path, params) {
  const url = new URL(path, 'https://www.googleapis.com');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}

function getSafeVideoId(videoId) {
  if (typeof videoId !== 'string' || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
    return null;
  }
  return videoId;
}

function getSafeThumbnailUrl(thumbnailUrl) {
  if (typeof thumbnailUrl !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(thumbnailUrl);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'i.ytimg.com') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function fetchYoutube(url) {
  return fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return json({ success: false, error: 'Missing configuration', code: 'MISSING_CONFIG' }, 500);
  }

  const statsUrl = buildYoutubeUrl('/youtube/v3/channels', {
    part: 'statistics',
    id: channelId,
    key: apiKey,
  });
  const videoUrl = buildYoutubeUrl('/youtube/v3/search', {
    key: apiKey,
    channelId,
    part: 'snippet,id',
    order: 'date',
    maxResults: '1',
    type: 'video',
  });

  try {
    const [statsResponse, videoResponse] = await Promise.all([
      fetchYoutube(statsUrl),
      fetchYoutube(videoUrl),
    ]);

    if (!statsResponse.ok || !videoResponse.ok) {
      const failingResponse = !statsResponse.ok ? statsResponse : videoResponse;
      const failingBody = await parseJsonSafe(failingResponse);
      const status = mapUpstreamErrorStatus(failingResponse.status);
      console.error('YouTube upstream request failed', {
        status: failingResponse.status,
        code: failingBody?.error?.code,
      });

      return json(
        {
          success: false,
          error: UPSTREAM_ERROR_MESSAGE,
          code: 'UPSTREAM_ERROR',
        },
        status
      );
    }

    const [statsData, videoData] = await Promise.all([statsResponse.json(), videoResponse.json()]);

    const statistics = statsData?.items?.[0]?.statistics || null;
    const latestVideo = videoData?.items?.[0] || null;
    const videoId = getSafeVideoId(latestVideo?.id?.videoId);
    const thumbnail = getSafeThumbnailUrl(latestVideo?.snippet?.thumbnails?.high?.url);

    if (!statistics && !latestVideo) {
      return json({ success: false, error: 'Data not found', code: 'NOT_FOUND' }, 404);
    }

    return json({
      success: true,
      data: {
        subscriberCount: statistics?.subscriberCount || null,
        viewCount: statistics?.viewCount || null,
        video: latestVideo && videoId
          ? {
              title: latestVideo.snippet?.title || '',
              videoId,
              thumbnail,
              link: `https://www.youtube.com/watch?v=${videoId}`,
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
