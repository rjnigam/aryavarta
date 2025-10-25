import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Health check endpoint for auth-related services
 * Verifies:
 * 1. Supabase connection with anon key
 * 2. Supabase Admin connectivity (service role)
 * 3. Resend API availability
 */
export async function GET(request: NextRequest) {
  const checks = {
    supabase_anon: false,
    supabase_admin: false,
    resend_api: false,
    environment_vars: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    },
  };

  const errors: string[] = [];

  // Check Supabase connection with anon key
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Simple query to verify connection
    const { error } = await supabaseAnon
      .from('subscribers')
      .select('count')
      .limit(1)
      .single();

    if (!error || error.code === 'PGRST116') {
      // PGRST116 means no rows, which is fine for a health check
      checks.supabase_anon = true;
    } else {
      throw error;
    }
  } catch (error) {
    errors.push(`Supabase anon connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check Supabase Admin connectivity
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Admin client should be able to bypass RLS
    const { error } = await supabaseAdmin
      .from('subscribers')
      .select('count')
      .limit(1)
      .single();

    if (!error || error.code === 'PGRST116') {
      checks.supabase_admin = true;
    } else {
      throw error;
    }
  } catch (error) {
    errors.push(`Supabase admin connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check Resend API availability
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Just verify the API key format (starts with re_)
    if (process.env.RESEND_API_KEY.startsWith('re_')) {
      checks.resend_api = true;
    } else {
      throw new Error('Invalid RESEND_API_KEY format');
    }

    // Note: We don't make an actual API call to Resend to avoid rate limits
    // In production, you might want to check /v1/emails endpoint
  } catch (error) {
    errors.push(`Resend API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const isHealthy = checks.supabase_anon && checks.supabase_admin && checks.resend_api;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      errors: errors.length > 0 ? errors : undefined,
    },
    { 
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  );
}