-- Seed sample MLA updates for UI demo
-- Safe to re-run (matches by title)

INSERT INTO mla_updates (title, summary, content, image_url, image_alt, is_published, published_at)
SELECT
  'Dr. T. K. Prabhu introduces new welfare schemes for Karaikudi',
  'Subsidized essentials and targeted support for eligible families begin this month across Karaikudi constituency.',
  NULL,
  'https://images.unsplash.com/photo-1529253354667-75d1e3f44f3c?auto=format&fit=crop&w=1200&q=80',
  'Civic announcement',
  TRUE,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM mla_updates WHERE title = 'Dr. T. K. Prabhu introduces new welfare schemes for Karaikudi' LIMIT 1
);

INSERT INTO mla_updates (title, summary, content, image_url, image_alt, is_published, published_at)
SELECT
  'Road construction + drinking water connections announced',
  'Road improvement works and new water connections will be taken up in priority wards to reduce daily hardships.',
  NULL,
  'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
  'Road and water infrastructure',
  TRUE,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM mla_updates WHERE title = 'Road construction + drinking water connections announced' LIMIT 1
);

INSERT INTO mla_updates (title, summary, content, image_url, image_alt, is_published, published_at)
SELECT
  'Improving access to services for citizens',
  'A coordinated approach to faster grievance resolution and service desk handholding across the constituency.',
  NULL,
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  'Community support',
  TRUE,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM mla_updates WHERE title = 'Improving access to services for citizens' LIMIT 1
);

