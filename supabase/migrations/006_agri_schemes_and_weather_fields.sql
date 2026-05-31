-- Agri: add weather advisory + rain probability + demo schemes for Tamil Nadu

-- ---------------------------------------------------------------------------
-- agri_weather fields
-- ---------------------------------------------------------------------------
ALTER TABLE agri_weather
  ADD COLUMN IF NOT EXISTS rain_probability NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS advisory_text TEXT;

-- ---------------------------------------------------------------------------
-- Agri schemes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agri_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  deadline DATE,
  apply_url TEXT,
  state_name TEXT NOT NULL DEFAULT 'Tamil Nadu',
  district_name TEXT,
  department_contact_name TEXT,
  department_contact_phone TEXT,
  department_contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER agri_schemes_updated_at
  BEFORE UPDATE ON agri_schemes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_agri_schemes_state_active
  ON agri_schemes(state_name)
  WHERE is_active = TRUE AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agri_schemes_deadline
  ON agri_schemes(deadline DESC NULLS LAST)
  WHERE deleted_at IS NULL;

ALTER TABLE agri_schemes ENABLE ROW LEVEL SECURITY;

-- Public read via backend/service role.
CREATE POLICY agri_schemes_public_read ON agri_schemes
  FOR SELECT
  USING (is_active = TRUE AND deleted_at IS NULL);

-- ---------------------------------------------------------------------------
-- Demo data (Tamil Nadu)
-- ---------------------------------------------------------------------------
INSERT INTO agri_schemes (
  title,
  summary,
  eligibility,
  deadline,
  apply_url,
  state_name,
  department_contact_name,
  department_contact_phone
)
SELECT
  'PM-KISAN (Direct Farmer Income Support)',
  'Timely financial assistance to eligible farmer families to support cultivation and daily needs.',
  'Farmers with eligible land records. Beneficiary list is validated through official government systems.',
  '2026-12-31'::date,
  'https://pmkisan.gov.in/',
  'Tamil Nadu',
  'District Agriculture Office',
  '1800-000-0000'
WHERE NOT EXISTS (
  SELECT 1 FROM agri_schemes WHERE title = 'PM-KISAN (Direct Farmer Income Support)'
);

INSERT INTO agri_schemes (
  title,
  summary,
  eligibility,
  deadline,
  apply_url,
  state_name,
  department_contact_name,
  department_contact_phone
)
SELECT
  'Crop Insurance (Fasal Bima / Weather Risk Cover)',
  'Insurance support for crops affected by weather-related events, helping farmers manage income losses.',
  'Farmers participating in eligible insurance schemes through empanelled processes and notified crops.',
  '2026-12-31'::date,
  'https://pmfby.gov.in/',
  'Tamil Nadu',
  'Insurance & Agriculture Desk',
  '1800-000-0000'
WHERE NOT EXISTS (
  SELECT 1 FROM agri_schemes WHERE title = 'Crop Insurance (Fasal Bima / Weather Risk Cover)'
);

INSERT INTO agri_schemes (
  title,
  summary,
  eligibility,
  deadline,
  apply_url,
  state_name,
  department_contact_name,
  department_contact_phone
)
SELECT
  'Drip Irrigation Subsidy (Micro Irrigation)',
  'Subsidy support to set up drip irrigation systems for efficient water use and better crop yield.',
  'Eligible farmers applying through government program guidelines; priority for water-stressed areas.',
  '2026-12-31'::date,
  'https://tn.gov.in/',
  'Tamil Nadu',
  'Horticulture / Irrigation Cell',
  '1800-000-0000'
WHERE NOT EXISTS (
  SELECT 1 FROM agri_schemes WHERE title = 'Drip Irrigation Subsidy (Micro Irrigation)'
);

INSERT INTO agri_schemes (
  title,
  summary,
  eligibility,
  deadline,
  apply_url,
  state_name,
  department_contact_name,
  department_contact_phone
)
SELECT
  'Solar Pump Scheme (Solar Water Pump)',
  'Support for installing solar pumps to reduce energy costs and improve reliability of irrigation.',
  'Farmers and agricultural beneficiaries as per notified eligibility; applications processed through local channels.',
  '2026-12-31'::date,
  'https://mnre.gov.in/',
  'Tamil Nadu',
  'Renewable Energy Office',
  '1800-000-0000'
WHERE NOT EXISTS (
  SELECT 1 FROM agri_schemes WHERE title = 'Solar Pump Scheme (Solar Water Pump)'
);

INSERT INTO agri_schemes (
  title,
  summary,
  eligibility,
  deadline,
  apply_url,
  state_name,
  department_contact_name,
  department_contact_phone
)
SELECT
  'Farmer Loan Support (Kisan Credit Card / Bank Support)',
  'Access to low-interest credit and loan facilitation for crop inputs and farm operations.',
  'Farmers eligible for Kisan Credit Card / credit support through banks and notified processes.',
  '2026-12-31'::date,
  'https://www.kisancreditcard.gov.in/',
  'Tamil Nadu',
  'Bank / Lead District Office',
  '1800-000-0000'
WHERE NOT EXISTS (
  SELECT 1 FROM agri_schemes WHERE title = 'Farmer Loan Support (Kisan Credit Card / Bank Support)'
);

