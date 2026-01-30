import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  try {
    // 1. Fetch Channel Stats (Subscriber Count)
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    
    // 2. Fetch Latest Video
    const videoUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`;

    // Fetch both in parallel
    const [statsRes, videoRes] = await Promise.all([
      fetch(statsUrl, { next: { revalidate: 3600 } }), // Cache for 1 hour
      fetch(videoUrl, { next: { revalidate: 3600 } })
    ]);

    const statsData = await statsRes.json();
    const videoData = await videoRes.json();

    if (!statsData.items?.[0] || !videoData.items?.[0]) {
       console.error("YouTube API Error: No items found.");
       return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    const latestVideo = videoData.items[0];
    const channelStats = statsData.items[0].statistics;

    return NextResponse.json({
      subscriberCount: channelStats.subscriberCount,
      viewCount: channelStats.viewCount,
      video: {
        title: latestVideo.snippet.title,
        thumbnail: latestVideo.snippet.thumbnails.high.url,
        link: `https://www.youtube.com/watch?v=${latestVideo.id.videoId}`,
        publishedAt: latestVideo.snippet.publishedAt
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}