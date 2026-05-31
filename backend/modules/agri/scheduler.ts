import { agriRepository } from "./repository";
import { fetchOpenMeteoWeatherForecast } from "./open-meteo.provider";

const LOCATIONS = ["Karaikudi", "Sivaganga"] as const;

const REFRESH_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

let started = false;

async function refreshAllLocations() {
  await Promise.all(
    LOCATIONS.map(async (location_name) => {
      try {
        const { today, tomorrow } = await fetchOpenMeteoWeatherForecast(location_name);
        await agriRepository.upsertWeather(today);
        await agriRepository.upsertWeather(tomorrow);
      } catch (err) {
        // Scheduler should never crash the API.
        // eslint-disable-next-line no-console
        console.warn(`[agri] weather refresh failed for ${location_name}:`, err);
      }
    })
  );
}

export function startAgriWeatherScheduler() {
  if (started) return;
  started = true;

  void refreshAllLocations();

  setInterval(() => {
    void refreshAllLocations();
  }, REFRESH_INTERVAL_MS);
}

