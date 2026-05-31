type OpenMeteoDaily = {
  time: string[];
  temperature_2m_min?: number[];
  temperature_2m_max?: number[];
  relative_humidity_2m_max?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  weather_code?: number[];
};

type OpenMeteoHourly = {
  time: string[];
  precipitation_probability?: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
  temperature_2m?: number[];
};

type OpenMeteoResponse = {
  daily?: OpenMeteoDaily;
  hourly?: OpenMeteoHourly;
};

function toKolkataDateString(dt: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(dt);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

function getKolkataHour(dt: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(dt);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "0";
  return Number(hour);
}

function buildAdvisory(rainChance: number, scope: "today" | "tomorrow"): string {
  if (rainChance >= 70) {
    return scope === "tomorrow"
      ? "Rain expected tomorrow evening. Carry an umbrella and secure loose farm inputs."
      : "Rain possible today. Avoid field work during heavy showers.";
  }
  if (rainChance >= 40) {
    return scope === "tomorrow"
      ? "Light rain may occur tomorrow evening. Keep a rain cover ready."
      : "Light showers possible today. Plan field work accordingly.";
  }
  return scope === "tomorrow"
    ? "No significant rain expected tomorrow evening."
    : "Weather looks mostly clear today.";
}

function weatherCodeToCondition(code?: number): string | null {
  if (code == null || Number.isNaN(code)) return null;
  // Open-Meteo groups: keep it simple for farmer-friendly advisory.
  // 0: Clear sky, 1-2: Mainly clear, 3: Overcast, 45-48: Fog, 51-57 Drizzle, 61-67 Rain, 71-77 Snow, 80-82 rain showers.
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 2) return "Mostly clear";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 80 && code <= 82) return "Rain showers";
  return "Mixed conditions";
}

const LOCATION_BY_NAME: Record<
  string,
  { latitude: number; longitude: number }
> = {
  Karaikudi: { latitude: 10.0453, longitude: 78.7923 },
  Sivaganga: { latitude: 9.8667, longitude: 78.5347 },
};

export async function fetchOpenMeteoWeatherForecast(location_name: string) {
  const loc = LOCATION_BY_NAME[location_name];
  if (!loc) {
    throw new Error(`Open-Meteo provider: unsupported location "${location_name}"`);
  }

  // Ask for daily (for temperature/humidity) and hourly (to derive "tomorrow evening").
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    "&timezone=Asia%2FKolkata" +
    "&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,precipitation_probability_max,wind_speed_10m_max,weather_code" +
    "&forecast_days=2" +
    "&hourly=precipitation_probability,relative_humidity_2m,wind_speed_10m,temperature_2m" +
    "&forecast_hours=48";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as OpenMeteoResponse;
  const daily = json.daily;
  const hourly = json.hourly;

  if (!daily?.time?.length || !hourly?.time?.length) {
    throw new Error("Open-Meteo response missing daily/hourly blocks");
  }

  const now = new Date();
  const today = toKolkataDateString(now);
  const tomorrowDt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrow = toKolkataDateString(tomorrowDt);

  const findDailyIdx = (date: string) => daily.time.findIndex((t) => t === date);
  const idxToday = findDailyIdx(today);
  const idxTomorrow = findDailyIdx(tomorrow);

  if (idxToday < 0 || idxTomorrow < 0) {
    throw new Error("Open-Meteo did not return expected forecast dates");
  }

  const rainToday =
    daily.precipitation_probability_max?.[idxToday] ??
    daily.precipitation_probability_max?.[0] ??
    null;

  const rainTomorrowDaily =
    daily.precipitation_probability_max?.[idxTomorrow] ??
    daily.precipitation_probability_max?.[1] ??
    null;

  // Derive "tomorrow evening" rain chance from hourly precipitation probability during 17:00-21:00.
  const hourIdxs: number[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const dt = new Date(hourly.time[i]);
    const d = toKolkataDateString(dt);
    const h = getKolkataHour(dt);
    if (d === tomorrow && h >= 17 && h <= 21) {
      hourIdxs.push(i);
    }
  }

  const eveningRain = (() => {
    if (hourIdxs.length === 0) return rainTomorrowDaily;
    let max = -1;
    for (const i of hourIdxs) {
      const v = hourly.precipitation_probability?.[i];
      if (typeof v === "number" && v > max) max = v;
    }
    return max >= 0 ? max : rainTomorrowDaily;
  })();

  const todayCondition = weatherCodeToCondition(daily.weather_code?.[idxToday]);
  const tomorrowCondition = weatherCodeToCondition(daily.weather_code?.[idxTomorrow]);

  const todayPayload = {
    forecast_date: today,
    location_name,
    temp_min: daily.temperature_2m_min?.[idxToday] ?? undefined,
    temp_max: daily.temperature_2m_max?.[idxToday] ?? undefined,
    condition: todayCondition ?? undefined,
    humidity: daily.relative_humidity_2m_max?.[idxToday] ?? undefined,
    wind_speed: daily.wind_speed_10m_max?.[idxToday] ?? undefined,
    rain_probability: rainToday ?? undefined,
    advisory_text: todayCondition
      ? `Today: ${todayCondition}.`
      : buildAdvisory(Number(rainToday ?? 0), "today"),
  };

  const tomorrowPayload = {
    forecast_date: tomorrow,
    location_name,
    temp_min: daily.temperature_2m_min?.[idxTomorrow] ?? undefined,
    temp_max: daily.temperature_2m_max?.[idxTomorrow] ?? undefined,
    condition: tomorrowCondition ?? undefined,
    humidity: daily.relative_humidity_2m_max?.[idxTomorrow] ?? undefined,
    wind_speed: daily.wind_speed_10m_max?.[idxTomorrow] ?? undefined,
    rain_probability: eveningRain ?? undefined,
    advisory_text: buildAdvisory(Number(eveningRain ?? 0), "tomorrow"),
  };

  return { today: todayPayload, tomorrow: tomorrowPayload };
}

