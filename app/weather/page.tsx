import { redirect } from 'next/navigation';

/**
 * `/weather` without a city slug has no useful content — redirect to the
 * landing page where the search box lives. This avoids a soft-404 that
 * would dilute the SEO value of the per-city pages.
 */
export default function WeatherIndexRedirect() {
  redirect('/');
}
