'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Shinchan3D = dynamic(() => import('../Shinchan3D'), {
  ssr: false,
  loading: () => <p className="text-sm text-zinc-400">Loading 3D scene...</p>,
});

export default function LazyShinchan({ reactionMode = 'idle' }) {
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
      { rootMargin: '250px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="surface-soft min-h-[300px] rounded-xl p-4">
      {isVisible ? <Shinchan3D reactionMode={reactionMode} /> : <p className="text-sm text-zinc-400">Scroll to load Shinchan...</p>}
    </div>
  );
}
