/** UI-layer business model (mock today; maps to API `Business` later). */
export type Business = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  tagline: string;
  imageUrl: string;
  address?: string;
  rating?: number;
  isFeatured?: boolean;
  isOpen?: boolean;
  isVerified?: boolean;
  isTrending?: boolean;
  isRecent?: boolean;
  phone?: string;
};

export type BusinessCategory = {
  id: string;
  slug: string;
  titleKey: string;
  icon: string;
  gradient: readonly [string, string, string];
};

export type BusinessListParams = {
  search?: string;
  categorySlug?: string;
  location?: string;
  page?: number;
  limit?: number;
  seed?: string;
};
