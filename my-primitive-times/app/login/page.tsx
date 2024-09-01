// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch } from '../store/store';
import { login } from '../store/store';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      console.log('Login response:', response.data);

      dispatch(login()); // Redux 상태 업데이트
      router.push('/'); // 홈 페이지로 리다이렉트
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'; // Google OAuth 2.0 경로로 리다이렉트
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Icon and Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Log In</h1>
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Continue with Google */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-lg hover:bg-gray-100"
      >
        <Image
          src="/icons/google-icon.png"
          alt="Google Icon"
          width={24}
          height={24}
          className="mr-2"
        />
        Continue with Google
      </button>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {/* Username or Email */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username or Email
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <Link href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Log In Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-black bg-black text-white font-bold rounded-lg hover:bg-gray-900"
        >
          Log In
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
