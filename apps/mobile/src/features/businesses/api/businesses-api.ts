import { API_ROUTES } from "@mykaraikudi/constants";

import type { Business, BusinessListParams } from "../types";
import { MOCK_BUSINESSES } from "../data/mock-businesses";

const getBaseUrl = () => process.env.EXPO_PUBLIC_API_URL ?? "";

/**
 * Future: GET /api/v1/businesses
 * Query: search, category_id, location, page, limit, seed
 */
export async function fetchBusinesses(
  _params?: BusinessListParams
): Promise<Business[]> {
  // const res = await fetch(`${getBaseUrl()}${API_ROUTES.businesses}?...`);
  void getBaseUrl();
  void API_ROUTES.businesses;
  return MOCK_BUSINESSES;
}

/**
 * Future: GET /api/v1/businesses/categories
 */
export async function fetchBusinessCategories() {
  void getBaseUrl();
  return [];
}

/**
 * Future: POST /api/v1/businesses (auth required)
 */
export async function registerBusiness(_payload: unknown): Promise<void> {
  void getBaseUrl();
  throw new Error("Business registration API not connected yet");
}
