'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';

export default function SiteHeader({ navItems }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handleEnterSite = async () => {
    setShowIntro(false);

    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = 0.5;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none" src="/bg-music.mp3" />

      {showIntro && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl">
            Gautam Manchandani
          </h1>
          <button type="button" onClick={handleEnterSite} className="btn-primary px-8 py-3 text-base tracking-[0.2em]">
            ENTER PORTFOLIO
          </button>
          <p className="mt-4 text-sm text-zinc-500">Click to enter</p>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
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
            <button
              type="button"
              onClick={toggleAudio}
              className="rounded-full border border-zinc-700/70 bg-zinc-900/80 p-2 text-zinc-300 transition-colors hover:text-zinc-100"
              aria-label={isPlaying ? 'Mute background audio' : 'Play background audio'}
            >
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={toggleAudio}
              className="rounded-full border border-zinc-700/70 bg-zinc-900/80 p-2 text-zinc-300"
              aria-label={isPlaying ? 'Mute background audio' : 'Play background audio'}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
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
