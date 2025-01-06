import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { productId } = await req.json();

    const query = `
      INSERT INTO cart (user_id, product_id)
      VALUES ($1, $2)
    `;
    await pool.query(query, [decoded.id, productId]);

    return NextResponse.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json({ message: 'Failed to add product to cart' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const query = `
      SELECT c.id, c.product_id, u.description, u.price, i.photo_url
      FROM cart c
      JOIN uploads u ON c.product_id = u.product_id
      JOIN products i ON u.product_id = i.product_id
      WHERE c.user_id = $1
    `;
    const { rows: items } = await pool.query(query, [decoded.id]);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ message: 'Failed to fetch cart items' }, { status: 500 });
  }
}