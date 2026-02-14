'use client';

import { useMemo } from 'react';

export default function ShinchanCompanion({ progressCount, totalSteps, isMissionComplete, hintLine, latestUnlockLine }) {
  const message = useMemo(() => {
    if (isMissionComplete) {
      return 'Quest cleared. Ready to build something impactful together?';
    }

    return latestUnlockLine || hintLine;
  }, [hintLine, isMissionComplete, latestUnlockLine]);

  return (
    <aside className="shinchan-companion" aria-live="polite">
      <div className="companion-head">
        <span className="companion-avatar" aria-hidden="true">SH</span>
        <div>
          <p className="companion-title">Shinchan Guide</p>
          <p className="companion-subtitle">{progressCount}/{totalSteps} missions unlocked</p>
        </div>
      </div>

      <p className="companion-message">{message}</p>

      {isMissionComplete ? (
        <div className="companion-cta-row">
          <a
            href="https://drive.google.com/file/d/1IC4NRo2S5wNTRNMu0VmchpKQzhc2vg25/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="companion-cta"
          >
            View Resume
          </a>
          <a
            href="https://cal.com/gautam-manchandani"
            target="_blank"
            rel="noopener noreferrer"
            className="companion-cta"
          >
            Book a Call
          </a>
        </div>
      ) : null}
    </aside>
  );
}
