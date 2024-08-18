// pages/signup-email.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';

const SignUpEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true); // Default to true for initial load
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  // Validate password function
  const validatePassword = (password: string) => {
    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}:;<>,.?/~`|\\[\]]).{8,}$/;
    return pattern.test(password);
  };

  // Validate email to allow common formats
  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValid(validatePassword(newPassword));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left half: Image (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/signupImg.png" // Replace with your image path
          alt="Sign up image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Right half: Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <form className="w-full max-w-md">
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
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
            {/* Email validation message */}
            {!emailValid && email && (
              <p className="text-red-500 text-sm mt-2">Not a valid email format</p>
            )}
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
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
              onChange={handlePasswordChange}
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
            {/* Password validation message */}
            {!passwordValid && password && (
              <p className="text-red-500 text-sm mt-2">Password does not meet the requirements</p>
            )}
          </div>

          {/* Next Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 ${
              !passwordValid || !emailValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!passwordValid || !emailValid}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpEmail;
