// app/api/items/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  console.log("API request received at /api/items/user");

  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log('Decoded token:', decoded);

    const query = `
      SELECT u.id, i.photo_url, u.description, u.category, u.brand, u.condition, u.location, u.city, u.price
      FROM uploads u
      LEFT JOIN images i ON u.image_id = i.id
      WHERE u.user_id = $1
      ORDER BY u.created_at DESC
    `;

    const { rows: items } = await pool.query(query, [decoded.id]);

    if (!items.length) {
      return NextResponse.json({ message: 'No items found', items: [] });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json({ message: 'Failed to fetch user items' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
