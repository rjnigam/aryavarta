import { createClient } from '@supabase/supabase-js';

export function getServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('[supabaseAdmin] Missing environment variables:', {
      url: url ? 'present' : 'missing',
      serviceKey: serviceKey ? 'present' : 'missing',
    });
    throw new Error('Missing Supabase environment variables');
  }

  // Trim any accidental whitespace from environment variables
  const cleanUrl = url.trim();
  const cleanKey = serviceKey.trim();

  return createClient(cleanUrl, cleanKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
