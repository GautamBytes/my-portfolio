'use client';

import { useEffect, useMemo, useState } from 'react';
import { track } from '@vercel/analytics';

import { QUEST_LINES, QUEST_REWARDS } from '../../data/shinchan-quest';
import QuestProgressBar from './QuestProgressBar';
import ShinchanCompanion from './ShinchanCompanion';
import UnlockToast from './UnlockToast';

export default function ShinchanQuestController({ steps, children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [latestUnlock, setLatestUnlock] = useState(null);
  const [idleIndex, setIdleIndex] = useState(0);

  const totalSteps = steps.length;
  const progressCount = completedSteps.length;
  const isMissionComplete = progressCount === totalSteps;

  const currentStep = useMemo(
    () => steps.find((step) => !completedSteps.includes(step.id)) || null,
    [completedSteps, steps]
  );

  const currentHint = currentStep?.hint || QUEST_LINES.complete[0];
  const idleHint = QUEST_LINES.idle[idleIndex % QUEST_LINES.idle.length];

  useEffect(() => {
    const idleRotation = window.setInterval(() => {
      setIdleIndex((value) => value + 1);
    }, 9000);

    return () => {
      window.clearInterval(idleRotation);
    };
  }, []);

  useEffect(() => {
    const completedSet = new Set(completedSteps);

    const stepBySectionId = new Map();
    steps.forEach((step) => {
      stepBySectionId.set(step.sectionId, step);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionId = entry.target.getAttribute('id');
          if (!sectionId) {
            return;
          }

          const step = stepBySectionId.get(sectionId);
          if (!step || completedSet.has(step.id)) {
            return;
          }

          completedSet.add(step.id);

          setCompletedSteps((previous) => {
            if (previous.includes(step.id)) {
              return previous;
            }

            return [...previous, step.id];
          });

          const unlockPayload = {
            id: step.id,
            label: step.label,
            line: step.unlockLine,
            reward: QUEST_REWARDS[step.id] || 'Unlocked',
          };
          setLatestUnlock(unlockPayload);

          window.dispatchEvent(
            new CustomEvent('shinchan:reaction', {
              detail: { mode: completedSet.size === totalSteps ? 'celebrate' : 'unlock' },
            })
          );

          track('quest_step_unlocked', {
            stepId: step.id,
            sectionId: step.sectionId,
            progress: completedSet.size,
          });

          if (completedSet.size === totalSteps) {
            track('quest_completed', {
              totalSteps,
            });
          }

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.4,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    steps.forEach((step) => {
      const element = document.getElementById(step.sectionId);
      if (element && !completedSet.has(step.id)) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [completedSteps, steps, totalSteps]);

  return (
    <>
      <div className="container--wide quest-progress-shell">
        <QuestProgressBar progressCount={progressCount} totalSteps={totalSteps} currentLabel={isMissionComplete ? 'Mission complete!' : currentStep?.label || 'Mission complete!'} />
      </div>

      {children}

      <ShinchanCompanion
        progressCount={progressCount}
        totalSteps={totalSteps}
        isMissionComplete={isMissionComplete}
        hintLine={latestUnlock?.line ? latestUnlock.line : `${currentHint} ${idleHint}`}
        latestUnlockLine={latestUnlock?.line || ''}
      />

      <UnlockToast unlock={latestUnlock} onClear={() => setLatestUnlock(null)} />
    </>
  );
}
