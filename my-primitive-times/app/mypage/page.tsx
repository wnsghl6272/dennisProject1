// app/components/MyPage.tsx
'use client'
import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { useRouter } from 'next/navigation';

interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  name: string; // for google login
}

interface Item {
  id: string;
  photo_url: string;
  description: string;
  category: string;
  brand: string;
  condition: string;
  location: string;
  city: string;
  price: number;
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

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

    const fetchUserItems = async () => {
      try {
        const itemsResponse = await apiClient.get('/api/items/user');
        setItems(itemsResponse.data.items);
      } catch (err) {
        setError('Failed to fetch user items');
      }
    };
    
    fetchUserDetails();
    fetchUserItems();
    setLoading(false);
  }, []);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (error) return <p>{error}</p>;

  const SkeletonLoader = () => {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <div className="w-full h-full flex flex-col items-start justify-start px-10 py-8">
          {/* User Details Skeleton */}
          <div className="flex space-x-8 w-full">
            <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
  
          {/* Status Skeleton */}
          <div className="mt-4 h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
          <div className="mt-2 h-5 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="mt-6 h-6 bg-gray-300 rounded w-36 animate-pulse"></div>
  
          {/* Navigation Tabs Skeleton */}
          <div className="mt-6 grid grid-cols-5 gap-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
  
          {/* Items Grid Skeleton */}
          <div className="mt-10 border border-gray-300 p-6 w-full">
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="w-full h-48 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full h-full flex flex-col items-start justify-start px-10 py-8">
        {/* User Details */}
        <div className="flex space-x-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.first_name || user?.name}
            </h1>
            <p className="text-xl">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.name}
            </p>
            <p className="text-lg">Username: {user?.username || user?.name}</p>
            <p className="text-lg">Email: {user?.email}</p>
          </div>
        </div>
        <p className="mt-4">Active today</p>
        <p className="mt-2">0 Followers 0 Following</p>
        <p className="mt-6">
          {user?.username ? `${user.username}'s shop` : `${user?.name}'s shop`}
        </p>
        <div className="mt-6 grid grid-cols-5 gap-4 w-full">
          <div className="p-2 border border-gray-300 text-center">All</div>
          <div className="p-2 border border-gray-300 text-center">Selling</div>
          <div className="p-2 border border-gray-300 text-center">Sold</div>
          <div className="p-2 border border-gray-300 text-center">Likes</div>
          <div className="p-2 border border-gray-300 text-center">Saved</div>
        </div>

        {/* User's Listed Items */}
        <div className="mt-10 border border-gray-300 p-6 text-center w-full">
          <p className="mb-4">Start selling today and turn your clothes into cash</p>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleProductClick(item.id)}
                >
                  <img 
                    src={item.photo_url} 
                    alt={item.description} 
                    className="w-full h-48 object-cover rounded-md mb-2" 
                  />
                  <h2 className="font-semibold text-lg">{item.description}</h2>
                  <p className="text-gray-600">{item.brand}</p>
                  <p className="text-gray-500">Category: {item.category}</p>
                  <p className="text-gray-500">Condition: {item.condition}</p>
                  <p className="text-gray-500">Location: {item.city}, {item.location}</p>
                  <p className="text-black font-bold">${item.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You have no items listed. List your first item!</p>
          )}
          <button 
            className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            onClick={() => router.push('/sell-now')}
          >
            List an item
          </button>
        </div>
      </div>
    </div>
  );
};



export default MyPage;