// pages/api/auth/refresh.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  // Get the refresh token from cookies
  const cookie = req.cookies.get('refreshToken');
  
  if (!cookie || typeof cookie !== 'string') {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const refreshToken = cookie;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    const { id } = decoded;

    // Generate a new access token
    const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '5m' });

    console.log('Refresh Token:', refreshToken);
    console.log('Decoded Token:', decoded);

    return NextResponse.json({ accessToken: newAccessToken });

    
  } catch (error) {
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
  }
}
