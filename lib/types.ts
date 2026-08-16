// Types matching OpenWeatherMap API response shapes.
// Reference: https://openweathermap.org/current#current_JSON and
//            https://openweathermap.org/forecast5#JSON

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindInfo {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudsInfo {
  all: number;
}

export interface SysInfo {
  type?: number;
  id?: number;
  country?: string;
  sunrise?: number;
  sunset?: number;
}

export interface CoordInfo {
  lon: number;
  lat: number;
}

/** Current weather — /data/2.5/weather response (units=metric). */
export interface WeatherData {
  coord: CoordInfo;
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WindInfo;
  clouds: CloudsInfo;
  dt: number;
  sys: SysInfo;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/** A single 3-hour entry inside the forecast `list` array. */
export interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  clouds: CloudsInfo;
  wind: WindInfo;
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

/** 5-day / 3-hour forecast — /data/2.5/forecast response (units=metric). */
export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: CoordInfo;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/** Aggregated per-day summary derived from the 3-hour forecast list. */
export interface DailyForecast {
  /** ISO date (YYYY-MM-DD) extracted from `dt_txt`. */
  date: string;
  /** Human-readable weekday, e.g. "Mon", "Tue". */
  weekday: string;
  minTemp: number;
  maxTemp: number;
  /** Midday forecast entry (closest to 12:00) used for icon + description. */
  icon: string;
  description: string;
  pop: number;
}

/** A 3-hour hourly slot used by the hourly strip (next 24h). */
export interface HourlySlot {
  dt: number;
  hour: string;
  temp: number;
  icon: string;
  description: string;
  pop: number;
}
