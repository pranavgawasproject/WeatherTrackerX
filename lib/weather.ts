import type {
  DailyForecast,
  ForecastItem,
  HourlySlot,
} from '@/lib/types';

/**
 * Canonical list of cities that are pre-rendered at build time via
 * `generateStaticParams`. Each entry is a URL-safe slug (lowercase,
 * spaces → hyphens). The pretty name is recovered with `decodeCitySlug`.
 *
 * Order matters for the popular-cities index page, not for the sitemap.
 * Keep this list in sync with the same constant in:
 *   - app/weather/[city]/page.tsx
 *   - app/sitemap.ts
 *   - components/PopularCitiesList.tsx
 */
export const POPULAR_CITIES: readonly string[] = [
  'london',
  'new-york',
  'tokyo',
  'paris',
  'sydney',
  'berlin',
  'mumbai',
  'delhi',
  'bangalore',
  'singapore',
  'dubai',
  'hong-kong',
  'los-angeles',
  'chicago',
  'toronto',
  'moscow',
  'rio-de-janeiro',
  'cairo',
  'istanbul',
  'rome',
  'madrid',
  'barcelona',
  'amsterdam',
  'vienna',
  'prague',
  'stockholm',
  'copenhagen',
  'dublin',
  'lisbon',
  'athens',
  'bangkok',
  'seoul',
  'shanghai',
  'beijing',
  'jakarta',
  'manila',
  'mexico-city',
  'buenos-aires',
  'lima',
  'sao-paulo',
] as const;

/** Pretty label for each popular city slug (used by the index list). */
export const POPULAR_CITY_LABELS: Record<string, string> = Object.fromEntries(
  POPULAR_CITIES.map((slug) => [slug, decodeCitySlug(slug)]),
);

/**
 * Convert a URL-safe city slug into a pretty display name.
 *   "new-york"        → "New York"
 *   "rio-de-janeiro"  → "Rio De Janeiro"
 *   "london"          → "London"
 *
 * Each hyphen-separated word is title-cased; multiple hyphens collapse to
 * a single space (so "sao--paulo" wouldn't sneak through with a gap).
 */
export function decodeCitySlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.trim())
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert a user-typed city name into a URL-safe slug.
 *   "New York"      → "new-york"
 *   "  São Paulo "  → "são-paulo"
 *   "Río De Janeiro" → "río-de-janeiro"
 *
 * Lowercases, trims, collapses internal whitespace, replaces runs of
 * whitespace with a single hyphen. Non-ASCII characters are preserved
 * (OpenWeatherMap accepts them; the slug still works in URL paths).
 */
export function slugifyCity(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Format a celsius temperature as a rounded integer with °C suffix. */
export function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°C`;
}

/** Format wind speed (m/s) as km/h. */
export function formatWind(metersPerSecond: number): string {
  return `${Math.round(metersPerSecond * 3.6)} km/h`;
}

/**
 * Aggregate the 3-hour forecast list into a per-day summary.
 *
 * OpenWeatherMap's /forecast endpoint returns up to 40 entries (5 days × 8
 * slots). We group by the YYYY-MM-DD portion of `dt_txt` and emit one
 * `DailyForecast` per day, using:
 *   - min/max temp = the day's min/max across all 3-hour slots
 *   - icon + description = the slot closest to 12:00 local (midday)
 *   - pop = the max probability of precipitation across the day's slots
 */
export function aggregateForecast(list: ForecastItem[]): DailyForecast[] {
  const byDate = new Map<string, ForecastItem[]>();

  for (const item of list) {
    // dt_txt looks like "2024-08-16 12:00:00"
    const date = item.dt_txt.split(' ')[0];
    if (!date) continue;
    const bucket = byDate.get(date);
    if (bucket) {
      bucket.push(item);
    } else {
      byDate.set(date, [item]);
    }
  }

  const days: DailyForecast[] = [];

  for (const [date, items] of byDate) {
    let minTemp = Number.POSITIVE_INFINITY;
    let maxTemp = Number.NEGATIVE_INFINITY;
    let pop = 0;

    // Pick the slot whose hour is closest to 12:00 (midday representative).
    let middayItem: ForecastItem | null = null;
    let middayDistance = Number.POSITIVE_INFINITY;

    for (const item of items) {
      const hourPart = item.dt_txt.split(' ')[1] ?? '00:00:00';
      const hour = parseInt(hourPart.slice(0, 2), 10) || 0;

      if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
      if (item.pop > pop) pop = item.pop;

      const distance = Math.abs(hour - 12);
      if (distance < middayDistance) {
        middayDistance = distance;
        middayItem = item;
      }
    }

    const representative = middayItem ?? items[0];
    if (!representative) continue;

    const weekday = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    });

    days.push({
      date,
      weekday,
      minTemp,
      maxTemp,
      icon: representative.weather[0]?.icon ?? '01d',
      description: representative.weather[0]?.description ?? '—',
      pop,
    });
  }

  // Sort ascending by date so the strip reads left-to-right.
  return days.sort((a, b) => (a.date < b.date ? -1 : 1));
}

/**
 * Extract the next N 3-hour slots (default 8 = 24 hours) as HourlySlot
 * objects for the hourly strip.
 */
export function extractHourly(list: ForecastItem[], count = 8): HourlySlot[] {
  return list.slice(0, count).map((item) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours().toString().padStart(2, '0');
    return {
      dt: item.dt,
      hour: `${hour}:00`,
      temp: item.main.temp,
      icon: item.weather[0]?.icon ?? '01d',
      description: item.weather[0]?.description ?? '—',
      pop: item.pop,
    };
  });
}

/** Convert an OpenWeatherMap icon code into its 4x-pixel CDN URL. */
export function iconUrlLarge(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

/** Convert an OpenWeatherMap icon code into its 2x-pixel CDN URL. */
export function iconUrlSmall(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Format a unix timestamp (seconds) into a human-friendly local time string.
 * Accepts an optional IANA timezone (e.g. "Europe/London") so the displayed
 * time matches the city's local clock rather than the server's.
 */
export function formatLocalTime(
  unixSeconds: number,
  timezone?: string,
): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });
}
