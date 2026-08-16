import Link from 'next/link';
import type {
  DailyForecast,
  ForecastData,
  HourlySlot,
  WeatherData,
} from '@/lib/types';
import {
  aggregateForecast,
  extractHourly,
  formatLocalTime,
  formatTemp,
  formatWind,
  iconUrlLarge,
  iconUrlSmall,
} from '@/lib/weather';
import CitySearchForm from '@/components/CitySearchForm';

interface WeatherDisplayProps {
  /** Pretty (decoded) city name — e.g. "New York". */
  city: string;
  /** URL-safe slug — used for canonical/refresh link. */
  slug: string;
  /** Current weather payload, or null when API key missing / fetch failed. */
  weather: WeatherData | null;
  /** 5-day / 3-hour forecast payload, or null. */
  forecast: ForecastData | null;
  /** Human-readable error string when data couldn't be fetched. */
  error: string | null;
}

/**
 * Server Component that renders the per-city weather page. Pure
 * presentational — no hooks, no client-side fetching. All data fetching
 * happens in `app/weather/[city]/page.tsx` (Server Component) and is
 * passed in as props so the entire HTML output is SSR + crawlable.
 */
export default function WeatherDisplay({
  city,
  slug,
  weather,
  forecast,
  error,
}: WeatherDisplayProps) {
  const daily: DailyForecast[] = forecast?.list
    ? aggregateForecast(forecast.list)
    : [];
  const hourly: HourlySlot[] = forecast?.list
    ? extractHourly(forecast.list, 8)
    : [];

  const countryCode = weather?.sys?.country;
  const heading = countryCode ? `${city}, ${countryCode}` : city;
  const timezone = weather?.timezone
    ? `UTC${weather.timezone >= 0 ? '+' : ''}${weather.timezone / 3600}`
    : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Header */}
      <header className="bg-base-100/80 backdrop-blur border-b border-base-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight hover:text-primary transition-colors"
          >
            <span aria-hidden="true">🌤️</span>{' '}
            <span className="hidden sm:inline">WeatherTrackerX</span>
          </Link>
          <div className="flex-1 max-w-md">
            <CitySearchForm compact placeholder="Search another city…" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
        {/* Heading */}
        <section className="mb-8">
          <nav aria-label="Breadcrumb" className="text-sm breadcrumbs mb-2">
            <ol className="flex gap-2 text-base-content/60">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-base-content/80 font-medium">{city}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Weather in {heading}
          </h1>
          <p className="mt-2 text-base-content/70">
            Live current conditions, next-24-hour outlook, and 5-day forecast
            for {city}. Updated every 30 minutes.
            {timezone ? (
              <span className="ml-1 text-base-content/50">
                (Local {timezone})
              </span>
            ) : null}
          </p>
        </section>

        {/* Error / placeholder path — still SSR with the city name */}
        {error ? (
          <FallbackNotice city={city} slug={slug} error={error} />
        ) : null}

        {/* Current weather */}
        {weather ? (
          <section
            aria-labelledby="current-heading"
            className="card bg-base-100 shadow-xl border border-base-200 mb-8"
          >
            <div className="card-body p-6 md:p-8">
              <h2
                id="current-heading"
                className="text-xl font-semibold text-base-content/70"
              >
                Current Conditions
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                <img
                  src={iconUrlLarge(weather.weather[0]?.icon ?? '01d')}
                  alt={weather.weather[0]?.description ?? 'weather icon'}
                  width={160}
                  height={160}
                  className="w-32 h-32 md:w-40 md:h-40"
                  loading="eager"
                />
                <div className="text-center md:text-left flex-1">
                  <div className="text-6xl md:text-7xl font-bold tracking-tight">
                    {formatTemp(weather.main.temp)}
                  </div>
                  <div className="text-lg md:text-xl capitalize text-base-content/80 mt-1">
                    {weather.weather[0]?.description}
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    Feels like {formatTemp(weather.main.feels_like)} ·
                    H: {formatTemp(weather.main.temp_max)} ·
                    L: {formatTemp(weather.main.temp_min)}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Stat label="Humidity" value={`${weather.main.humidity}%`} />
                <Stat
                  label="Wind"
                  value={formatWind(weather.wind.speed)}
                  hint={`from ${weather.wind.deg}°`}
                />
                <Stat
                  label="Pressure"
                  value={`${weather.main.pressure} hPa`}
                />
                <Stat
                  label="Visibility"
                  value={
                    weather.visibility
                      ? `${Math.round(weather.visibility / 1000)} km`
                      : '—'
                  }
                />
              </div>

              {weather.sys?.sunrise && weather.sys?.sunset ? (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Stat
                    label="Sunrise"
                    value={formatLocalTime(
                      weather.sys.sunrise,
                      timezone ? undefined : undefined,
                    )}
                  />
                  <Stat
                    label="Sunset"
                    value={formatLocalTime(weather.sys.sunset)}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Hourly forecast — next 24h */}
        {hourly.length > 0 ? (
          <section
            aria-labelledby="hourly-heading"
            className="card bg-base-100 shadow-md border border-base-200 mb-8"
          >
            <div className="card-body p-6">
              <h2
                id="hourly-heading"
                className="text-xl font-semibold mb-4"
              >
                Next 24 Hours
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                {hourly.map((slot) => (
                  <div
                    key={slot.dt}
                    className="flex flex-col items-center gap-1 snap-start min-w-[88px] p-3 rounded-lg bg-base-200/50"
                  >
                    <span className="text-sm font-medium text-base-content/70">
                      {slot.hour}
                    </span>
                    <img
                      src={iconUrlSmall(slot.icon)}
                      alt={slot.description}
                      width={50}
                      height={50}
                      loading="lazy"
                    />
                    <span className="text-base font-semibold">
                      {formatTemp(slot.temp)}
                    </span>
                    {slot.pop > 0 ? (
                      <span className="text-xs text-info">
                        💧 {Math.round(slot.pop * 100)}%
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Daily forecast — 5 days */}
        {daily.length > 0 ? (
          <section
            aria-labelledby="daily-heading"
            className="card bg-base-100 shadow-md border border-base-200 mb-8"
          >
            <div className="card-body p-6">
              <h2 id="daily-heading" className="text-xl font-semibold mb-4">
                5-Day Forecast
              </h2>
              <ul className="divide-y divide-base-200">
                {daily.map((day) => (
                  <li
                    key={day.date}
                    className="flex items-center gap-4 py-3"
                  >
                    <div className="w-14 font-semibold">{day.weekday}</div>
                    <img
                      src={iconUrlSmall(day.icon)}
                      alt={day.description}
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                    <div className="flex-1 capitalize text-base-content/80 text-sm hidden sm:block">
                      {day.description}
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      {day.pop > 0 ? (
                        <span className="text-xs text-info">
                          💧 {Math.round(day.pop * 100)}%
                        </span>
                      ) : null}
                      <span className="text-base-content/60 w-12 text-right">
                        {formatTemp(day.minTemp)}
                      </span>
                      <span className="text-base-content font-semibold w-12 text-right">
                        {formatTemp(day.maxTemp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* SEO copy */}
        <section className="prose prose-sm max-w-none mt-8 text-base-content/70">
          <h2 className="text-lg font-semibold text-base-content">
            About {city} weather
          </h2>
          <p>
            This page shows live weather data for {city}, including current
            temperature, humidity, wind speed, atmospheric pressure, and
            visibility. The hourly forecast shows the next 24 hours in
            3-hour increments, and the 5-day outlook below aggregates the
            OpenWeatherMap forecast model into daily high/low temperatures
            with precipitation probability.
          </p>
          <p>
            Data is fetched server-side from the OpenWeatherMap API and the
            page is revalidated every 30 minutes — so search engines and
            returning visitors always see freshly-updated conditions.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t border-base-200 text-sm text-base-content/60 text-center">
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
            . Updated every 30 minutes.
          </p>
        </footer>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg bg-base-200/50 p-3">
      <div className="text-xs uppercase tracking-wide text-base-content/60">
        {label}
      </div>
      <div className="text-lg font-semibold mt-1">{value}</div>
      {hint ? (
        <div className="text-xs text-base-content/50 mt-0.5">{hint}</div>
      ) : null}
    </div>
  );
}

function FallbackNotice({
  city,
  slug,
  error,
}: {
  city: string;
  slug: string;
  error: string;
}) {
  const isApiKeyMissing = error.toLowerCase().includes('api key');
  return (
    <section
      role="alert"
      className="card bg-base-100 border border-warning/40 shadow-md mb-8"
    >
      <div className="card-body p-6">
        <h2 className="text-lg font-semibold">
          Live weather data unavailable for {city}
        </h2>
        <p className="text-base-content/70">
          {isApiKeyMissing ? (
            <>
              The OpenWeatherMap API key is not configured on this server.
              Once an admin sets the <code className="kbd kbd-sm">OPENWEATHER_API_KEY</code>{' '}
              environment variable, this page will automatically populate
              with live conditions, an hourly outlook, and a 5-day forecast
              for {city} within 30 minutes.
            </>
          ) : (
            <>
              We couldn&apos;t fetch the latest weather for {city} right now.
              The page will retry automatically on the next visit. You can
              also try searching for a nearby city below.
            </>
          )}
        </p>
        <div className="mt-4">
          <CitySearchForm compact placeholder="Try another city…" />
        </div>
        <p className="text-xs text-base-content/50 mt-4">
          Page slug: <code>/weather/{slug}</code>
        </p>
      </div>
    </section>
  );
}
