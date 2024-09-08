// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ad1das23ads148344';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ isLogin: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ isLogin: true });
  } catch (error) {
    return NextResponse.json({ isLogin: false });
  }
}
