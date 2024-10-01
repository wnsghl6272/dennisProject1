// app/api/auth/signup/route.ts
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../../../lib/db';

dotenv.config();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, username, password } = await req.json();

    console.log('Received signup request with:', { firstName, lastName, email, username, password });

    // Validate the input
    if (!password || !username || !firstName || !lastName) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Validate username (1-15 characters, no special characters)
    const usernamePattern = /^[a-zA-Z0-9]{1,15}$/;
    if (!usernamePattern.test(username)) {
      return new Response(JSON.stringify({ message: 'Username must be 1-15 characters long and contain only letters and numbers' }), { status: 400 });
    }

    // Check if user already exists by email or username
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, $5)',
      [firstName, lastName, email, username, hashedPassword]
    );

    console.log('User saved to database');

    // Verify user insertion
    const { rows: savedUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Saved user:', savedUsers);

    // Generate a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token, message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
