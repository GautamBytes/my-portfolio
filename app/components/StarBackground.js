'use client';

import { useMemo } from 'react';

function generateStarField(count) {
  let stars = '';

  for (let index = 0; index < count; index += 1) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    stars += `${x}px ${y}px #FFF, `;
  }

  return stars.slice(0, -2);
}

export default function StarBackground() {
  const stars = useMemo(
    () => ({
      small: generateStarField(420),
      medium: generateStarField(140),
      large: generateStarField(70),
    }),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="animate-star-move-slow absolute h-[1px] w-[1px] bg-transparent opacity-70" style={{ boxShadow: stars.small }} />
      <div className="animate-star-move-medium absolute h-[2px] w-[2px] bg-transparent opacity-50" style={{ boxShadow: stars.medium }} />
      <div className="animate-star-move-fast absolute h-[3px] w-[3px] bg-transparent opacity-30" style={{ boxShadow: stars.large }} />
    </div>
  );
}
