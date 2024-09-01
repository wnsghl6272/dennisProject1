// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

const client = new OAuth2Client(CLIENT_ID, '', REDIRECT_URI);

export async function GET(req: NextRequest) {
  try {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    return new Response(JSON.stringify({ message: 'Error generating URL' }), { status: 500 });
  }
}
