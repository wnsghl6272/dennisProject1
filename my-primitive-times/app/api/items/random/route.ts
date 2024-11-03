import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const query = `
      SELECT id, photo_url, description, brand, condition, price
      FROM uploads
      ORDER BY RANDOM()
      LIMIT 7
    `;

    const result = await db.query(query);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        message: 'No items found',
        items: [] 
      });
    }

    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching random items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random items' }, 
      { status: 500 }
    );
  }
}