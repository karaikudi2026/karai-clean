import { useMemo, useState } from "react";

import { MOCK_JOBS } from "../data/mock-jobs";
import type { Job } from "../types";

function matchesSearch(job: Job, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.category.toLowerCase().includes(q) ||
    job.description.toLowerCase().includes(q) ||
    (job.experience?.toLowerCase().includes(q) ?? false)
  );
}

function matchesLocation(job: Job, locationKey: string): boolean {
  if (locationKey === "nearby") return true;
  const loc = job.location.toLowerCase();
  if (locationKey === "karaikudi") return loc.includes("karaikudi");
  if (locationKey === "sivagangai") return loc.includes("sivagangai");
  return true;
}

export function useJobDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState("karaikudi");

  const filtered = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      if (selectedCategorySlug && job.categorySlug !== selectedCategorySlug) {
        return false;
      }
      if (!matchesLocation(job, selectedLocation)) {
        return false;
      }
      return matchesSearch(job, searchQuery);
    });
  }, [searchQuery, selectedCategorySlug, selectedLocation]);

  const featured = useMemo(
    () => filtered.filter((j) => j.isFeatured),
    [filtered]
  );

  const urgent = useMemo(() => filtered.filter((j) => j.isUrgent), [filtered]);
  const remote = useMemo(() => filtered.filter((j) => j.isRemote), [filtered]);
  const fresher = useMemo(() => filtered.filter((j) => j.isFresher), [filtered]);
  const government = useMemo(
    () => filtered.filter((j) => j.isGovernment),
    [filtered]
  );
  const womenFocused = useMemo(
    () => filtered.filter((j) => j.isWomenFocused),
    [filtered]
  );

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategorySlug
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategorySlug(null);
    setSelectedLocation("karaikudi");
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategorySlug((prev) => (prev === slug ? null : slug));
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    selectedLocation,
    setSelectedLocation,
    toggleCategory,
    clearFilters,
    hasActiveFilters,
    filtered,
    featured,
    urgent,
    remote,
    fresher,
    government,
    womenFocused,
    isEmpty: filtered.length === 0,
  };
}
