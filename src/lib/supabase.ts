import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getRedirectTo = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/resume`;
  }
  return 'https://workinfi.com/resume';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'workinfi-resume-auth',
    redirectTo: getRedirectTo()
  },
  global: {
    headers: {
      'X-Client-Info': `workinfi-resume@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    },
  }
});