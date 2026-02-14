'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('disabled'));
}

export default function GearGrid({ gears }) {
  const [selectedGear, setSelectedGear] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!selectedGear) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedGear(null);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedGear]);

  return (
    <section id="gears" className="section-shell max-w-6xl">
      <h2 className="section-title">My Gears</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gears.map((gear) => (
          <button
            key={gear.name}
            type="button"
            className="surface group overflow-hidden text-left"
            onClick={() => setSelectedGear(gear)}
            aria-haspopup="dialog"
            aria-label={`Open image for ${gear.name}`}
          >
            <div className="relative aspect-video border-b border-zinc-800/70 bg-zinc-950">
              <Image
                src={gear.image}
                alt={gear.name}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-zinc-100">{gear.name}</h3>
              <p className="mt-2 text-sm text-zinc-300">{gear.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedGear && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedGear(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-3xl rounded-xl border border-zinc-700 bg-zinc-950 p-3"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gear-modal-title"
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
          >
            <h3 id="gear-modal-title" className="mb-3 px-1 text-lg font-semibold text-zinc-100">
              {selectedGear.name}
            </h3>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <Image
                src={selectedGear.image}
                alt={selectedGear.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 900px"
                priority
              />
            </div>
            <p className="mt-3 px-1 text-sm text-zinc-300">{selectedGear.description}</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedGear(null)}
              className="absolute right-2 top-2 rounded-full border border-zinc-700 bg-zinc-900 p-2 text-zinc-200 transition-colors hover:text-white"
              aria-label="Close gear image modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
