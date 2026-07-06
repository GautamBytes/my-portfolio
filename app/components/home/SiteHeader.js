'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';

export default function SiteHeader({ navItems }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wantsAudio, setWantsAudio] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? 'hidden' : previousOverflow || 'auto';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!wantsAudio || !audioRef.current) {
      return undefined;
    }

    const audio = audioRef.current;
    audio.volume = 0.42;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch {
        // Browsers may block autoplay until the first click or key press.
      }
    };

    playAudio();

    window.addEventListener('pointerdown', playAudio, { once: true });
    window.addEventListener('keydown', playAudio, { once: true });
    window.addEventListener('touchstart', playAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', playAudio);
      window.removeEventListener('keydown', playAudio);
      window.removeEventListener('touchstart', playAudio);
    };
  }, [wantsAudio]);

  const toggleAudio = async () => {
    if (!audioRef.current) {
      return;
    }

    if (wantsAudio) {
      audioRef.current.pause();
      setWantsAudio(false);
      return;
    }

    setWantsAudio(true);

    try {
      await audioRef.current.play();
    } catch {
      // Browsers may still deny playback if the gesture is not accepted.
    }
  };

  return (
    <>
      <audio ref={audioRef} autoPlay loop preload="auto" src="/bg-music.mp3" />

      <header
        className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          isScrolled ? 'border-zinc-800/80 bg-black/70 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="container--wide flex items-center justify-between py-4">
          <a href="#top" className="group inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-300 transition-transform duration-200 group-hover:scale-125" />
            <span className="text-lg font-semibold tracking-wide text-zinc-100 md:text-xl">Gautam Manchandani</span>
          </a>

          <nav className="hidden items-center gap-3 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="nav-pill">
                {item.label}
              </a>
            ))}
            <span className="inline-flex">
              <button
                type="button"
                onClick={toggleAudio}
                className={`audio-control ${wantsAudio ? 'audio-control--active' : ''}`}
                aria-pressed={wantsAudio}
                aria-label={wantsAudio ? 'Stop background audio' : 'Play background audio'}
              >
                {wantsAudio ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </span>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <span className="inline-flex">
              <button
                type="button"
                onClick={toggleAudio}
                className={`audio-control ${wantsAudio ? 'audio-control--active' : ''}`}
                aria-pressed={wantsAudio}
                aria-label={wantsAudio ? 'Stop background audio' : 'Play background audio'}
              >
                {wantsAudio ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="rounded-full border border-zinc-700/70 bg-zinc-900/80 p-2 text-zinc-300"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 px-6 pb-6 pt-24 md:hidden" id="mobile-nav">
          <nav className="flex h-full flex-col items-center justify-center gap-8" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-2xl font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
