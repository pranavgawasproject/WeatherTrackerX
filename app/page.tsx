import type { Metadata } from 'next';
import Link from 'next/link';
import CitySearchForm from '@/components/CitySearchForm';
import PopularCitiesList from '@/components/PopularCitiesList';
import { POPULAR_CITIES } from '@/lib/weather';

export const metadata: Metadata = {
  title:
    'WeatherTrackerX — Live Weather Forecast & 5-Day Outlook for Any City',
  description:
    'Get live weather forecasts for any city worldwide. WeatherTrackerX shows current conditions, a 24-hour hourly outlook, and a 5-day forecast with temperature, humidity, wind speed, and precipitation probability. Free and updated every 30 minutes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WeatherTrackerX — Live Weather Forecast & 5-Day Outlook',
    description:
      'Live current conditions, hourly outlook, and 5-day forecast for any city worldwide.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'WeatherTrackerX — Live Weather Forecast',
    description:
      'Live current conditions, hourly outlook, and 5-day forecast for any city worldwide.',
  },
};

const FEATURES = [
  {
    title: 'Live current conditions',
    body: 'Temperature, feels-like, humidity, wind speed, pressure, visibility, sunrise & sunset for any city.',
  },
  {
    title: '24-hour hourly outlook',
    body: 'See exactly when rain, snow, or temperature shifts will hit, broken down in 3-hour increments.',
  },
  {
    title: '5-day forecast',
    body: 'Daily high/low temperatures, precipitation probability, and the dominant weather condition for each day.',
  },
  {
    title: 'Updated every 30 minutes',
    body: 'Pages revalidate via ISR — search engines and visitors always see freshly-fetched conditions.',
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-500 via-sky-400 to-sky-200 text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-28 max-w-5xl text-center">
          <span className="badge badge-ghost bg-white/20 text-white border-white/30 backdrop-blur mb-4">
            Live · Updated every 30 minutes
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-sm">
            Live Weather Forecast for Any City
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            WeatherTrackerX shows current conditions, a 24-hour hourly
            outlook, and a 5-day forecast — pre-rendered for{' '}
            <span className="font-semibold">
              {POPULAR_CITIES.length}+ popular cities
            </span>{' '}
            and any other city on demand.
          </p>

          <div className="mt-8">
            <CitySearchForm />
          </div>

          <p className="mt-3 text-sm text-white/70">
            Try:{' '}
            <Link
              href="/weather/london"
              className="underline underline-offset-2 hover:text-white"
            >
              London
            </Link>
            ,{' '}
            <Link
              href="/weather/new-york"
              className="underline underline-offset-2 hover:text-white"
            >
              New York
            </Link>
            ,{' '}
            <Link
              href="/weather/tokyo"
              className="underline underline-offset-2 hover:text-white"
            >
              Tokyo
            </Link>
            ,{' '}
            <Link
              href="/weather/paris"
              className="underline underline-offset-2 hover:text-white"
            >
              Paris
            </Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            What you get on every city page
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card bg-base-200/50 border border-base-200 shadow-sm"
              >
                <div className="card-body p-5">
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-base-content/70 text-sm">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular cities */}
      <section className="py-12 md:py-16 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Popular city forecasts
            </h2>
            <p className="mt-2 text-base-content/70">
              Pre-rendered and search-engine-indexable. Tap any city to see
              its live weather.
            </p>
          </div>
          <PopularCitiesList />
        </div>
      </section>

      {/* SEO copy */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="container mx-auto px-4 max-w-3xl prose prose-base">
          <h2 className="text-2xl font-bold">About WeatherTrackerX</h2>
          <p className="text-base-content/80">
            WeatherTrackerX is a free weather dashboard that pre-renders
            per-city pages so they&apos;re indexable by Google, Bing, and
            other search engines. Each city page is generated at build time
            using Next.js&apos;s <code>generateStaticParams</code> and
            incrementally revalidated every 30 minutes via ISR (Incremental
            Static Regeneration), so the conditions you see are always
            fresh.
          </p>
          <p className="text-base-content/80">
            Weather data is fetched from the{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              OpenWeatherMap API
            </a>{' '}
            on the server — your API key is never exposed to the browser.
            For cities not in the popular list above, the page is generated
            on-demand on first visit and then cached for 30 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-base-300 border-t border-base-200">
        <div className="container mx-auto px-4 py-6 max-w-5xl text-sm text-base-content/60 text-center">
          <p>
            Weather data provided by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              OpenWeatherMap
            </a>
            . Built with Next.js 15 App Router + ISR.
          </p>
        </div>
      </footer>
    </main>
  );
}
