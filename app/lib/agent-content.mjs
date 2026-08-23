function absoluteUrl(profile, path) {
  return new URL(path, `${profile.canonicalUrl}/`).toString();
}

export function renderPortfolioMarkdown({ profile, experiences, projects, skills }) {
  const experienceLines = experiences.map(
    (item) =>
      `- **${item.title}, ${item.company}** (${item.duration}): ${item.description}`
  );
  const projectLines = projects.map(
    (item) =>
      `- [${item.title}](${item.github}): ${item.description} Technologies: ${item.technologies.join(', ')}.`
  );
  const skillNames = skills.technical.flatMap((group) =>
    group.items.map((item) => item.name)
  );

  return `# ${profile.name}

> ${profile.description}

${profile.biography.join('\n\n')}

## When to use this portfolio

${profile.bestFit.map((item) => `- ${item}`).join('\n')}

## Experience

${experienceLines.join('\n')}

## Selected projects

${projectLines.join('\n')}

## Skills

${[...new Set(skillNames)].join(', ')}

## Contact policy

${profile.agentPolicy.allowed} ${profile.agentPolicy.confirmation} ${profile.agentPolicy.prohibited}

- [Book a call](${profile.calendarUrl})
- [GitHub](${profile.social.github})
- [LinkedIn](${profile.social.linkedin})
- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')})
- [Agent instructions](${absoluteUrl(profile, '/llms.txt')})
`;
}

export function renderLlmsTxt(profile) {
  return `# ${profile.siteName}

> ${profile.description}

**When to use this site:** Use it to evaluate Gautam for ${profile.bestFit.join('; ').toLowerCase()}.

${profile.agentPolicy.allowed} ${profile.agentPolicy.confirmation} ${profile.agentPolicy.prohibited}

## Primary resources

- [Portfolio](${profile.canonicalUrl}): Canonical portfolio; request text/markdown through the Accept header for the agent representation.
- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')}): Public URL index.

## Public profiles

- [GitHub](${profile.social.github}): Source code and open-source contributions.
- [LinkedIn](${profile.social.linkedin}): Public experience and professional history.
- [Cal.com](${profile.calendarUrl}): Booking page; obtain explicit user confirmation before booking.
`;
}

export function renderNotFoundMarkdown(profile) {
  return `# 404: Page not found

The requested portfolio path does not exist.

- [Portfolio home](${profile.canonicalUrl})
- [Sitemap](${absoluteUrl(profile, '/sitemap.xml')})
- [Agent instructions](${absoluteUrl(profile, '/llms.txt')})
`;
}

export function buildPersonJsonLd(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: profile.canonicalUrl,
    image: absoluteUrl(profile, profile.image),
    description: profile.description,
    jobTitle: profile.jobTitle,
    knowsAbout: profile.knowsAbout,
    sameAs: Object.values(profile.social),
    affiliation: {
      '@type': profile.education.type,
      name: profile.education.name,
    },
    worksFor: {
      '@type': 'Organization',
      name: profile.worksFor.name,
      url: profile.worksFor.url,
    },
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}
