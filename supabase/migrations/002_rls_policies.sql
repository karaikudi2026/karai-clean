-- Row Level Security — deny-by-default on sensitive tables.
-- Public reads for published content go through the backend service role.
-- Direct client access is limited to user-owned rows where noted.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mla_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mandi_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agri_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE agri_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_recognition_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_slides ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own row
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- SOS user profile: owner only
CREATE POLICY sos_user_profiles_own ON sos_user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Labor / blood donor: owner only
CREATE POLICY labor_registrations_own ON labor_registrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY blood_donors_own ON blood_donors
  FOR ALL USING (auth.uid() = user_id);

-- Welfare applications: owner read/insert
CREATE POLICY welfare_applications_own ON welfare_applications
  FOR ALL USING (auth.uid() = user_id);

-- Businesses & jobs: owners manage their posts
CREATE POLICY businesses_own ON businesses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY jobs_own ON jobs
  FOR ALL USING (auth.uid() = user_id);

-- Notification devices: register own device
CREATE POLICY notification_devices_own ON notification_devices
  FOR ALL USING (
    auth.uid() = user_id OR (user_id IS NULL AND is_guest = TRUE)
  );

-- Notification recipients: read own
CREATE POLICY notification_recipients_own ON notification_recipients
  FOR SELECT USING (auth.uid() = user_id);

-- Public read policies (anon) — read-only published/active content
CREATE POLICY mla_updates_public_read ON mla_updates
  FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);

CREATE POLICY business_categories_public_read ON business_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY businesses_public_read ON businesses
  FOR SELECT USING (
    moderation_status = 'approved'
    AND is_active = TRUE
    AND deleted_at IS NULL
  );

CREATE POLICY jobs_public_read ON jobs
  FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY mandi_prices_public_read ON mandi_prices
  FOR SELECT USING (TRUE);

CREATE POLICY agri_weather_public_read ON agri_weather
  FOR SELECT USING (TRUE);

CREATE POLICY agri_services_public_read ON agri_services
  FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY sos_contacts_public_read ON sos_emergency_contacts
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY volunteer_groups_public_read ON volunteer_groups
  FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY blood_donors_public_read ON blood_donors
  FOR SELECT USING (is_available = TRUE AND deleted_at IS NULL);

CREATE POLICY welfare_schemes_public_read ON welfare_schemes
  FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY events_public_read ON events
  FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);

CREATE POLICY grievance_public_read ON grievance_config
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY citizen_recognition_public_read ON citizen_recognition_config
  FOR SELECT USING (TRUE);

CREATE POLICY onboarding_public_read ON onboarding_slides
  FOR SELECT USING (is_active = TRUE);

-- Admin tables: no direct client policies (service role only via backend)
