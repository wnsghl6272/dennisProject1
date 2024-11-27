import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Handle POST request
export async function POST(request: Request) {
    try {
        const { user_id, is_google_user, description, category, brand, condition, location, city, price, photo_urls } = await request.json();

        // Create a new product entry using the first image URL
        const productResult = await db.query(
            'INSERT INTO products (photo_url) VALUES ($1) RETURNING product_id',
            [photo_urls[0]] // Use the first image URL to create the product
        );
        const productId = productResult.rows[0].product_id; // Get the generated product_id

        // Save upload record in the uploads table
        const uploadResult = await db.query(
            'INSERT INTO uploads (user_id, product_id, description, category, brand, condition, location, city, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, productId, description, category, brand, condition, location, city, price]
        );

        // Insert all photo URLs into the products table, starting from the second image
        for (let i = 0; i < photo_urls.length; i++) {
            if (i === 0) continue; // Skip the first image since it's already inserted
            await db.query(
                'INSERT INTO products (product_id, photo_url) VALUES ($1, $2)',
                [productId, photo_urls[i]]
            );
        }

        return NextResponse.json(uploadResult.rows[0], { status: 201 }); // Successful upload
    } catch (error) {
        console.error('Error saving upload record:', error);
        return NextResponse.json({ error: 'Failed to save upload record' }, { status: 500 });
    }
}