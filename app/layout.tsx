import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const SITE_URL = 'https://weathertrackerx-pranav.vercel.app';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'WeatherTrackerX — Live Weather Forecast & 5-Day Outlook for Any City',
    template: '%s | WeatherTrackerX',
  },
  description:
    'WeatherTrackerX shows live current conditions, a 24-hour hourly outlook, and a 5-day forecast for any city worldwide. Free, fast, and SEO-optimized per-city weather pages updated every 30 minutes.',
  keywords: [
    'weather tracker',
    'live weather forecast',
    '5-day forecast',
    'weather by city',
    'hourly weather',
    'current temperature',
    'weather dashboard',
    'weathertrackerx',
    'weather report',
    'local weather',
  ],
  authors: [{ name: 'WeatherTrackerX' }],
  creator: 'WeatherTrackerX',
  publisher: 'WeatherTrackerX',
  applicationName: 'WeatherTrackerX',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/vite.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'WeatherTrackerX',
    locale: 'en_US',
    url: SITE_URL,
    title: 'WeatherTrackerX — Live Weather Forecast & 5-Day Outlook',
    description:
      'Live current conditions, hourly outlook, and 5-day forecast for any city worldwide. Updated every 30 minutes.',
  },
  twitter: {
    card: 'summary',
    title: 'WeatherTrackerX — Live Weather Forecast & 5-Day Outlook',
    description:
      'Live current conditions, hourly outlook, and 5-day forecast for any city worldwide.',
  },
  alternates: {
    canonical: '/',
  },
  category: 'weather',
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'WeatherTrackerX',
      url: `${SITE_URL}/`,
      description:
        'Live weather dashboard for forecasts and historical data for any city.',
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#webapp`,
      name: 'WeatherTrackerX',
      url: `${SITE_URL}/`,
      description:
        'Track live weather forecasts and historical data for any city. Fast, free weather dashboard built with Next.js.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      featureList: [
        'Live current conditions',
        '24-hour hourly forecast',
        '5-day daily forecast',
        'Per-city pre-rendered pages',
        'Temperature, humidity, wind, pressure, visibility',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'WeatherTrackerX',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/weather/{search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body className="font-sans antialiased bg-base-200 text-base-content min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
