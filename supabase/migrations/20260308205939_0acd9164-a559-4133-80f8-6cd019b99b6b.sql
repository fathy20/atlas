
-- Drop restrictive SELECT policies and recreate as permissive
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brands are publicly readable" ON public.brands;
CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "SEO settings are publicly readable" ON public.seo_settings;
CREATE POLICY "SEO settings are publicly readable" ON public.seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Robots rules are publicly readable" ON public.robots_rules;
CREATE POLICY "Robots rules are publicly readable" ON public.robots_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sitemap pages are publicly readable" ON public.sitemap_pages;
CREATE POLICY "Sitemap pages are publicly readable" ON public.sitemap_pages FOR SELECT USING (true);
