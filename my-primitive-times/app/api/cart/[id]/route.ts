import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { message: 'Invalid cart item ID' },
        { status: 400 }
      );
    }

    const result = await db.query(
      'DELETE FROM cart WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Item removed from cart',
      deletedItem: result.rows[0]
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}