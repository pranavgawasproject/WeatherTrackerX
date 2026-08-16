import type { Metadata } from 'next';
import {
  decodeCitySlug,
  POPULAR_CITIES,
} from '@/lib/weather';
import type {
  ForecastData,
  WeatherData,
} from '@/lib/types';
import WeatherDisplay from '@/components/WeatherDisplay';

/**
 * Incremental Static Regeneration — revalidate every 30 minutes (1800s).
 *
 * For cities in POPULAR_CITIES, this page is pre-rendered at build time
 * (see `generateStaticParams` below). For any other city, the first
 * request triggers an on-demand SSR render which is then cached for
 * 30 minutes here too.
 */
export const revalidate = 1800;

/**
 * Pre-render the 40 popular city pages at build time so they ship as
 * static HTML in the production output. Any other city falls back to
 * on-demand SSR (Next.js default behaviour — `dynamicParams` defaults
 * to `true`).
 */
export async function generateStaticParams() {
  return POPULAR_CITIES.map((city) => ({ city }));
}

/**
 * Per-city metadata — drives long-tail SEO traffic.
 *
 * Each pre-rendered city page gets its own <title>, description, OG and
 * Twitter card. The canonical URL is `https://.../weather/{slug}`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = decodeCitySlug(city);

  return {
    title: `Weather in ${cityName} — Live Forecast & 5-Day Outlook`,
    description: `Current weather, hourly forecast, and 5-day outlook for ${cityName}. Temperature, humidity, wind speed, pressure, and conditions updated every 30 minutes.`,
    alternates: {
      canonical: `/weather/${city}`,
    },
    openGraph: {
      title: `Weather in ${cityName} — Live Forecast`,
      description: `Current conditions, 24-hour outlook, and 5-day forecast for ${cityName}. Updated every 30 minutes.`,
      url: `/weather/${city}`,
      type: 'website',
      siteName: 'WeatherTrackerX',
    },
    twitter: {
      card: 'summary',
      title: `Weather in ${cityName}`,
      description: `Current conditions and 5-day forecast for ${cityName}.`,
    },
    other: {
      // Helpful for crawlers that look for the city name in meta tags
      'geo.region': 'worldwide',
      'geo.placename': cityName,
    },
  };
}

interface WeatherFetchResult {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  error: string | null;
}

/**
 * Server-side weather fetch. The OpenWeatherMap API key is read from
 * `process.env.OPENWEATHER_API_KEY` (server-only — NOT `NEXT_PUBLIC_`)
 * so it never leaks to the browser.
 *
 * When the key is missing, we return a graceful fallback (null weather
 * + null forecast + an error string) so the page still renders with
 * the city name in the HTML — useful both for the build (which would
 * otherwise fail trying to fetch with an empty key) and for SEO
 * (the city name + page structure are still in the SSR HTML).
 */
async function fetchWeather(cityName: string): Promise<WeatherFetchResult> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      weather: null,
      forecast: null,
      error: 'OpenWeatherMap API key not configured',
    };
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityName,
  )}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    cityName,
  )}&appid=${apiKey}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl, {
        next: { revalidate: 1800, tags: ['weather', `weather-${cityName.toLowerCase()}`] },
      }),
      fetch(forecastUrl, {
        next: { revalidate: 1800, tags: ['forecast', `forecast-${cityName.toLowerCase()}`] },
      }),
    ]);

    let weather: WeatherData | null = null;
    let forecast: ForecastData | null = null;

    if (currentRes.ok) {
      weather = (await currentRes.json()) as WeatherData;
    }
    if (forecastRes.ok) {
      forecast = (await forecastRes.json()) as ForecastData;
    }

    // OpenWeatherMap returns 200 with `cod: "404"` in the JSON body when
    // a city isn't found — handle both shapes (cod is a number for the
    // /weather endpoint and a string for the /forecast endpoint).
    const weatherCod = weather ? String(weather.cod) : '';
    const forecastCod = forecast ? String(forecast.cod) : '';
    if (weatherCod === '404' || forecastCod === '404') {
      return {
        weather: null,
        forecast: null,
        error: `Weather data for "${cityName}" was not found`,
      };
    }

    if (!weather || !forecast) {
      return {
        weather,
        forecast,
        error: 'Weather data unavailable right now',
      };
    }

    return { weather, forecast, error: null };
  } catch {
    return {
      weather: null,
      forecast: null,
      error: 'Failed to fetch weather data',
    };
  }
}

interface PageProps {
  params: Promise<{ city: string }>;
}

export default async function CityWeatherPage({ params }: PageProps) {
  const { city: slug } = await params;
  const cityName = decodeCitySlug(slug);
  const { weather, forecast, error } = await fetchWeather(cityName);

  return (
    <WeatherDisplay
      city={cityName}
      slug={slug}
      weather={weather}
      forecast={forecast}
      error={error}
    />
  );
}
