import { NextRequest, NextResponse } from 'next/server';
import { DEMO_CREDENTIALS, DEMO_USER, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const isEmailValid = trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase();
    const isPasswordValid = password === DEMO_CREDENTIALS.password;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Successful authentication: issue session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: DEMO_USER.id,
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        role: DEMO_USER.role,
        issuedAt: Date.now(),
      })
    ).toString('base64');

    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day

    const response = NextResponse.json({
      success: true,
      user: DEMO_USER,
      message: 'Authentication successful.',
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server authentication error.' },
      { status: 500 }
    );
  }
}
