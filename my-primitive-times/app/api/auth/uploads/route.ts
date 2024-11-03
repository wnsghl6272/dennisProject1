// app/api/auth/uploads.ts
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Handle POST request
export async function POST(request: Request) {
    try {
        const { user_id, is_google_user, photo_url, description, category, brand, condition, location, city, price } = await request.json();

        // We don't need to query the users table anymore, as the trigger will handle validation

        // Save upload record in the database
        const uploadResult = await db.query(
            'INSERT INTO uploads (user_id, photo_url, description, category, brand, condition, location, city, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, photo_url, description, category, brand, condition, location, city, price]
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
