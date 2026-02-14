'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Bell, Check, Play, Youtube } from 'lucide-react';

function formatCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0';
  }

  if (numeric < 1000) {
    return String(numeric);
  }

  if (numeric < 1000000) {
    return `${(numeric / 1000).toFixed(1)}K`;
  }

  return `${(numeric / 1000000).toFixed(1)}M`;
}

function decodeHtml(value) {
  if (typeof window === 'undefined') {
    return value;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(value, 'text/html');
  return parsed.documentElement.textContent || value;
}

export default function YouTubeSection() {
  const [youtubeData, setYoutubeData] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const response = await fetch('/api/youtube', {
          signal: controller.signal,
          cache: 'no-store',
        });

        const payload = await response.json();

        if (!response.ok || !payload.success) {
          setError(payload.error || 'Unable to load YouTube content right now.');
          setYoutubeData(null);
          return;
        }

        setYoutubeData(payload.data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load YouTube content right now.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, []);

  const decodedTitle = useMemo(() => {
    if (!youtubeData?.video?.title) {
      return 'Fresh Content Dropping Now!';
    }

    return decodeHtml(youtubeData.video.title);
  }, [youtubeData]);

  return (
    <section id="youtube" className="section-shell max-w-6xl">
      <h2 className="section-title">
        YouTube Channel
        {youtubeData?.subscriberCount && (
          <span className="ml-3 inline-flex rounded-full border border-red-500/50 bg-red-600 px-2.5 py-1 align-middle text-xs font-semibold text-white">
            {formatCount(youtubeData.subscriberCount)} Subs
          </span>
        )}
      </h2>

      <div className="surface grid gap-8 p-6 md:grid-cols-2 md:p-8">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800/70 bg-black">
          {showVideo && youtubeData?.video?.videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeData.video.videoId}?autoplay=1`}
              title="Latest YouTube video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="group relative block h-full w-full cursor-pointer"
              onClick={() => setShowVideo(true)}
              aria-label="Play latest YouTube video"
            >
              {youtubeData?.video && (
                <span className="absolute left-3 top-3 z-20 rounded-full border border-red-500/50 bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  LATEST VIDEO
                </span>
              )}
              <Image
                src={youtubeData?.video?.thumbnail || '/Youtube_img.jpg'}
                alt={decodedTitle}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl">
                  <Play size={28} className="ml-0.5" />
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="space-y-5">
          <h3 className="text-2xl font-bold text-zinc-100 md:text-3xl">{decodedTitle}</h3>

          {isLoading && <p className="text-sm text-zinc-400">Loading latest stats...</p>}
          {!isLoading && error && <p className="text-sm text-red-300">{error}</p>}

          <p className="text-zinc-300">
            Subscribe for engineering updates, open-source builds, and lessons from real projects across AI and decentralized systems.
          </p>

          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15">
                <Check className="h-4 w-4 text-emerald-400" />
              </span>
              Open source contribution breakdowns
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15">
                <Check className="h-4 w-4 text-emerald-400" />
              </span>
              Web development and product engineering guides
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15">
                <Check className="h-4 w-4 text-emerald-400" />
              </span>
              Personal growth and practical tech insights
            </li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://www.youtube.com/@GRM-0925?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3"
            >
              <Youtube size={20} />
              Subscribe {youtubeData?.subscriberCount ? `(${formatCount(youtubeData.subscriberCount)})` : 'Now'}
            </a>
            <button type="button" className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3">
              <Bell size={20} />
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
