'use client';

function createSeededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function generateStarField(count, seed) {
  let stars = '';
  const random = createSeededRandom(seed);

  for (let index = 0; index < count; index += 1) {
    const x = Math.floor(random() * 2000);
    const y = Math.floor(random() * 2000);
    stars += `${x}px ${y}px #FFF, `;
  }

  return stars.slice(0, -2);
}

const stars = {
  small: generateStarField(420, 12),
  medium: generateStarField(140, 128),
  large: generateStarField(70, 512),
};

export default function StarBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="animate-star-move-slow absolute h-[1px] w-[1px] bg-transparent opacity-70" style={{ boxShadow: stars.small }} />
      <div className="animate-star-move-medium absolute h-[2px] w-[2px] bg-transparent opacity-50" style={{ boxShadow: stars.medium }} />
      <div className="animate-star-move-fast absolute h-[3px] w-[3px] bg-transparent opacity-30" style={{ boxShadow: stars.large }} />
    </div>
  );
}
