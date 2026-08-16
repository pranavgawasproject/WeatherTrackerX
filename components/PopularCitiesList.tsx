import Link from 'next/link';
import {
  POPULAR_CITIES,
  POPULAR_CITY_LABELS,
} from '@/lib/weather';

interface PopularCitiesListProps {
  /** Limit the number of cities shown. Pass `undefined` to show all 40. */
  limit?: number;
  /** Render as a compact horizontal wrap (chips) instead of a grid. */
  asChips?: boolean;
}

/**
 * Server Component that renders internal links to the pre-rendered city
 * pages. Each link is a real `<a href="/weather/{slug}">` so crawlers can
 * follow them and discover the per-city SSR pages — this is the SEO
 * payoff of having `generateStaticParams` enumerate the popular cities.
 */
export default function PopularCitiesList({
  limit,
  asChips = false,
}: PopularCitiesListProps) {
  const cities = limit
    ? POPULAR_CITIES.slice(0, limit)
    : (POPULAR_CITIES as readonly string[]);

  if (asChips) {
    return (
      <ul className="flex flex-wrap gap-2 justify-center">
        {cities.map((slug) => (
          <li key={slug}>
            <Link
              href={`/weather/${slug}`}
              className="badge badge-lg badge-outline hover:badge-primary transition-colors"
            >
              {POPULAR_CITY_LABELS[slug] ?? slug}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {cities.map((slug) => (
        <Link
          key={slug}
          href={`/weather/${slug}`}
          className="card bg-base-100 hover:bg-base-200 transition-colors shadow-md hover:shadow-xl border border-base-200"
        >
          <div className="card-body p-4 items-center text-center">
            <span className="text-lg font-semibold">
              {POPULAR_CITY_LABELS[slug] ?? slug}
            </span>
            <span className="text-xs text-base-content/60">
              View forecast →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
