// api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'ad1das23ads148344';

export async function GET(req: NextRequest) {
  console.log("API request received at /api/auth/user");

  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log('Decoded token:', decoded);

    // 타입에 따라 적절한 쿼리를 선택
    const query = `
      SELECT * FROM users 
      WHERE uuid::text = $1 OR google_id = $1
    `;

    const { rows: users } = await pool.query(query, [decoded.id]);

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
