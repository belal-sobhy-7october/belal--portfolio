#!/bin/bash

# Read .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Source the .env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${NEXT_PUBLIC_SUPABASE_ANON_KEY}}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "Error: Missing Supabase credentials in .env file"
    echo "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

echo "Supabase URL: $SUPABASE_URL"
echo "Creating database tables..."

# SQL to create tables
SQL="
CREATE TABLE IF NOT EXISTS profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
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

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_class TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
"

# Execute SQL via Supabase SQL API
# Using the /rest/v1/rpc/exec_sql endpoint if available, or direct SQL
# Since Supabase doesn't have a direct SQL REST API, we'll use the PostgreSQL endpoint
# Extract the project ID from URL
PROJECT_ID=$(echo "$SUPABASE_URL" | sed -n 's|https://\([^\.]*\).*|\1|p')

echo "Project ID: $PROJECT_ID"

# Use Supabase SQL API via pgrest or direct connection
# Alternative: Use the SQL Editor API
curl -X POST "https://${PROJECT_ID}.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL" | jq -Rs .)}" 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Tables created successfully"
else
    echo "✗ Failed to create tables via RPC, trying alternative method..."
    # Try using direct PostgreSQL connection if available
    echo "Note: You may need to run SQL manually in Supabase SQL Editor"
fi

echo ""
echo "Seeding data..."

# Seed SQL
SEED_SQL="
-- Insert profile
INSERT INTO profile_settings (full_name, title, bio)
VALUES ('Belal Ebrahim Sobhy', 'Full-stack Developer & Agentic Systems Engineer', 'Passionate about building scalable web applications and intelligent systems.')
ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug) VALUES 
  ('Frontend', 'frontend'),
  ('Backend', 'backend'),
  ('DevOps', 'devops'),
  ('AI/ML', 'ai-ml')
ON CONFLICT (slug) DO NOTHING;

-- Insert skills
INSERT INTO skills (name, category_id) 
SELECT name, id FROM (
  VALUES 
    ('React', (SELECT id FROM categories WHERE slug = 'frontend')),
    ('Next.js', (SELECT id FROM categories WHERE slug = 'frontend')),
    ('TypeScript', (SELECT id FROM categories WHERE slug = 'frontend')),
    ('Node.js', (SELECT id FROM categories WHERE slug = 'backend')),
    ('Python', (SELECT id FROM categories WHERE slug = 'backend')),
    ('PostgreSQL', (SELECT id FROM categories WHERE slug = 'backend')),
    ('Docker', (SELECT id FROM categories WHERE slug = 'devops')),
    ('AWS', (SELECT id FROM categories WHERE slug = 'devops')),
    ('Machine Learning', (SELECT id FROM categories WHERE slug = 'ai-ml')),
    ('LangChain', (SELECT id FROM categories WHERE slug = 'ai-ml'))
) AS v(name, category_id)
WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert projects
INSERT INTO projects (title, description, tags, github_url, live_url) VALUES
  ('E-Commerce Platform', 'A full-featured e-commerce platform with payment integration and inventory management.', ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://github.com/belal/ecommerce', 'https://ecommerce-demo.com'),
  ('AI Chat Assistant', 'An intelligent chat assistant powered by LLMs with context awareness.', ARRAY['Python', 'LangChain', 'OpenAI'], 'https://github.com/belal/ai-chat', 'https://ai-chat-demo.com'),
  ('Portfolio Website', 'Modern portfolio website showcasing projects and skills.', ARRAY['Next.js', 'TailwindCSS', 'Supabase'], 'https://github.com/belal/portfolio', 'https://belal.dev')
ON CONFLICT DO NOTHING;

-- Insert experiences
INSERT INTO experiences (title, company, duration, description) VALUES
  ('Senior Full-Stack Developer', 'Tech Company', '2022 - Present', 'Leading development of scalable web applications and mentoring junior developers.'),
  ('Software Engineer', 'Startup Inc', '2020 - 2022', 'Built and maintained multiple client-facing applications using modern technologies.')
ON CONFLICT DO NOTHING;

-- Insert contact info
INSERT INTO contact_info (platform_name, value, icon_class) VALUES
  ('WhatsApp', 'https://wa.me/201060911823', 'fab fa-whatsapp'),
  ('Email', 'belal@example.com', 'fas fa-envelope'),
  ('GitHub', 'https://github.com/belal', 'fab fa-github')
ON CONFLICT DO NOTHING;
"

curl -X POST "https://${PROJECT_ID}.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SEED_SQL" | jq -Rs .)}" 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Data seeded successfully"
else
    echo "✗ Failed to seed data via RPC"
    echo ""
    echo "IMPORTANT: Please run the following SQL manually in Supabase SQL Editor:"
    echo "=========================================="
    echo "$SQL"
    echo ""
    echo "$SEED_SQL"
    echo "=========================================="
fi

echo ""
echo "Migration script completed"
