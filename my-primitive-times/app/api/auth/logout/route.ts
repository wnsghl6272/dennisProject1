// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { maxAge: -1, path: '/' }); // 쿠키 삭제
  return response;
}
