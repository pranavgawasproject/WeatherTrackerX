import type { MetadataRoute } from 'next';
import { POPULAR_CITIES } from '@/lib/weather';

const SITE_URL = 'https://weathertrackerx-pranav.vercel.app';

/**
 * Sitemap enumerates the landing page plus every pre-rendered city page.
 *
 * City pages are marked `changeFrequency: 'hourly'` because the page
 * revalidates every 30 minutes via ISR (see `revalidate` in
 * `app/weather/[city]/page.tsx`). Crawlers are encouraged to revisit
 * frequently to pick up fresh weather conditions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...POPULAR_CITIES.map((city) => ({
      url: `${SITE_URL}/weather/${city}`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
  ];
}
