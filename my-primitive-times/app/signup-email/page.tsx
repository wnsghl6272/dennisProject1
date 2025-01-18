// pages/signup-email.tsx
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignUpEmail: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(true);
  const router = useRouter();

  // Validate username function
  const validateUsername = (username: string) => {
    const pattern = /^[a-zA-Z0-9]{1,15}$/;
    return pattern.test(username);
  };

  // Validate password function
  const validatePassword = (password: string) => {
    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}:;<>,.?/~`|\\[\]]).{8,}$/;
    return pattern.test(password);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate username and password before making API call
    if (!validateUsername(username)) {
      setUsernameValid(false);
      return;
    }
    setUsernameValid(true);

    if (!validatePassword(password)) {
      setPasswordValid(false);
      return;
    }
    setPasswordValid(true);

    try {
      const response = await axios.post('/api/auth/signup', {
        firstName,
        lastName,
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Store token and redirect on successful signup
      localStorage.setItem('token', response.data.token);
      router.push('/'); // Redirect to home page or dashboard
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left half: Image (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/signupImg.webp" // Replace with your image path
          alt="Sign up image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Right half: Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

          {/* First Name and Last Name */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                const newUsername = e.target.value;
                setUsername(newUsername);
                setUsernameValid(validateUsername(newUsername));
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
            {!usernameValid && username && (
              <p className="text-red-500 text-sm mt-2">Username must be 1-15 characters long and contain only letters and numbers</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                setPasswordValid(validatePassword(newPassword));
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
            <div className="mt-2 text-sm text-gray-600">
              <ul>
                <li>Must be at least 8 characters</li>
                <li>Must include at least one number</li>
                <li>Must include at least one symbol</li>
              </ul>
            </div>
            {!passwordValid && password && (
              <p className="text-red-500 text-sm mt-2">Password does not meet the requirements</p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 ${
              !passwordValid || !usernameValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!passwordValid || !usernameValid}
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpEmail;

