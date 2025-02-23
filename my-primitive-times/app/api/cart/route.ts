import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

// 장바구니 아이템 추가
export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();
    
    // userId와 productId가 유효한지 확인
    if (!userId || !productId) {
      return NextResponse.json(
        { message: 'Invalid user ID or product ID' },
        { status: 400 }
      );
    }

    // 먼저 uploads 테이블에서 해당 제품의 기본 정보를 가져옴
    const productInfo = await db.query(
      'SELECT description FROM uploads WHERE product_id = $1',
      [productId]
    );

    if (productInfo.rows.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // 이미 장바구니에 있는지 확인
    const existingItem = await db.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId.toString()]  // productId를 문자열로 변환
    );

    if (existingItem.rows.length > 0) {
      return NextResponse.json(
        { message: 'Item already in cart' },
        { status: 400 }
      );
    }

    // 장바구니에 추가
    const result = await db.query(
      'INSERT INTO cart (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [userId, productId.toString()]  // productId를 문자열로 변환
    );

    return NextResponse.json(
      { message: 'Item added to cart', item: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// 사용자의 장바구니 아이템 조회
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await db.query(`
      SELECT DISTINCT ON (u.description)
        c.id as cart_id,
        c.product_id,
        u.description,
        u.price,
        p.photo_url,
        CASE 
          WHEN users.google_id IS NOT NULL THEN users.name
          ELSE users.username
        END as seller_name
      FROM cart c
      JOIN uploads u ON c.product_id::text = u.product_id::text
      JOIN products p ON u.product_id::text = p.product_id::text
      LEFT JOIN users ON u.user_id = users.google_id OR u.user_id = users.uuid::text
      WHERE c.user_id = $1::text
      GROUP BY c.id, c.product_id, u.description, u.price, p.photo_url, users.google_id, users.name, users.username
    `, [userId.toString()]);

    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}