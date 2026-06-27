# دليل نشر Anime Power Scales على Netlify

## 🚀 خطوات النشر المجاني

### الخطوة 1: إنشاء حساب Netlify
1. اذهب إلى [netlify.com](https://netlify.com)
2. انقر على "Sign Up"
3. اختر "GitHub" أو "Google" أو أي طريقة تفضلها
4. أكمل التسجيل

### الخطوة 2: ربط مستودع GitHub
1. انقر على "New site from Git"
2. اختر "GitHub"
3. اختر المستودع `Anime-Power-Scale`
4. انقر على "Deploy site"

### الخطوة 3: إعداد متغيرات البيئة
1. في لوحة Netlify، اذهب إلى **Site settings**
2. اختر **Build & deploy** → **Environment**
3. أضف المتغيرات التالية:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=your-key (اختياري)
VITE_GOOGLE_API_KEY=your-key (اختياري)
```

### الخطوة 4: إعداد Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر على "Start your project"
3. اختر "Create a new project"
4. املأ البيانات:
   - **Project name:** anime-power-scales
   - **Database password:** (اختر كلمة مرور قوية)
   - **Region:** (اختر الأقرب لك)
5. انقر على "Create new project"

### الخطوة 5: إنشاء الجداول في Supabase
في SQL Editor في Supabase، نفذ الأوامر التالية:

```sql
-- جدول الشخصيات
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  anime_name VARCHAR(255),
  tier VARCHAR(50),
  description TEXT,
  abilities JSONB,
  stats JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول التحليلات
CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character1_id UUID REFERENCES characters(id),
  character2_id UUID REFERENCES characters(id),
  winner VARCHAR(255),
  confidence_score INTEGER,
  reasoning TEXT,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الأدلة
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id),
  content TEXT,
  source_type VARCHAR(50),
  series_name VARCHAR(255),
  chapter_episode VARCHAR(50),
  confidence_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول المستخدمين
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة العامة
CREATE POLICY "Enable read access for all users" ON characters
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON analysis
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON evidence
  FOR SELECT USING (true);
```

### الخطوة 6: الحصول على مفاتيح API
1. في Supabase، اذهب إلى **Settings** → **API**
2. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
3. أضفها في متغيرات البيئة في Netlify

### الخطوة 7: تفعيل النشر التلقائي
1. في Netlify، اذهب إلى **Deploys**
2. يجب أن يبدأ البناء تلقائياً
3. انتظر حتى ينتهي (عادة 2-5 دقائق)
4. سيحصل على رابط مثل: `https://anime-power-scales-xxxxx.netlify.app`

---

## 🔗 الحصول على نطاق مخصص (اختياري)

### إذا كان لديك نطاق خاص بك:
1. في Netlify، اذهب إلى **Domain settings**
2. انقر على "Add custom domain"
3. أدخل نطاقك
4. اتبع التعليمات لربط DNS

### إذا أردت نطاق مجاني:
1. استخدم Netlify subdomain (مثل: `anime-power-scales.netlify.app`)
2. أو احصل على نطاق مجاني من [freenom.com](https://freenom.com)

---

## 📊 متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|--------|-------|------|
| `VITE_SUPABASE_URL` | رابط Supabase | https://abc.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | مفتاح API العام | eyJh... |
| `VITE_GROQ_API_KEY` | مفتاح Groq (اختياري) | gsk_... |
| `VITE_GOOGLE_API_KEY` | مفتاح Google (اختياري) | AIza... |

---

## ✅ التحقق من النشر

بعد النشر، تحقق من:
1. ✅ الموقع يحمل بنجاح
2. ✅ الأيقونات والصور تظهر
3. ✅ البحث يعمل
4. ✅ محاكاة المواجهات تعمل
5. ✅ البيانات تُحفظ في Supabase

---

## 🐛 استكشاف الأخطاء

### الموقع لا يحمل
- تحقق من متغيرات البيئة في Netlify
- انظر إلى Build logs في Netlify

### قاعدة البيانات لا تعمل
- تحقق من مفاتيح Supabase
- تأكد من إنشاء الجداول
- تحقق من Row Level Security

### الأداء بطيء
- استخدم Netlify CDN
- قلل حجم الصور
- استخدم Lazy Loading

---

## 📞 الدعم

للمساعدة:
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**تم إنشاء هذا الدليل في:** 27 يونيو 2026
**الإصدار:** 1.0
