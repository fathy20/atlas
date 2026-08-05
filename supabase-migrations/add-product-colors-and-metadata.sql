-- Add colors array column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}';

-- Add SEO metadata columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title_ar text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description_ar text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords_ar text;

-- Add index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- Comment explaining the schema
COMMENT ON COLUMN products.colors IS 'Array of available color names for the product (e.g., ["أبيض", "أسود", "فضي"])';
COMMENT ON COLUMN products.meta_title IS 'SEO meta title in English';
COMMENT ON COLUMN products.meta_title_ar IS 'SEO meta title in Arabic';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description in English';
COMMENT ON COLUMN products.meta_description_ar IS 'SEO meta description in Arabic';
COMMENT ON COLUMN products.meta_keywords IS 'SEO keywords in English (comma-separated)';
COMMENT ON COLUMN products.meta_keywords_ar IS 'SEO keywords in Arabic (comma-separated)';
