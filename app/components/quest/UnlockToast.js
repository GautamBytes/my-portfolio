'use client';

import { useEffect } from 'react';

export default function UnlockToast({ unlock, onClear }) {
  useEffect(() => {
    if (!unlock) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      onClear();
    }, 2600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onClear, unlock]);

  if (!unlock) {
    return null;
  }

  return (
    <div className="unlock-toast" role="status" aria-live="polite">
      <p className="unlock-toast-title">{unlock.label} Unlocked</p>
      <p className="unlock-toast-line">{unlock.line}</p>
      <span className="unlock-toast-reward">Reward: {unlock.reward}</span>
    </div>
  );
}
