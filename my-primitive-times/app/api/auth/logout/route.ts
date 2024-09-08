// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Remove accessToken cookie
  response.cookies.set('accessToken', '', {
    path: '/', // Ensure this matches the path used when setting the cookie
    sameSite: 'strict', // Use the same SameSite setting
    secure: process.env.NODE_ENV === 'production', // Use Secure flag only in production
    maxAge: -1, // Set maxAge to -1 to delete the cookie
  });

  // Remove refreshToken cookie
  response.cookies.set('refreshToken', '', {
    path: '/', // Ensure this matches the path used when setting the cookie
    sameSite: 'strict', // Use the same SameSite setting
    secure: process.env.NODE_ENV === 'production', // Use Secure flag only in production
    maxAge: -1, // Set maxAge to -1 to delete the cookie
  });

  return response;
}
