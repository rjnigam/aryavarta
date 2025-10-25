import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabaseServerAuth';

const MODERATION_USER = process.env.MODERATION_DASHBOARD_USER;
const MODERATION_PASSWORD = process.env.MODERATION_DASHBOARD_PASSWORD;

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Moderator Dashboard", charset="UTF-8"',
    },
  });
}

function moderationAuth(request: NextRequest) {
  if (!MODERATION_USER || !MODERATION_PASSWORD) {
    console.error('[moderation.auth] Missing MODERATION_DASHBOARD_USER or MODERATION_DASHBOARD_PASSWORD');
    return new NextResponse('Moderator dashboard credentials not configured', { status: 500 });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return unauthorizedResponse();
  }

  const [scheme, encoded] = authorization.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return unauthorizedResponse();
  }

  let decoded = '';
  try {
    decoded = atob(encoded);
  } catch (error) {
    console.warn('[moderation.auth] Failed to decode authorization header', error);
    return unauthorizedResponse();
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username === MODERATION_USER && password === MODERATION_PASSWORD) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export async function middleware(request: NextRequest) {
  // Handle moderation routes with basic auth
  if (request.nextUrl.pathname.startsWith('/moderation') || 
      request.nextUrl.pathname.startsWith('/api/moderation')) {
    return moderationAuth(request);
  }

  // Handle API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/comments') && 
      request.method !== 'GET') {
    // POST, PATCH, DELETE to comments require auth
    const { supabase, response } = createMiddlewareClient(request);
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  // Handle authenticated app routes
  if (request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    const { supabase, response } = createMiddlewareClient(request);
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login with return URL
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/moderation/:path*', 
    '/api/moderation/:path*',
    '/api/comments/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
