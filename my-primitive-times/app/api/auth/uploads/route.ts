// app/api/auth/uploads.ts
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Handle POST request
export async function POST(request: Request) {
    try {
        const { user_id, is_google_user, description, category, brand, condition, location, city, price, photo_url } = await request.json();

        // Save image record in the images table
        const imageResult = await db.query(
            'INSERT INTO images (photo_url) VALUES ($1) RETURNING id',
            [photo_url]
        );

        const imageId = imageResult.rows[0].id;

        // Save upload record in the database
        const uploadResult = await db.query(
            'INSERT INTO uploads (user_id, image_id, description, category, brand, condition, location, city, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, imageId, description, category, brand, condition, location, city, price]
        );

        return NextResponse.json(uploadResult.rows[0], { status: 201 }); // Successful upload
    } catch (error) {
        console.error('Error saving upload record:', error);
        return NextResponse.json({ error: 'Failed to save upload record' }, { status: 500 });
    }
}

// For unsupported methods
export async function OPTIONS() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
