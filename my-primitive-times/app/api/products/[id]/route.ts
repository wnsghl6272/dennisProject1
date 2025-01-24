import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Received ID:', params.id);

    // 제품과 사용자 정보를 함께 가져오는 쿼리
    const query = `
        SELECT 
        uploads.id,
        uploads.product_id,
        uploads.description,
        uploads.price,
        uploads.brand,
        uploads.condition,
        uploads.category,
        uploads.location,
        uploads.city,
        uploads.created_at,
        i.photo_url,
        CASE 
            WHEN users.google_id IS NOT NULL THEN users.name
            ELSE users.username
        END as seller_name
    FROM uploads
    LEFT JOIN users ON 
        uploads.user_id = users.google_id OR 
        uploads.user_id = users.uuid::text
    LEFT JOIN products i ON 
        uploads.product_id = i.product_id 
    WHERE uploads.id = $1
  `;

    const result = await db.query(query, [parseInt(params.id, 10)]);
    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: result.rows[0] });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}