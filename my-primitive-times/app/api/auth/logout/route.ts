// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Remove accessToken cookie
  response.cookies.set('accessToken', '', {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, 
  });

  // Remove refreshToken cookie
  response.cookies.set('refreshToken', '', {
    path: '/', 
    sameSite: 'strict', 
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, 
  });

  return response;
}
