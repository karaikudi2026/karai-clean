-- myKaraikudi — production schema
-- UUID PKs, snake_case, soft deletes, moderation-ready

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE admin_role AS ENUM ('super_admin', 'content_admin');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_category AS ENUM (
  'general', 'event', 'emergency', 'welfare', 'system'
);
CREATE TYPE notification_audience AS ENUM ('all', 'guests', 'authenticated');
CREATE TYPE notification_status AS ENUM (
  'draft', 'queued', 'pending_dispatch', 'sent', 'failed'
);
CREATE TYPE sos_contact_type AS ENUM (
  'police', 'ambulance', 'fire', 'hospital', 'women_helpline', 'custom'
);
CREATE TYPE blood_group AS ENUM (
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
);
CREATE TYPE welfare_application_status AS ENUM (
  'draft', 'submitted', 'under_review', 'approved', 'rejected'
);
CREATE TYPE device_platform AS ENUM ('ios', 'android', 'web');

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  full_name TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'ta',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_profiles_phone ON profiles(phone) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Admin users (RBAC)
-- ---------------------------------------------------------------------------

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'content_admin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (user_id)
);

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_admin_users_role ON admin_users(role) WHERE deleted_at IS NULL AND is_active;

-- ---------------------------------------------------------------------------
-- MLA Updates
-- ---------------------------------------------------------------------------

CREATE TABLE mla_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  image_alt TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT mla_updates_title_len CHECK (char_length(title) BETWEEN 3 AND 200)
);

CREATE TRIGGER mla_updates_updated_at
  BEFORE UPDATE ON mla_updates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_mla_updates_published
  ON mla_updates(published_at DESC)
  WHERE is_published = TRUE AND deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------

CREATE TABLE business_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER business_categories_updated_at
  BEFORE UPDATE ON business_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  category_id UUID NOT NULL REFERENCES business_categories(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  summary TEXT NOT NULL,
  image_url TEXT,
  location_area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  moderation_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  list_seed TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT businesses_single_image CHECK (image_url IS NULL OR image_url <> '')
);

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_businesses_category ON businesses(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_businesses_moderation ON businesses(moderation_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_businesses_location ON businesses(location_area) WHERE deleted_at IS NULL;
CREATE INDEX idx_businesses_user ON businesses(user_id);
CREATE INDEX idx_businesses_approved_list
  ON businesses(moderation_status, is_active)
  WHERE moderation_status = 'approved' AND deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  company_name TEXT,
  summary TEXT NOT NULL,
  location TEXT,
  category TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  apply_link TEXT,
  moderation_status moderation_status NOT NULL DEFAULT 'approved',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_jobs_active ON jobs(created_at DESC) WHERE is_active AND deleted_at IS NULL;
CREATE INDEX idx_jobs_category ON jobs(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_location ON jobs(location) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Agri
-- ---------------------------------------------------------------------------

CREATE TABLE mandi_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL DEFAULT 'Karaikudi',
  price_per_unit NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'quintal',
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER mandi_prices_updated_at
  BEFORE UPDATE ON mandi_prices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_mandi_prices_date ON mandi_prices(price_date DESC, crop_name);

CREATE TABLE labor_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT,
  location_area TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (user_id)
);

CREATE TRIGGER labor_registrations_updated_at
  BEFORE UPDATE ON labor_registrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE agri_weather (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_date DATE NOT NULL,
  location_name TEXT NOT NULL DEFAULT 'Karaikudi',
  temp_min NUMERIC(5, 2),
  temp_max NUMERIC(5, 2),
  condition TEXT,
  humidity NUMERIC(5, 2),
  wind_speed NUMERIC(5, 2),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (forecast_date, location_name)
);

CREATE TRIGGER agri_weather_updated_at
  BEFORE UPDATE ON agri_weather
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE agri_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  service_type TEXT NOT NULL,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER agri_services_updated_at
  BEFORE UPDATE ON agri_services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- SOS
-- ---------------------------------------------------------------------------

CREATE TABLE sos_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_type sos_contact_type NOT NULL DEFAULT 'custom',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER sos_emergency_contacts_updated_at
  BEFORE UPDATE ON sos_emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE sos_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  custom_message TEXT,
  countdown_seconds INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id),
  CONSTRAINT sos_countdown_range CHECK (countdown_seconds BETWEEN 3 AND 30)
);

CREATE TRIGGER sos_user_profiles_updated_at
  BEFORE UPDATE ON sos_user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Volunteers
-- ---------------------------------------------------------------------------

CREATE TABLE volunteer_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  image_url TEXT,
  location_area TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER volunteer_groups_updated_at
  BEFORE UPDATE ON volunteer_groups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE blood_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  blood_group blood_group NOT NULL,
  phone TEXT NOT NULL,
  location_area TEXT,
  last_donation_date DATE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (user_id)
);

CREATE TRIGGER blood_donors_updated_at
  BEFORE UPDATE ON blood_donors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_blood_donors_group ON blood_donors(blood_group) WHERE is_available AND deleted_at IS NULL;

CREATE TABLE volunteer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_group_id UUID NOT NULL REFERENCES volunteer_groups(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_volunteer_enquiries_group ON volunteer_enquiries(volunteer_group_id);

-- ---------------------------------------------------------------------------
-- Welfare
-- ---------------------------------------------------------------------------

CREATE TABLE welfare_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  form_schema JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER welfare_schemes_updated_at
  BEFORE UPDATE ON welfare_schemes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE welfare_eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES welfare_schemes(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_definition JSONB NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER welfare_eligibility_rules_updated_at
  BEFORE UPDATE ON welfare_eligibility_rules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_welfare_rules_scheme ON welfare_eligibility_rules(scheme_id, priority);

CREATE TABLE welfare_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  scheme_id UUID NOT NULL REFERENCES welfare_schemes(id),
  form_responses JSONB NOT NULL DEFAULT '{}',
  eligibility_result JSONB,
  status welfare_application_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER welfare_applications_updated_at
  BEFORE UPDATE ON welfare_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_welfare_applications_user ON welfare_applications(user_id, scheme_id);

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  push_scheduled_at TIMESTAMPTZ,
  push_sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_events_upcoming
  ON events(event_date ASC)
  WHERE is_published AND deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Notifications (FCM-ready)
-- ---------------------------------------------------------------------------

CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ta TEXT NOT NULL,
  category notification_category NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES notification_templates(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category notification_category NOT NULL DEFAULT 'general',
  target_audience notification_audience NOT NULL DEFAULT 'all',
  payload JSONB NOT NULL DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'ta',
  status notification_status NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE notification_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_token TEXT NOT NULL UNIQUE,
  platform device_platform NOT NULL,
  user_id UUID REFERENCES profiles(id),
  is_guest BOOLEAN NOT NULL DEFAULT TRUE,
  language TEXT NOT NULL DEFAULT 'ta',
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notification_devices_updated_at
  BEFORE UPDATE ON notification_devices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_notification_devices_user ON notification_devices(user_id);

CREATE TABLE notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  device_id UUID REFERENCES notification_devices(id),
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_recipients_user ON notification_recipients(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Grievance & Citizen Recognition
-- ---------------------------------------------------------------------------

CREATE TABLE grievance_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_phone_number TEXT NOT NULL,
  helpline_text TEXT,
  display_title TEXT NOT NULL DEFAULT 'Grievance Redressal',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER grievance_config_updated_at
  BEFORE UPDATE ON grievance_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE citizen_recognition_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_locked BOOLEAN NOT NULL DEFAULT TRUE,
  launch_message TEXT NOT NULL DEFAULT 'Coming soon — celebrate Karaikudi''s citizens.',
  teaser_title TEXT NOT NULL DEFAULT 'Citizen Recognition',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER citizen_recognition_config_updated_at
  BEFORE UPDATE ON citizen_recognition_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Onboarding & App config
-- ---------------------------------------------------------------------------

CREATE TABLE onboarding_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER onboarding_slides_updated_at
  BEFORE UPDATE ON onboarding_slides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone, full_name)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
