import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map(str => str.trim().replace(/^"|"$/g, '')))
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ skills_title: 'Updated Skills Title', skills_subtitle: 'Updated Subtitle' })
    .eq('id', 1)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Update success:', data);
  }
}
run();
