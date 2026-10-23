import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, DEMO_USER } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const sessionData = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
    return NextResponse.json({
      authenticated: true,
      user: {
        ...DEMO_USER,
        name: sessionData.name || DEMO_USER.name,
        email: sessionData.email || DEMO_USER.email,
        role: sessionData.role || DEMO_USER.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
