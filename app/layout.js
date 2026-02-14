import './globals.css';
import { Rubik, Special_Elite } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import StarBackground from './components/StarBackground';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  variable: '--font-typewriter',
  weight: '400',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteTitle = 'Gautam Manchandani - Portfolio';
const siteDescription =
  'Personal portfolio of Gautam Manchandani, showcasing open-source engineering, AI projects, and product-focused development work.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Gautam Manchandani',
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: '/',
    type: 'website',
    images: [
      {
        url: '/GM_PIC.webp',
        width: 1200,
        height: 1200,
        alt: 'Gautam Manchandani',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    creator: '@GautamM96',
    images: ['/GM_PIC.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${specialElite.variable} antialiased`}>
        <StarBackground />
        <div className="app-bg">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
