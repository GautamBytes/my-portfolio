import { siteProfile } from './data/site-profile.mjs';

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteProfile.canonicalUrl;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
