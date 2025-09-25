import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Ensure environment variables are loaded when this module is imported
const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing required Supabase environment variables:
    SUPABASE_URL: ${supabaseUrl ? 'Found' : 'Missing'}
    SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? 'Found' : 'Missing'}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
