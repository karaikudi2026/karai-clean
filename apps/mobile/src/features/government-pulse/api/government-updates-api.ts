import type { GovernmentUpdate } from "../types";
import { GOVERNMENT_UPDATES } from "../data/mock-updates";

const getBaseUrl = () => process.env.EXPO_PUBLIC_API_URL ?? "";

/**
 * Future: GET /api/v1/government-updates
 */
export async function fetchGovernmentUpdates(): Promise<GovernmentUpdate[]> {
  void getBaseUrl();
  return GOVERNMENT_UPDATES;
}
