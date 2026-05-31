import { useMemo, useState } from "react";

import { MOCK_BUSINESSES } from "../data/mock-businesses";
import type { Business } from "../types";

function matchesSearch(business: Business, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    business.name.toLowerCase().includes(q) ||
    business.category.toLowerCase().includes(q) ||
    business.tagline.toLowerCase().includes(q) ||
    business.description.toLowerCase().includes(q)
  );
}

export function useBusinessDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    null
  );

  const filtered = useMemo(() => {
    return MOCK_BUSINESSES.filter((b) => {
      if (selectedCategorySlug && b.categorySlug !== selectedCategorySlug) {
        return false;
      }
      return matchesSearch(b, searchQuery);
    });
  }, [searchQuery, selectedCategorySlug]);

  const featured = useMemo(
    () => filtered.filter((b) => b.isFeatured),
    [filtered]
  );

  const trending = useMemo(
    () => filtered.filter((b) => b.isTrending),
    [filtered]
  );

  const recent = useMemo(
    () => filtered.filter((b) => b.isRecent),
    [filtered]
  );

  const verified = useMemo(
    () => filtered.filter((b) => b.isVerified),
    [filtered]
  );

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategorySlug
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategorySlug(null);
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategorySlug((prev) => (prev === slug ? null : slug));
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
    toggleCategory,
    clearFilters,
    hasActiveFilters,
    filtered,
    featured,
    trending,
    recent,
    verified,
    isEmpty: filtered.length === 0,
  };
}
