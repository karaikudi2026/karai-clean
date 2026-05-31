export type Job = {
  id: string;
  title: string;
  company: string;
  category: string;
  categorySlug: string;
  location: string;
  salary?: string;
  employmentType?: string;
  experience?: string;
  description: string;
  imageUrl?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  postedAt?: string;
  isUrgent?: boolean;
  isRemote?: boolean;
  isFresher?: boolean;
  isGovernment?: boolean;
  isWomenFocused?: boolean;
};

export type JobCategory = {
  id: string;
  slug: string;
  titleKey: string;
  icon: string;
  gradient: readonly [string, string, string];
};

export type JobListParams = {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
};
