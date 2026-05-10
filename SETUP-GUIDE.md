# دليل إعداد مشروع Joy Appliance Portal

## ✅ الخطوات المكتملة

### 1. استنساخ المشروع ✓
```bash
git clone https://github.com/fathy20/joy-appliance-portal.git
cd joy-appliance-portal
```

### 2. تثبيت المكتبات ✓
```bash
npm install
```

### 3. تشغيل المشروع ✓
```bash
npm run dev
```
المشروع يعمل الآن على: http://localhost:8080/

## 📋 الخطوات المتبقية

### 4. تطبيق Migrations على قاعدة البيانات

المشروع يحتوي على credentials جاهزة في ملف `.env`:
- Project ID: `wjakyonrwdthxenxeckl`
- URL: `https://wjakyonrwdthxenxeckl.supabase.co`

#### الطريقة الأولى: استخدام Supabase Dashboard (الأسهل)

1. افتح Supabase Dashboard: https://app.supabase.com/project/wjakyonrwdthxenxeckl
2. اذهب إلى **SQL Editor**
3. انسخ محتوى كل ملف migration والصقه في SQL Editor:
   - `supabase/migrations/20260308203635_2e959fd6-e139-46fd-ba95-3fca08a0188d.sql`
   - `supabase/migrations/20260308205939_0acd9164-a559-4133-80f8-6cd019b99b6b.sql`
   - `supabase/migrations/20260308211044_1772c5ee-60dd-4cc9-a6d9-9e9e9a00cb5b.sql`
4. اضغط **Run** لكل migration

#### الطريقة الثانية: استخدام Supabase CLI

إذا كان لديك Supabase CLI مثبت:
```bash
supabase link --project-ref wjakyonrwdthxenxeckl
supabase db push
```

### 5. التحقق من قاعدة البيانات

بعد تطبيق الـ migrations، يجب أن تجد الجداول التالية:
- `user_roles` - أدوار المستخدمين
- `categories` - فئات المنتجات
- `brands` - العلامات التجارية
- `products` - المنتجات
- `seo_settings` - إعدادات SEO
- `robots_rules` - قواعد robots.txt
- `sitemap_pages` - صفحات sitemap

## 🎯 ملخص الإعداد

### ما تم إنجازه:
✅ استنساخ المشروع من GitHub  
✅ تثبيت جميع المكتبات (503 package)  
✅ تشغيل السيرفر المحلي على http://localhost:8080/  
✅ التحقق من وجود ملفات الـ migrations  

### ما يحتاج إلى إكمال:
⏳ تطبيق الـ migrations على قاعدة بيانات Supabase  
⏳ إضافة بيانات أولية (seed data) إذا لزم الأمر  
⏳ إنشاء مستخدم admin للوصول إلى لوحة التحكم  

## 📝 ملاحظات

- المشروع يستخدم Vite + React + TypeScript
- قاعدة البيانات: Supabase (PostgreSQL)
- UI Framework: shadcn/ui + Tailwind CSS
- المشروع يدعم اللغتين العربية والإنجليزية

## 🔐 إنشاء مستخدم Admin

بعد تطبيق الـ migrations، يمكنك إنشاء مستخدم admin بإحدى الطريقتين:

### الطريقة الأولى (من داخل التطبيق)
1. افتح: `http://localhost:8080/signup`
2. أنشئ أول حساب في النظام
3. أول حساب يتم منحه صلاحية `admin` تلقائيًا

### الطريقة الثانية (يدويًا من Supabase)
1. أنشئ مستخدمًا من Supabase Dashboard → Authentication → Users
2. اذهب إلى Supabase Dashboard → SQL Editor
3. نفذ هذا الأمر (استبدل USER_ID بـ ID المستخدم):
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin');
```

## 🚀 الوصول إلى لوحة التحكم

بعد إنشاء مستخدم admin:
- افتح: http://localhost:8080/login
- سجل دخول بحساب الـ admin
- اذهب إلى: http://localhost:8080/dashboard

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
- Console في المتصفح للأخطاء
- Terminal للأخطاء في السيرفر
- Supabase Dashboard → Logs للأخطاء في قاعدة البيانات
