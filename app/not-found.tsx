import Link from 'next/link';
import type { Metadata } from 'next';
import CitySearchForm from '@/components/CitySearchForm';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'The weather page you were looking for could not be found. Search for any city to see its live forecast.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300 px-4">
      <div className="card bg-base-100 shadow-xl border border-base-200 max-w-lg w-full">
        <div className="card-body p-8 text-center">
          <div className="text-6xl mb-4" aria-hidden="true">
            🌫️
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            404 — Page not found
          </h1>
          <p className="mt-3 text-base-content/70">
            We couldn&apos;t find the weather page you were looking for.
            Search for any city below to see its live forecast.
          </p>

          <div className="mt-6">
            <CitySearchForm />
          </div>

          <div className="mt-6">
            <Link href="/" className="link link-primary">
              ← Back to WeatherTrackerX home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
