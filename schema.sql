-- 1. حذف الجداول القديمة لو موجودة تماماً للبدء على نظافة
DROP TABLE IF EXISTS cv_files CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profile_settings CASCADE;

-- 2. إنشاء الجداول بنظام الـ UUID
CREATE TABLE profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cv_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_name TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users on cv_files"
  ON cv_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  icon_class TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---- 3. شحن البيانات الأساسية (SEED DATA) ----

-- إدخل التصنيفات
INSERT INTO categories (name, slug) VALUES 
  ('Frontend Development', 'frontend'),
  ('Backend Development', 'backend'),
  ('DevOps & Infrastructure', 'devops'),
  ('AI & Intelligent Systems', 'ai-ml')
ON CONFLICT (slug) DO NOTHING;

-- إدخال المهارات بربط الـ UUID الصحيح (تم تصحيح سطر الـ OWASP Security)
INSERT INTO skills (name, category_id) VALUES 
  ('React', (SELECT id FROM categories WHERE slug = 'frontend')),
  ('Next.js', (SELECT id FROM categories WHERE slug = 'frontend')),
  ('TypeScript', (SELECT id FROM categories WHERE slug = 'frontend')),
  ('Node.js', (SELECT id FROM categories WHERE slug = 'backend')),
  ('Express.js', (SELECT id FROM categories WHERE slug = 'backend')),
  ('PostgreSQL', (SELECT id FROM categories WHERE slug = 'backend')),
  ('MongoDB', (SELECT id FROM categories WHERE slug = 'backend')),
  ('Docker', (SELECT id FROM categories WHERE slug = 'devops')),
  ('OWASP Security', (SELECT id FROM categories WHERE slug = 'backend')),
  ('Agentic AI Workflows', (SELECT id FROM categories WHERE slug = 'ai-ml'));

-- إدخال بيانات الملف الشخصي الشخصية
INSERT INTO profile_settings (full_name, title, bio, profile_image_url) 
VALUES (
  'Belal Ebrahim Sobhy', 
  'Full-stack Developer & Agentic Systems Engineer', 
  'Passionate about building scalable backend architectures, robust database environments, and autonomous AI agent workflows.',
  'https://github.com/belalsobhy.png'
);

-- إدخال المشاريع النموذجية لملء التمبلت
INSERT INTO projects (title, description, tags, github_url, live_url) VALUES
  ('Laresa E-Commerce Platform', 'A full-featured e-commerce platform with dynamic schema architecture, JWT authentication, and secure checkout backend.', ARRAY['Node.js', 'Express', 'JWT', 'PostgreSQL'], 'https://github.com/belal/ecommerce', 'https://ecommerce-demo.com'),
  ('AI Chat Assistant & Agent', 'An intelligent chat assistant powered by LLMs with context awareness and agentic workflows.', ARRAY['Python', 'LangChain', 'Gemini API'], 'https://github.com/belal/ai-chat', 'https://ai-chat-demo.com'),
  ('Modern Portfolio Project', 'Clean portfolio ecosystem built with v0 template layout and interactive admin controls.', ARRAY['Next.js', 'TailwindCSS', 'Supabase'], 'https://github.com/belal/portfolio', 'https://belal.dev');

-- إدخال خبرات العمل والدراسة
INSERT INTO experiences (title, company, duration, description) VALUES
  ('Lead Data & Academic Research Assistant', 'Freelance', '2023 - Present', 'Specialized in sensitive data management, prompt engineering optimization, and custom automated tools.'),
  ('B.Sc. Computer Science Student', 'Thebes Academy', '2024 - Present', 'Focusing on robust software development practices, secure code implementations, and systems architecture.');

-- إدخال بيانات التواصل المظبوطة
INSERT INTO contact_info (platform_name, value, icon_class) VALUES
  ('WhatsApp', 'https://wa.me/201060911823', 'fab fa-whatsapp')
ON CONFLICT (platform_name) DO NOTHING;