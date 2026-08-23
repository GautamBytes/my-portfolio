import { siteProfile } from './data/site-profile.mjs';

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteProfile.canonicalUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
