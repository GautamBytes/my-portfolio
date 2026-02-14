export const QUEST_STEPS = [
  {
    id: 'meet-gautam',
    sectionId: 'about',
    label: 'Meet Gautam',
    hint: 'Start your mission by reading the About section.',
    unlockLine: 'Yoo! You unlocked my origin story.',
  },
  {
    id: 'project-hunter',
    sectionId: 'projects',
    label: 'Project Hunter',
    hint: 'Explore the Projects section to unlock my build zone.',
    unlockLine: 'Nice! You found my build arena.',
  },
  {
    id: 'skill-sensei',
    sectionId: 'skills',
    label: 'Skill Sensei',
    hint: 'Visit Skills to see what powers I have leveled up.',
    unlockLine: 'Boom! Skills unlocked. Training arc complete.',
  },
  {
    id: 'creator-mode',
    sectionId: 'youtube',
    label: 'Creator Mode',
    hint: 'Peek at YouTube for fresh creator updates.',
    unlockLine: 'Ayy! Creator mode unlocked.',
  },
  {
    id: 'final-connect',
    sectionId: 'contact',
    label: 'Final Connect',
    hint: 'Complete the mission by visiting Contact.',
    unlockLine: 'Quest complete! Time to connect and build together.',
  },
];

export const QUEST_LINES = {
  idle: [
    'Tap around. Every section unlocks a tiny surprise.',
    'Mission time. Let us clear all 5 Shinchan steps.',
    'I left clues across the page. Start exploring.',
  ],
  complete: [
    'Legend! You completed the full Shinchan quest.',
    'Mission complete. Let us turn this into real work.',
  ],
};

export const QUEST_REWARDS = {
  'meet-gautam': 'Story Badge',
  'project-hunter': 'Builder Badge',
  'skill-sensei': 'Sensei Badge',
  'creator-mode': 'Creator Badge',
  'final-connect': 'Mission Complete',
};
