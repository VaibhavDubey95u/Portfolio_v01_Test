import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Query information_schema.tables is usually blocked by RLS for anon keys.
  // Instead, let's just try fetching from 'skills_meta', 'section_headers', 'skills_header'
  const tables = ['skills_meta', 'skills_header', 'section_headers', 'skills_settings'];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t} error:`, error.message);
    } else {
      console.log(`Table ${t} EXISTS!`);
    }
  }
}
run();
