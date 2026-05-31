import { agriRepository } from "./repository";
import { fetchOpenMeteoWeatherForecast } from "./open-meteo.provider";
import type {
  CreateAgriServiceInput,
  CreateAgriSchemeInput,
  CreateLaborInput,
  CreateMandiPriceInput,
  ListAgriSchemesQuery,
  UpsertWeatherInput,
} from "./schemas";

export const agriService = {
  listMandiPrices(cropName?: string, date?: string) {
    return agriRepository.listMandiPrices(cropName, date);
  },

  getWeather(location?: string) {
    return agriRepository.getLatestWeather(location);
  },

  getWeatherSummary(location?: string) {
    const target = location ?? "Karaikudi";
    return (async () => {
      const summary = await agriRepository.getWeatherSummary(target);
      const lastMs = summary.last_updated_at
        ? new Date(summary.last_updated_at).getTime()
        : null;

      const stale =
        !lastMs || Date.now() - lastMs > 2 * 60 * 60 * 1000; // 2 hours

      if (!stale && summary.has_today && summary.has_tomorrow) return summary;

      const { today, tomorrow } = await fetchOpenMeteoWeatherForecast(target);
      await agriRepository.upsertWeather(today);
      await agriRepository.upsertWeather(tomorrow);

      return agriRepository.getWeatherSummary(target);
    })();
  },

  listServices() {
    return agriRepository.listServices();
  },

  registerLabor(input: CreateLaborInput, userId: string) {
    return agriRepository.registerLabor(input, userId);
  },

  getLaborRegistration(userId: string) {
    return agriRepository.getLaborByUser(userId);
  },

  createMandiPrice(input: CreateMandiPriceInput) {
    return agriRepository.createMandiPrice(input);
  },

  upsertWeather(input: UpsertWeatherInput) {
    return agriRepository.upsertWeather(input);
  },

  createService(input: CreateAgriServiceInput) {
    return agriRepository.createService(input);
  },

  listSchemes(query: ListAgriSchemesQuery) {
    return agriRepository.listAgriSchemes(query);
  },

  createScheme(input: CreateAgriSchemeInput) {
    return agriRepository.createScheme(input);
  },
};
