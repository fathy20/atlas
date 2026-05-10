-- ============================================
-- Supabase Seed Data from CSV Exports (Without user_roles)
-- Generated: 2026-03-10
-- ============================================

-- ============================================
-- 1. Categories (2 records)
-- ============================================
INSERT INTO public.categories (id, slug, name, name_ar, icon, created_at, updated_at) VALUES
('82845aac-a728-473d-b42a-c9e9f2286ef2', 'electrical', 'Electrical', 'كهربائيات', '⚡', '2026-03-08 20:36:49.889873+00', '2026-03-08 20:36:49.889873+00'),
('324edd3e-6fdf-4029-8ad3-860f65218fc9', 'home', 'Home Appliances', 'أجهزة منزلية', '🏠', '2026-03-08 20:36:49.889873+00', '2026-03-08 20:36:49.889873+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Brands (5 records)
-- ============================================
INSERT INTO public.brands (id, slug, name, logo, created_at) VALUES
('82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', 'tecno', 'Tecno Home', '/images/brands/tecno.png', '2026-03-08 20:36:49.889873+00'),
('949a42c2-f975-4491-9994-5fd7377eaec0', 'besser', 'Besser', '/images/brands/besser.png', '2026-03-08 20:36:49.889873+00'),
('a2e6894c-de2d-46bc-af10-bbb96605ae6e', 'fanton', 'Fanton', '/images/brands/fanton.png', '2026-03-08 20:36:49.889873+00'),
('f33e6696-b4b9-43c6-a0bc-32369d0c2676', 'gewiss', 'Gewiss', '/images/brands/gewiss.jpg', '2026-03-08 20:52:20.723961+00'),
('439c6bec-de14-4efe-99b7-342df93cfb87', 'fumagalli', 'Fumagalli', '/images/brands/fumagalli.png', '2026-03-08 20:52:20.723961+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. Products (15 records)
-- ============================================
INSERT INTO public.products (id, slug, name, name_ar, description, description_ar, price, category_id, brand_id, image, images, features, available, created_at, updated_at) VALUES
('abde0e7f-d8d0-4c24-95c1-933676798faa', 'deep-casserole', 'Deep Casserole', 'كسرولة عميقة', 'Premium deep casserole with non-stick granite coating.', 'كسرولة عميقة فاخرة بطبقة جرانيت غير لاصقة.', 120, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '949a42c2-f975-4491-9994-5fd7377eaec0', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['Granite Coating','Heat Resistant Handle','Dishwasher Safe','Even Heat Distribution'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('d39ac6bb-2fc8-43a1-b909-ff1bf4fdc4ea', 'cookware-set', 'Cookware Set', 'طقم أواني طهي', 'Complete cookware set with 10 essential pieces.', 'طقم أواني طهي كامل مكون من 10 قطع أساسية.', 350, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '949a42c2-f975-4491-9994-5fd7377eaec0', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['10 Pieces','Non-Stick','Induction Compatible','Glass Lids'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('27246a7a-9220-4983-b3db-761605aa8423', 'kitchen-essentials', 'Kitchen Essentials', 'أساسيات المطبخ', 'Essential kitchen tools and accessories set.', 'طقم أدوات ومستلزمات المطبخ الأساسية.', 85, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['Stainless Steel','Ergonomic Design','Easy Clean','Complete Set'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('38904637-8581-4f50-b199-829e54adaaa7', 'smart-blender', 'Smart Blender', 'خلاط ذكي', 'High-speed smart blender with multiple speed settings.', 'خلاط ذكي عالي السرعة بإعدادات سرعة متعددة.', 180, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['1000W Motor','6 Blades','BPA Free','Self-Cleaning'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('e3b972e4-4fd4-4e65-b975-c4df4c132872', 'coffee-maker', 'Coffee Maker', 'ماكينة قهوة', 'Automatic coffee maker with built-in grinder.', 'ماكينة قهوة أوتوماتيكية بمطحنة مدمجة.', 250, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['Built-in Grinder','Programmable','Keep Warm','12 Cups'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('55eed468-a9a0-4ee0-886c-d9e89b8934fc', 'granite-pan', 'Granite Pan', 'مقلاة جرانيت', 'Premium granite-coated frying pan with ergonomic handle.', 'مقلاة بطبقة جرانيت فاخرة بمقبض مريح.', 65, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '949a42c2-f975-4491-9994-5fd7377eaec0', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['Granite Coating','PFOA Free','Cool Touch Handle','28cm'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('17bb9757-2c8d-4014-b1a2-4e253e8ef5d2', 'food-processor', 'Food Processor', 'محضر طعام', 'Multi-function food processor with various attachments.', 'محضر طعام متعدد الوظائف بملحقات متنوعة.', 220, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['800W','Multiple Attachments','Large Bowl','Safety Lock'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('82eda7cc-6669-41a3-b1fb-023ed547a099', 'electric-kettle', 'Electric Kettle', 'غلاية كهربائية', 'Fast-boiling electric kettle with auto shut-off.', 'غلاية كهربائية سريعة الغليان مع إيقاف تلقائي.', 45, '324edd3e-6fdf-4029-8ad3-860f65218fc9', '82dabfef-bb9b-4efc-9c3b-43d41e1e06bd', '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['1.7L Capacity','Auto Shut-off','Boil Dry Protection','360° Base'], true, '2026-03-08 20:37:32.790529+00', '2026-03-08 20:37:32.790529+00'),

('3041f1e6-3dc6-4ee9-bd0d-d4123e841f8e', 'dlsb-led', 'DLSB LED', 'إضاءة DLSB LED', 'High-performance LED downlight with superior brightness and energy efficiency.', 'إضاءة LED عالية الأداء مع سطوع فائق وكفاءة في استهلاك الطاقة.', 45, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/dlsb-led.webp', ARRAY['/placeholder.svg'], ARRAY['Energy Efficient','Long Lifespan','Easy Installation','Dimmable'], true, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00'),

('248b44e1-2df1-4aaa-bdcd-dcde150b1781', 'dl-round', 'DL ROUND', 'إضاءة DL دائرية', 'Round LED panel light for modern ceiling installations.', 'لوحة إضاءة LED دائرية للتركيبات السقفية الحديثة.', 35, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/dl-round.webp', ARRAY['/placeholder.svg'], ARRAY['Slim Design','Uniform Light','Flicker-Free','High CRI'], true, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00'),

('a5eca05c-b3f2-438f-845a-15d2661736f5', 'dl-square', 'DL SQUARE', 'إضاءة DL مربعة', 'Square LED panel light with clean modern aesthetics.', 'لوحة إضاءة LED مربعة بتصميم عصري أنيق.', 38, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/dl-square.webp', ARRAY['/placeholder.svg'], ARRAY['Modern Design','High Efficiency','Easy Mount','3000K-6500K'], true, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00'),

('70e42f5b-e4ef-4d11-a2e4-3cb9ba761992', 'decorative-vase', 'Decorative Vase', 'مزهرية ديكورية', 'Elegant decorative vase for modern home interiors.', 'مزهرية ديكورية أنيقة للديكور المنزلي العصري.', 40, '324edd3e-6fdf-4029-8ad3-860f65218fc9', NULL, '/placeholder.svg', ARRAY['/placeholder.svg'], ARRAY['Ceramic','Hand-Painted','Modern Design','Multiple Sizes'], false, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:10:36.706505+00'),

('fd796741-4730-431a-8809-bb72b3d79030', 'mango-midi', 'MANGO+ MIDI', 'مانجو+ ميدي', 'Compact LED spotlight with adjustable beam angle.', 'كشاف LED مضغوط بزاوية شعاع قابلة للتعديل.', 55, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/mango-midi.webp', ARRAY['/placeholder.svg'], ARRAY['Adjustable Angle','High Lumen','Compact Size','IP44'], true, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00'),

('8563415b-e1f4-4811-af57-469174615c63', 'elia-dl', 'ELIA DL', 'إيليا DL', 'Premium decorative LED downlight for luxury spaces.', 'إضاءة LED ديكورية فاخرة للمساحات الراقية.', 65, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/elia-dl.webp', ARRAY['/placeholder.svg'], ARRAY['Premium Finish','Warm White','Anti-Glare','5 Year Warranty'], true, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00'),

('d8b4adbc-8b25-43f1-b0b3-022b3d505b8e', 'eb-plus', 'EB+', 'EB+', 'Emergency backup LED light with built-in battery.', 'إضاءة LED طوارئ مع بطارية مدمجة.', 75, '82845aac-a728-473d-b42a-c9e9f2286ef2', NULL, '/images/products/eb-plus.webp', ARRAY['/placeholder.svg'], ARRAY['Battery Backup','Auto Switch','3 Hour Runtime','CE Certified'], false, '2026-03-08 20:37:32.790529+00', '2026-03-09 04:06:12.598223+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. SEO Settings (4 records)
-- ============================================
INSERT INTO public.seo_settings (id, page_path, title, description, og_title, og_description, og_image, robots, canonical, created_at, updated_at) VALUES
('1a05cd94-b5ab-4ec5-9ea8-79e8afa4b9a8', '/', 'أطلس - لإستيراد المواد الكهربائية والمنزلية', 'أطلس لإستيراد المواد الكهربائية والمنزلية - أكبر تشكيلة من المنتجات عالية الجودة في طرابلس، ليبيا', 'أطلس - لإستيراد المواد الكهربائية والمنزلية', 'أكبر تشكيلة من المنتجات الكهربائية والمنزلية عالية الجودة', '/placeholder.svg', 'index, follow', '/', '2026-03-08 20:37:45.444173+00', '2026-03-08 20:37:45.444173+00'),

('18b79536-c163-4857-9b10-ddf2c9de4a21', '/products', 'المنتجات - أطلس', 'تصفح تشكيلتنا الواسعة من المنتجات الكهربائية والمنزلية من أفضل الماركات العالمية', 'منتجات أطلس', 'تصفح تشكيلتنا الواسعة من المنتجات الكهربائية والمنزلية', '/placeholder.svg', 'index, follow', '/products', '2026-03-08 20:37:45.444173+00', '2026-03-08 20:37:45.444173+00'),

('4ba9c2f6-cac8-49d8-9140-9a0207f127d8', '/about', 'من نحن - أطلس', 'تعرف على قصة أطلس - أكثر من 15 سنة خبرة في استيراد وتوزيع المواد الكهربائية والمنزلية', 'من نحن - أطلس', 'أكثر من 15 سنة خبرة في استيراد المواد الكهربائية والمنزلية', '/placeholder.svg', 'index, follow', '/about', '2026-03-08 20:37:45.444173+00', '2026-03-08 20:37:45.444173+00'),

('5f366a61-3c29-4748-9b3b-a95b73651d39', '/contact', 'تواصل معنا - أطلس', 'تواصل مع أطلس - طرابلس، الكريمية - هاتف: 0913407799', 'تواصل معنا - أطلس', 'تواصل معنا عبر الهاتف أو واتساب', '/placeholder.svg', 'index, follow', '/contact', '2026-03-08 20:37:45.444173+00', '2026-03-08 20:37:45.444173+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. Robots Rules (3 records)
-- ============================================
INSERT INTO public.robots_rules (id, user_agent, allow, disallow, created_at) VALUES
('89ed3ce5-f369-4255-a949-238c020bd726', 'Googlebot', ARRAY['/'], ARRAY['/dashboard','/login'], '2026-03-08 20:37:45.444173+00'),
('5c0d1f97-346d-4eb8-a1d9-b28c72c139e7', 'Bingbot', ARRAY['/'], ARRAY['/dashboard','/login'], '2026-03-08 20:37:45.444173+00'),
('3133c0d1-41bf-4bf4-b42d-aa37f2f69cf1', '*', ARRAY['/'], ARRAY['/dashboard','/login'], '2026-03-08 20:37:45.444173+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. Sitemap Pages (4 records)
-- ============================================
INSERT INTO public.sitemap_pages (id, path, title, visible, priority, changefreq, created_at) VALUES
('e436a00f-1d41-4391-b2bc-0001cb88994a', '/', 'الرئيسية', true, 1.0, 'weekly', '2026-03-08 20:37:45.444173+00'),
('fab90332-6e72-4521-bebe-958294870ce0', '/products', 'المنتجات', true, 0.9, 'daily', '2026-03-08 20:37:45.444173+00'),
('bd305ee1-7642-462a-b300-8c2f4b9eab0f', '/about', 'من نحن', true, 0.7, 'monthly', '2026-03-08 20:37:45.444173+00'),
('b8cb6126-efaa-4b85-bc29-98dd6fd71cd5', '/contact', 'تواصل معنا', true, 0.6, 'monthly', '2026-03-08 20:37:45.444173+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================
SELECT COUNT(*) as categories_count FROM public.categories;
SELECT COUNT(*) as brands_count FROM public.brands;
SELECT COUNT(*) as products_count FROM public.products;
SELECT COUNT(*) as seo_settings_count FROM public.seo_settings;
SELECT COUNT(*) as robots_rules_count FROM public.robots_rules;
SELECT COUNT(*) as sitemap_pages_count FROM public.sitemap_pages;
