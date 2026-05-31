import type {
  AdminRole,
  BloodGroup,
  ModerationStatus,
  NotificationAudience,
  NotificationCategory,
  SosContactType,
  WelfareApplicationStatus,
} from "@mykaraikudi/constants";

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface SoftDeletable {
  deleted_at: string | null;
}

export interface Profile extends Timestamps, SoftDeletable {
  id: string;
  phone: string | null;
  full_name: string | null;
  preferred_language: string;
  avatar_url: string | null;
}

export interface AdminUser extends Timestamps, SoftDeletable {
  id: string;
  user_id: string;
  role: AdminRole;
  is_active: boolean;
}

export interface MlaUpdate extends Timestamps, SoftDeletable {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
}

export interface BusinessCategory extends Timestamps {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface Business extends Timestamps, SoftDeletable {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  website: string | null;
  summary: string;
  image_url: string | null;
  location_area: string | null;
  latitude: number | null;
  longitude: number | null;
  moderation_status: ModerationStatus;
  moderation_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  is_active: boolean;
  category?: BusinessCategory;
}

export interface Job extends Timestamps, SoftDeletable {
  id: string;
  user_id: string;
  title: string;
  company_name: string | null;
  summary: string;
  location: string | null;
  category: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  apply_link: string | null;
  moderation_status: ModerationStatus;
  is_active: boolean;
}

export interface MandiPrice extends Timestamps {
  id: string;
  crop_name: string;
  market_name: string;
  price_per_unit: number;
  unit: string;
  price_date: string;
  source: string | null;
}

export interface LaborRegistration extends Timestamps, SoftDeletable {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  skills: string[];
  availability: string | null;
  location_area: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface AgriWeather extends Timestamps {
  id: string;
  forecast_date: string;
  location_name: string;
  temp_min: number | null;
  temp_max: number | null;
  condition: string | null;
  humidity: number | null;
  wind_speed: number | null;
  fetched_at: string;
}

export interface AgriService extends Timestamps, SoftDeletable {
  id: string;
  title: string;
  description: string;
  contact_phone: string | null;
  contact_email: string | null;
  service_type: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SosEmergencyContact extends Timestamps {
  id: string;
  name: string;
  phone: string;
  contact_type: SosContactType;
  sort_order: number;
  is_active: boolean;
}

export interface SosUserProfile extends Timestamps {
  id: string;
  user_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  custom_message: string | null;
  countdown_seconds: number;
}

export interface VolunteerGroup extends Timestamps, SoftDeletable {
  id: string;
  name: string;
  description: string;
  contact_phone: string | null;
  contact_email: string | null;
  image_url: string | null;
  location_area: string | null;
  is_active: boolean;
}

export interface BloodDonor extends Timestamps, SoftDeletable {
  id: string;
  user_id: string;
  full_name: string;
  blood_group: BloodGroup;
  phone: string;
  location_area: string | null;
  last_donation_date: string | null;
  is_available: boolean;
}

export interface VolunteerEnquiry extends Timestamps {
  id: string;
  volunteer_group_id: string;
  name: string;
  phone: string;
  message: string | null;
  user_id: string | null;
}

export interface WelfareScheme extends Timestamps, SoftDeletable {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  form_schema: Record<string, unknown>;
  is_active: boolean;
}

export interface WelfareApplication extends Timestamps {
  id: string;
  user_id: string;
  scheme_id: string;
  form_responses: Record<string, unknown>;
  eligibility_result: Record<string, unknown> | null;
  status: WelfareApplicationStatus;
}

export interface Event extends Timestamps, SoftDeletable {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  is_published: boolean;
  push_scheduled_at: string | null;
  created_by: string | null;
}

export interface GrievanceConfig extends Timestamps {
  id: string;
  ai_phone_number: string;
  helpline_text: string | null;
  display_title: string;
  is_active: boolean;
}

export interface CitizenRecognitionPlaceholder extends Timestamps {
  id: string;
  is_locked: boolean;
  launch_message: string;
  teaser_title: string;
}

export interface NotificationRecord extends Timestamps {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  target_audience: NotificationAudience;
  payload: Record<string, unknown>;
  status: string;
  locale: string;
  sent_at: string | null;
  created_by: string | null;
}

export interface OnboardingSlide extends Timestamps {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
