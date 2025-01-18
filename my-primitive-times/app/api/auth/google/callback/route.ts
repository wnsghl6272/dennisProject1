import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import pool from '../../../../lib/db'; // Ensure correct path to db.ts
import axios from 'axios'; // Use axios to make HTTP requests
import { generateTokens } from '@/app/lib/token';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`;

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get('code');

  try {
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    // Fetch user info using the Google OAuth2 API
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const { email, name, id: googleId } = userInfoResponse.data;

    // Save or update the user in PostgreSQL
    const query = `
      INSERT INTO users (email, name, google_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (google_id)
      DO UPDATE SET email = $1, name = $2
      RETURNING *;
    `;
    const values = [email, name, googleId];

    const result = await pool.query(query, values);
    const user = result.rows[0]; // The user record from the database

    // Generate JWT token including google_id
    const { accessToken, refreshToken } = generateTokens(user.google_id); // Change to user.google_id

    // Set the token in a cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=300`); // 5 minutes
    headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800`); // 7 days

    // Redirect to the home page or another page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/`, { headers });
  } catch (error) {
    console.error('Error during Google OAuth:', (error as Error).message);
    return NextResponse.json({ error: `Authentication failed: ${(error as Error).message}` }, { status: 500 });
  }
}
