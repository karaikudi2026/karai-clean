-- Daily-stable randomized business listing for public browse

CREATE OR REPLACE FUNCTION business_sort_key(business_id UUID, seed TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT md5(business_id::text || seed);
$$;

CREATE OR REPLACE FUNCTION search_businesses(
  p_seed TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM-DD'),
  p_category_id UUID DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  category_id UUID,
  name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  summary TEXT,
  image_url TEXT,
  location_area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  moderation_status moderation_status,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    b.id, b.user_id, b.category_id, b.name, b.address, b.phone,
    b.email, b.website, b.summary, b.image_url, b.location_area,
    b.latitude, b.longitude, b.moderation_status, b.created_at, b.updated_at
  FROM businesses b
  WHERE b.deleted_at IS NULL
    AND b.is_active = TRUE
    AND b.moderation_status = 'approved'
    AND (p_category_id IS NULL OR b.category_id = p_category_id)
    AND (p_location IS NULL OR b.location_area ILIKE '%' || p_location || '%')
    AND (
      p_search IS NULL
      OR b.name ILIKE '%' || p_search || '%'
      OR b.summary ILIKE '%' || p_search || '%'
    )
  ORDER BY business_sort_key(b.id, p_seed)
  LIMIT p_limit
  OFFSET p_offset;
$$;
