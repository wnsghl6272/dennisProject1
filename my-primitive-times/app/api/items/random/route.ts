import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    // 모든 제품을 가져오는 쿼리
    const query = `
      SELECT 
        u.id, 
        MIN(i.photo_url) AS photo_url,  -- Select the first image for each product
        u.description, 
        u.brand, 
        u.condition, 
        u.price
    FROM uploads u
    LEFT JOIN products i ON u.product_id = i.product_id
    GROUP BY u.id, u.description, u.brand, u.condition, u.price
    ORDER BY RANDOM()
    LIMIT 7;
    `;

    const result = await db.query(query);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        message: 'No items found',
        items: [] 
      });
    }

    return NextResponse.json({ 
      items: result.rows,
      count: result.rows.length 
    });

  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' }, 
      { status: 500 }
    );
  }
}