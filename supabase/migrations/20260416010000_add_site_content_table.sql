-- Create site_content table for managing all site text content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(100) NOT NULL UNIQUE,
  content_ar TEXT,
  content_en TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE site_content IS 'Stores all editable site content';
COMMENT ON COLUMN site_content.section IS 'Section identifier (e.g., company_info, stats, features)';
COMMENT ON COLUMN site_content.content_ar IS 'Arabic text content';
COMMENT ON COLUMN site_content.content_en IS 'English text content';
COMMENT ON COLUMN site_content.data IS 'JSON data for complex structures';

-- Insert default data
INSERT INTO site_content (section, data) VALUES
('company_info', '{
  "name": "أطلس",
  "nameEn": "Atlas",
  "fullName": "أطلس لإستيراد المواد الكهربائية والمنزلية",
  "fullNameEn": "Atlas for Importing Electrical & Home Appliances",
  "phone": "0913407799",
  "whatsapp": "218913407799",
  "email": "info@atlas-home.com",
  "address": "طرابلس، الكريمية",
  "addressEn": "Tripoli, Al-Karimia"
}'::jsonb),

('stats', '{
  "items": [
    {"value": "+35", "label": "عاماً من الخبرة"},
    {"value": "9", "label": "فروع في خدمتك"},
    {"value": "موزع معتمد", "label": "لماركات دولية"},
    {"value": "+1000", "label": "منتج عالمي"}
  ]
}'::jsonb),

('features', '{
  "title": "مميزاتنا",
  "subtitle": "لماذا أطلس ؟",
  "items": [
    {"icon": "shield", "title": "جودة مضمونة", "description": "نوفر منتجات عالية الجودة من أفضل الماركات العالمية"},
    {"icon": "truck", "title": "شبكة توزيع واسعة", "description": "نغطي مختلف المناطق بكفاءة لتوصيل المنتجات أينما كنت"},
    {"icon": "headphones", "title": "خدمة عملاء", "description": "فريق دعم متواجد على مدار الساعة لخدمتك"},
    {"icon": "grid", "title": "تشكيلة واسعة", "description": "أكبر تشكيلة من المنتجات الكهربائية والمنزلية"}
  ]
}'::jsonb),

('banner', '{
  "title": "من نخدم؟",
  "description": "نقدّم حلولًا ومنتجاتٍ متكاملة تلبي احتياجات الشركات والمصانع والمتاجر بكفاءة واحترافية.\\n\\nبدءًا من أنظمة الإضاءة الاحترافية وصولًا إلى الأجهزة المنزلية عالية الجودة، نوفّر كل ما تحتاجه لتطوير بيئتك التجارية والارتقاء بمساحات العمل والمعيشة بأعلى معايير الجودة.",
  "buttonText": "معرفه المزيد",
  "buttonLink": "/about"
}'::jsonb),

('hero_slides', '{
  "slides": [
    {
      "id": 1,
      "title": "عالم المواد الكهربائيه",
      "subtitle": "كل ما تحتاجه من مواد و جوده فى مكان واحد",
      "cta": "اكتشف الإضاءة"
    },
    {
      "id": 2,
      "title": "أجهزة منزلية متميزة",
      "subtitle": "كل ما تحتاجه لبيتك في مكان واحد",
      "cta": "تسوق الآن"
    }
  ]
}'::jsonb)

ON CONFLICT (section) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
