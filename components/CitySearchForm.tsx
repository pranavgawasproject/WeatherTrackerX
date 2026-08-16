'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { slugifyCity } from '@/lib/weather';

interface CitySearchFormProps {
  /** Optional initial value (e.g. last searched city). Defaults to ''. */
  initialValue?: string;
  /** Input placeholder override. */
  placeholder?: string;
  /** Optional compact mode for headers / sidebars. */
  compact?: boolean;
}

/**
 * Search box that navigates to /weather/[city-slug] on submit.
 *
 * This is the primary client-side entry point — typing a city name and
 * hitting enter triggers `router.push('/weather/' + slugifyCity(name))`,
 * which then hits the SSR city page (pre-rendered if the city is in
 * `POPULAR_CITIES`, otherwise generated on-demand via ISR).
 */
export default function CitySearchForm({
  initialValue = '',
  placeholder = 'Search any city — e.g. London, Tokyo, São Paulo',
  compact = false,
}: CitySearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter a city name.');
      return;
    }
    setError(null);
    const slug = slugifyCity(trimmed);
    if (!slug) {
      setError('Please enter a valid city name.');
      return;
    }
    router.push(`/weather/${slug}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search city weather"
      className="w-full"
    >
      <div
        className={`flex flex-col sm:flex-row gap-3 ${
          compact ? 'max-w-md' : 'max-w-xl'
        } mx-auto`}
      >
        <input
          type="text"
          name="city"
          aria-label="City name"
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          className="input input-bordered input-primary w-full bg-base-100"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
        />
        <button
          type="submit"
          className={`btn btn-primary ${compact ? 'btn-md' : 'btn-lg'} whitespace-nowrap`}
        >
          Get Weather
        </button>
      </div>
      {error ? (
        <p
          role="alert"
          className="mt-2 text-sm text-error text-center"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
