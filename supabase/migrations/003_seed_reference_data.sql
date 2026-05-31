-- Reference seed data (safe to re-run with ON CONFLICT)

INSERT INTO business_categories (name, slug, sort_order) VALUES
  ('Retail', 'retail', 1),
  ('Food & Dining', 'food-dining', 2),
  ('Healthcare', 'healthcare', 3),
  ('Education', 'education', 4),
  ('Services', 'services', 5),
  ('Handicrafts', 'handicrafts', 6),
  ('Agriculture', 'agriculture', 7),
  ('Other', 'other', 99)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sos_emergency_contacts (name, phone, contact_type, sort_order)
SELECT v.name, v.phone, v.contact_type::sos_contact_type, v.sort_order
FROM (VALUES
  ('Police', '100', 'police', 1),
  ('Ambulance', '108', 'ambulance', 2),
  ('Fire', '101', 'fire', 3),
  ('Women Helpline', '181', 'women_helpline', 4)
) AS v(name, phone, contact_type, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM sos_emergency_contacts LIMIT 1);

INSERT INTO grievance_config (ai_phone_number, helpline_text, display_title)
SELECT '1800-000-0000', 'Call the AI grievance helpline for assistance.', 'Grievance Redressal'
WHERE NOT EXISTS (SELECT 1 FROM grievance_config LIMIT 1);

INSERT INTO citizen_recognition_config (is_locked, launch_message, teaser_title)
SELECT TRUE, 'Citizen Recognition launches soon. Celebrate Karaikudi''s heroes.', 'Citizen Recognition'
WHERE NOT EXISTS (SELECT 1 FROM citizen_recognition_config LIMIT 1);

INSERT INTO onboarding_slides (title, subtitle, image_url, sort_order)
SELECT v.title, v.subtitle, v.image_url, v.sort_order
FROM (VALUES
  ('Chettinad Heritage', 'Mansions that tell centuries of stories', '/assets/onboarding/chettinad.jpg', 1),
  ('Karaikudi Soul', 'Where tradition meets tomorrow', '/assets/onboarding/karaikudi.jpg', 2),
  ('Flavours of Chettinad', 'Food, culture, and celebration', '/assets/onboarding/food.jpg', 3),
  ('Smart Karaikudi', 'Your city, connected and empowered', '/assets/onboarding/future.jpg', 4)
) AS v(title, subtitle, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM onboarding_slides LIMIT 1);
