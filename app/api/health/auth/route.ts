// app/api/health/auth/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    supabase: { status: 'unknown', message: '' },
    resend: { status: 'unknown', message: '' },
    environment: { status: 'unknown', message: '' }
  };

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SITE_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    checks.environment = {
      status: 'error',
      message: `Missing environment variables: ${missingVars.join(', ')}`
    };
  } else {
    checks.environment = {
      status: 'ok',
      message: 'All required environment variables present'
    };
  }

  // Check Supabase Admin connectivity
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Try a simple query to verify connection
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .select('count')
      .limit(1);

    if (error) {
      checks.supabase = {
        status: 'error',
        message: `Database query failed: ${error.message}`
      };
    } else {
      checks.supabase = {
        status: 'ok',
        message: 'Supabase Admin client connected successfully'
      };
    }
  } catch (error) {
    checks.supabase = {
      status: 'error',
      message: `Supabase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }

  // Check Resend connectivity
  try {
    if (!process.env.RESEND_API_KEY) {
      checks.resend = {
        status: 'error',
        message: 'RESEND_API_KEY not configured'
      };
    } else {
      // Use Resend's API key validation endpoint
      const response = await fetch('https://api.resend.com/api-keys', {
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        }
      });

      if (response.ok) {
        checks.resend = {
          status: 'ok',
          message: 'Resend API key is valid'
        };
      } else {
        checks.resend = {
          status: 'error',
          message: `Resend API validation failed: ${response.status}`
        };
      }
    }
  } catch (error) {
    checks.resend = {
      status: 'error',
      message: `Resend check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }

  // Determine overall status
  const hasErrors = Object.values(checks)
    .filter(check => typeof check === 'object' && 'status' in check)
    .some(check => check.status === 'error');

  const statusCode = hasErrors ? 503 : 200;

  return NextResponse.json({
    status: hasErrors ? 'unhealthy' : 'healthy',
    checks
  }, { status: statusCode });
}
