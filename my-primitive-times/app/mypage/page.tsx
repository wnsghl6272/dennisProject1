// app/components/MyPage.tsx
'use client'
import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  name: string; // for google login
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get('/api/auth/user');
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {loading ? (
        <div className="animate-pulse w-full h-full flex flex-col items-start justify-start px-10 py-8">
          <div className="flex space-x-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-6 h-4 bg-gray-300 rounded w-full"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded w-full"></div>
          <div className="mt-6 grid grid-cols-5 gap-4 w-full">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
          <div className="mt-10 border border-gray-300 p-6 text-center w-full">
            <p className="text-gray-400">Start selling today and turn your clothes into cash</p>
            <div className="mt-4 w-full h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : user ? (
        <div className="w-full h-full flex flex-col items-start justify-start px-10 py-8">
          <div className="flex space-x-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user.first_name || user.name}
              </h1>
              <p className="text-xl">
                {user.first_name ? `${user.first_name} ${user.last_name}` : user.name}
              </p>
              <p className="text-lg">Username: {user.username || user.name}</p>
              <p className="text-lg">Email: {user.email}</p>
            </div>
          </div>
          <p className="mt-4">Active today</p>
          <p className="mt-2">0 Followers 0 Following</p>
          <p className="mt-6">
            {user.username ? `${user.username}'s shop` : `${user.name}'s shop`}
          </p>
          <div className="mt-6 grid grid-cols-5 gap-4 w-full">
            <div className="p-2 border border-gray-300 text-center">All</div>
            <div className="p-2 border border-gray-300 text-center">Selling</div>
            <div className="p-2 border border-gray-300 text-center">Sold</div>
            <div className="p-2 border border-gray-300 text-center">Likes</div>
            <div className="p-2 border border-gray-300 text-center">Saved</div>
          </div>
          <div className="mt-10 border border-gray-300 p-6 text-center w-full">
            <p>Start selling today and turn your clothes into cash</p>
            <button className="mt-4 px-6 py-3 bg-black text-white rounded-lg">List an item</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyPage;
