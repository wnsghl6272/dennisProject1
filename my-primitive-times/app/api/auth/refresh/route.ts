// pages/api/auth/refresh.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  // Get the refresh token from cookies
  const cookie = req.cookies.get('refreshToken');

  if (!cookie || typeof cookie.value !== 'string') {
    console.error('No refresh token found or invalid cookie format');
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const refreshToken = cookie.value; // Access the cookie's value

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    const { id } = decoded;

    // Generate a new access token
    const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '5m' });

    // Set the new access token in an HttpOnly cookie
    const response = NextResponse.json({ message: 'New access token generated' });

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use Secure flag only in production
      sameSite: 'strict',
      path: '/',
      maxAge: 300, // 5 minutes
    });

     //to store the newly generated access token in an HttpOnly cookie. 
    //This will ensure that when the refresh token is used to generate a new access token, it is securely sent to the client as a cookie.


    console.log('New access token generated successfully.');

    return response;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Refresh token expired:', error);
      return NextResponse.json({ message: 'Refresh token expired' }, { status: 403 });
    } else {
      console.error('Error verifying refresh token:', error);
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    }
  }
}

