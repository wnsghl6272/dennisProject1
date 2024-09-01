// app/api/auth/login/route.ts
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../../../lib/db';

dotenv.config();

interface User {
  email: string;
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    const response = new Response(JSON.stringify({ message: 'Logged in successfully' }), { status: 200 });
    
    // save the token in cookie
    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Secure; Max-Age=3600; Path=/;`);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
