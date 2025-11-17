import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const MODERATION_USER = process.env.MODERATION_DASHBOARD_USER;
    const MODERATION_PASSWORD = process.env.MODERATION_DASHBOARD_PASSWORD;

    if (!MODERATION_USER || !MODERATION_PASSWORD) {
      return NextResponse.json(
        { error: 'Moderation credentials not configured' },
        { status: 500 }
      );
    }

    // Verify credentials
    if (username === MODERATION_USER && password === MODERATION_PASSWORD) {
      // Create a session token
      const credentials = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      );

      // Set an HTTP-only cookie for the moderation session
      response.cookies.set('mod_session', credentials, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/moderation',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Moderation auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
