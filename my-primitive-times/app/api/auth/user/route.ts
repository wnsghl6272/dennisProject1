// api/auth/user.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'ad1das23ads148344';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { rows: users } = await pool.query('SELECT * FROM users WHERE uuid = $1', [decoded.id]);
    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Token verification or database query failed:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}
