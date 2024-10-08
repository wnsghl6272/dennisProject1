// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../../../lib/db';
import { generateTokens } from '../../../lib/token'; // generateTokens 함수 가져오기

dotenv.config();

interface User {
  email: string;
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();

    console.log('Login request with:', { email, username, password });

    if ((!email && !username) || !password) {
      return new Response(JSON.stringify({ message: 'Email or username and password are required' }), { status: 400 });
    }

    const { rows: users } = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email || '', username || '']
    );

    const user = users[0];
    console.log('Found user:', user);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid username or email' }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.uuid);

    // Set tokens in cookies
    const response = NextResponse.json({ message: 'Logged in successfully' });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use Secure flag only in production
      sameSite: 'strict',
      path: '/',
      maxAge: 300, // 5 minutes
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use Secure flag only in production
      sameSite: 'strict',
      path: '/',
      maxAge: 604800, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
