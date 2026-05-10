-- Add SEO metadata fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_title_ar TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_description_ar TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords_ar TEXT;

-- Add comments for documentation
COMMENT ON COLUMN products.meta_title IS 'SEO meta title in English';
COMMENT ON COLUMN products.meta_title_ar IS 'SEO meta title in Arabic';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description in English';
COMMENT ON COLUMN products.meta_description_ar IS 'SEO meta description in Arabic';
COMMENT ON COLUMN products.meta_keywords IS 'SEO keywords in English (comma-separated)';
COMMENT ON COLUMN products.meta_keywords_ar IS 'SEO keywords in Arabic (comma-separated)';
