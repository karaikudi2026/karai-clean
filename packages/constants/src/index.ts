export const APP_NAME = "myKaraikudi" as const;
export const API_VERSION = "v1" as const;
export const API_BASE_PATH = `/api/${API_VERSION}` as const;

export const ADMIN_ROLES = ["super_admin", "content_admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const MODERATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

export const SUPPORTED_LOCALES = ["ta", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const NOTIFICATION_CATEGORIES = [
  "general",
  "event",
  "emergency",
  "welfare",
  "system",
] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export const NOTIFICATION_AUDIENCES = [
  "all",
  "guests",
  "authenticated",
] as const;
export type NotificationAudience = (typeof NOTIFICATION_AUDIENCES)[number];

export const SOS_CONTACT_TYPES = [
  "police",
  "ambulance",
  "fire",
  "hospital",
  "women_helpline",
  "custom",
] as const;
export type SosContactType = (typeof SOS_CONTACT_TYPES)[number];

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const WELFARE_APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
] as const;
export type WelfareApplicationStatus =
  (typeof WELFARE_APPLICATION_STATUSES)[number];

export const IMAGE_MAX_BYTES = 5_242_880;
export const IMAGE_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const AUTH_REQUIRED_ACTIONS = [
  "post_business",
  "post_job",
  "labor_registration",
  "volunteer_registration",
  "blood_donor_registration",
  "sos_setup",
] as const;

export const API_ROUTES = {
  health: "/health",
  mlaUpdates: "/mla-updates",
  businesses: "/businesses",
  jobs: "/jobs",
  agri: "/agri",
  sos: "/sos",
  volunteers: "/volunteers",
  welfare: "/welfare",
  events: "/events",
  grievance: "/grievance",
  citizenRecognition: "/citizen-recognition",
  notifications: "/notifications",
  auth: "/auth",
} as const;

export const THEME = {
  background: "#FAF7F2",
  backgroundAlt: "#F5F0E8",
  accent: "#B84A4A",
  accentMuted: "#C96B6B",
  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
  cardRadius: 16,
  cardRadiusLg: 24,
} as const;
