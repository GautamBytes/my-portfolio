import Image from 'next/image';
import { Award, ArrowUp, Briefcase, Building, Calendar, ExternalLink, Github, Star } from 'lucide-react';

import ContactSection from './components/home/ContactSection';
import GearGrid from './components/home/GearGrid';
import LazyGitHubCalendar from './components/home/LazyGitHubCalendar';
import LazyShinchan from './components/home/LazyShinchan';
import ProjectsSection from './components/home/ProjectsSection';
import SiteHeader from './components/home/SiteHeader';
import YouTubeSection from './components/home/YouTubeSection';
import ShinchanQuestController from './components/quest/ShinchanQuestController';
import { QUEST_STEPS } from './data/shinchan-quest';
import {
  achievements,
  education,
  experiences,
  gears,
  navItems,
  projects,
  skills,
} from './data/portfolio-data';

const achievementIconMap = {
  award: Award,
  star: Star,
  github: Github,
};

export default function Home() {
  return (
    <div id="top" className="min-h-screen text-zinc-100">
      <SiteHeader navItems={navItems} />

      <ShinchanQuestController steps={QUEST_STEPS}>
        <main className="container--wide">
        <section id="about" className="section-shell min-h-[calc(100vh-6rem)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-14">
            <div className="avatar-spot">
              <Image
                src="/GM_PIC.webp"
                alt="Gautam Manchandani"
                fill
                className="avatar-img"
                sizes="(max-width: 1024px) 90vw, 460px"
                priority
              />
            </div>

            <div className="flex-1">
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-amber-300">Open Source and Product Engineering</p>
              <h1 className="mb-5 text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">About Me</h1>
              <p className="font-typewriter text-sm leading-relaxed text-amber-200 md:text-base">
                PLDG Fellow Cohort-6 | Intern @Shopstr | Bitshala Dev Fellow | SOB&apos;25 | Former PM intern @BuildFastwithAI |
                2nd@(ICCRIP 2024) | 3rd@(IITD Tryst) | CS@BITS PILANI
              </p>
              <p className="mt-5 text-base leading-relaxed text-zinc-300 md:text-lg">
                Hi, I&apos;m Gautam Manchandani, a third-year Computer Science student at BITS Pilani. I&apos;m a developer with
                a heavy bias for open source. I spend most of my time engineering decentralized systems at Protocol Labs and
                Shopstr, but I don&apos;t like staying in a box. I&apos;ve worked on AI apps, dabbled in product management, and
                love exploring how different technologies connect.
              </p>
              <p className="mt-3 text-base leading-relaxed text-zinc-300 md:text-lg">
                Whether I&apos;m optimizing networking protocols or building a practical chatbot, my goal is simple: write good
                code, contribute to the community, and build things that actually work.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://drive.google.com/file/d/1IC4NRo2S5wNTRNMu0VmchpKQzhc2vg25/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2 px-5 py-3"
                >
                  <ExternalLink size={18} />
                  View Resume
                </a>
                <a
                  href="https://cal.com/gautam-manchandani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 px-5 py-3"
                >
                  <Calendar size={18} />
                  Book a Call
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="section-shell max-w-6xl">
          <h2 className="section-title">Education</h2>
          <div className="space-y-6">
            {education.map((entry) => (
              <article key={entry.school} className="surface overflow-hidden">
                <div className="grid gap-4 md:grid-cols-[280px_1fr]">
                  <div className="relative h-52 md:h-full">
                    <Image src={entry.image} alt={entry.school} fill className="object-cover" sizes="(max-width: 768px) 100vw, 280px" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-lg border border-zinc-700/70 bg-zinc-900/70 p-2 text-zinc-400">
                        <Building size={18} />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-100">{entry.school}</h3>
                        <p className="mt-1 text-zinc-300">{entry.degree}</p>
                        <p className="mt-1 text-sm text-zinc-400">{entry.duration}</p>
                        {entry.grade && <p className="mt-2 text-sm font-medium text-zinc-300">{entry.grade}</p>}
                        {entry.current && (
                          <span className="mt-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ProjectsSection projects={projects} />

        <section id="experience" className="section-shell max-w-6xl">
          <h2 className="section-title">Experience</h2>
          <div className="space-y-6">
            {experiences.map((experience) => (
              <article key={`${experience.title}-${experience.company}`} className="surface p-6">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-zinc-400" />
                  <h3 className="text-lg font-semibold text-zinc-100 md:text-xl">{experience.title}</h3>
                </div>
                <p className="mt-2 text-zinc-200">{experience.company}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-400">
                  <Calendar size={14} />
                  {experience.duration}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{experience.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.skills.map((skill) => (
                    <span key={skill} className="tag-chip">
                      {skill}
                    </span>
                  ))}
                </div>
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  Learn More
                  <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section-shell max-w-6xl">
          <h2 className="section-title">Skills</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Technical Skills</h3>
              <div className="mt-6 space-y-6">
                {skills.technical.map((group) => (
                  <div key={group.category}>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-zinc-300">{group.category}</h4>
                    <div className="mt-3 space-y-3">
                      {group.items.map((skill) => (
                        <div key={skill.name} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm text-zinc-200 sm:text-base">{skill.name}</span>
                          <span className="flex items-center gap-1" aria-label={`${skill.level} out of 5`}>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${skill.name}-${index}`}
                                size={13}
                                className={index < skill.level ? 'fill-current text-zinc-300' : 'text-zinc-700'}
                              />
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface p-4 sm:p-6">
                <h3 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Soft Skills</h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {skills.soft.map((skillName) => (
                    <div key={skillName} className="rounded-lg border border-zinc-800/80 bg-zinc-900/70 p-3 text-center text-sm text-zinc-200">
                      {skillName}
                    </div>
                  ))}
                </div>
              </div>

              <LazyShinchan />
            </div>
          </div>
        </section>

        <section id="achievements" className="section-shell max-w-6xl">
          <h2 className="section-title">Achievements</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => {
              const Icon = achievementIconMap[achievement.icon] || Award;

              return (
                <article key={achievement.title} className="surface p-5 text-center">
                  <Icon size={30} className="mx-auto text-zinc-300" />
                  <h3 className="mt-3 text-lg font-semibold text-zinc-100">{achievement.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{achievement.description}</p>
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
                    >
                      Learn More
                      <ExternalLink size={14} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section id="github" className="section-shell max-w-6xl">
          <h2 className="section-title">GitHub Contributions</h2>
          <LazyGitHubCalendar username="GautamBytes" />
        </section>

        <YouTubeSection />

        <GearGrid gears={gears} />

          <ContactSection />
        </main>
      </ShinchanQuestController>

      <footer className="mt-10 border-t border-zinc-800/80 bg-black/55 py-8">
        <div className="container--wide flex flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} Gautam Manchandani. All rights reserved.</p>
          <a href="#top" className="btn-secondary inline-flex items-center gap-2 px-3 py-2" aria-label="Back to top">
            <ArrowUp size={16} />
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
