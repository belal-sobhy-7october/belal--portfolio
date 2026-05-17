import { createClient } from '@supabase/supabase-js';

// بنقرأ المتغيرات من ملف الـ .env اللي عندك
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables!');
}

// إنشاء وتصدير العميل
export const supabase = createClient(supabaseUrl, supabaseKey);