'use client';

import { useState } from 'react';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectsSection({ projects }) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="section-shell max-w-6xl">
      <h2 className="section-title">Projects</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <article key={project.title} className="surface relative p-6">
            {index < 2 ? <span className="quest-sticker">Shinchan Pick</span> : null}
            <h3 className="text-xl font-semibold text-zinc-100">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tag-chip">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
              >
                <ExternalLink size={16} />
                {project.demoType}
              </a>
            </div>
          </article>
        ))}
      </div>

      {projects.length > 4 && (
        <div className="mt-8 text-center">
          <button type="button" className="btn-secondary inline-flex items-center gap-2 px-4 py-2" onClick={() => setShowAllProjects((value) => !value)}>
            {showAllProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showAllProjects ? 'Show Less' : 'View More'}
          </button>
        </div>
      )}
    </section>
  );
}
