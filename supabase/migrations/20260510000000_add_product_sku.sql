-- Add SKU (رمز التخزين / رمز المادة) column to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT NULL;

COMMENT ON COLUMN public.products.sku IS 'رمز التخزين (SKU) / رمز المادة - Part number / Stock Keeping Unit';
