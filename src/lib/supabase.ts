import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    try {
      new URL(envUrl);
      return envUrl;
    } catch (e) {
      console.warn('Invalid VITE_SUPABASE_URL, using fallback');
    }
  }
  return 'https://ecbclssrsgzirvshmzqy.supabase.co';
};

const getSupabaseAnonKey = () => {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && typeof envKey === 'string' && envKey.length > 20) {
    return envKey;
  }
  return 'your-anon-key';
};

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
