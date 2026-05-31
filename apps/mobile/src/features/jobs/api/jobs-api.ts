import { API_ROUTES } from "@mykaraikudi/constants";

import type { Job, JobListParams } from "../types";
import { MOCK_JOBS } from "../data/mock-jobs";

const getBaseUrl = () => process.env.EXPO_PUBLIC_API_URL ?? "";

/** Future: GET /api/v1/jobs */
export async function fetchJobs(_params?: JobListParams): Promise<Job[]> {
  void getBaseUrl();
  void API_ROUTES.jobs;
  return MOCK_JOBS;
}

/** Future: POST /api/v1/jobs */
export async function postJob(_payload: unknown): Promise<void> {
  void getBaseUrl();
  throw new Error("Job posting API not connected yet");
}

/** Future: POST /api/v1/jobs/apply */
export async function applyToJob(_jobId: string): Promise<void> {
  void getBaseUrl();
  throw new Error("Job apply API not connected yet");
}
