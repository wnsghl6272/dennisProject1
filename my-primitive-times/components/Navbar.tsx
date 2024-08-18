// components/Navbar.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Client Components

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogoClick = () => {
    router.push('/'); // Navigate to the homepage
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img src="/logo.png" alt="Logo" className="h-8 mr-4" />
        </div>

        {/* Middle Section: Search bar */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Right Section: Icons and Buttons */}
        <div className="flex items-center space-x-4">
          <ul className="flex items-center space-x-4">
            <li>
              <img
                src="/heart.png"
                alt="Favorite"
                className="w-6 h-6" // Adjust size as needed
              />
            </li>
            <li>
              <img
                src="/bag.png"
                alt="Shopping Cart"
                className="w-6 h-6" // Adjust size as needed
              />
            </li>
          </ul>
          <button
            onClick={() => handleNavigation('/sell-now')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Sell Now
          </button>
          <button
            onClick={() => handleNavigation('/signup')}
            className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-100"
          >
            Sign Up
          </button>
          <button
            onClick={() => handleNavigation('/login')}
            className="px-4 py-2 text-black"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
