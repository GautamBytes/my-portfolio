'use client';

export default function QuestProgressBar({ progressCount, totalSteps, currentLabel }) {
  const progressPercent = Math.round((progressCount / totalSteps) * 100);

  return (
    <div className="quest-progress-wrap" aria-live="polite">
      <div className="quest-progress-header">
        <span className="quest-pill">Shinchan Quest</span>
        <span className="quest-count">{progressCount}/{totalSteps}</span>
      </div>

      <div className="quest-track" role="progressbar" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={progressCount}>
        <div className="quest-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <p className="quest-label">{currentLabel}</p>
    </div>
  );
}
