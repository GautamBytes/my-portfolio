'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const GitHubCalendar = dynamic(() => import('react-github-calendar'), {
  ssr: false,
  loading: () => <p className="text-sm text-zinc-400">Loading contribution graph...</p>,
});

export default function LazyGitHubCalendar({ username }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="surface mx-auto w-fit max-w-full overflow-x-auto rounded-xl p-6">
      <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="mx-auto inline-block">
        {isVisible ? <GitHubCalendar username={username} colorScheme="dark" /> : <p className="text-sm text-zinc-400">Scroll to load contribution graph...</p>}
      </a>
    </div>
  );
}
