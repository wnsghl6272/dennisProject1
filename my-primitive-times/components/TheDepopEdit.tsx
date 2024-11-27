'use client';
import React, { useEffect, useState } from 'react';
import apiClient from '@/app/utils/apiClient';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  photo_url: string;
  description: string;
  brand: string;
  condition: string;
  price: number;
}

const TheDepopEdit: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomItems = async () => {
      try {
        const response = await apiClient.get('/api/items/random');
        setItems(response.data.items);
      } catch (error) {
        console.error('Error fetching random items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomItems();
  }, []);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const SkeletonLoader = () => {
    return (
      <section className="w-full mt-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title Skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-36 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 sm:mt-0 w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
  
          {/* Images Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mobile Skeleton */}
            <div className="md:hidden space-y-4">
              {/* Large Image Skeleton */}
              <div className="w-full h-[200px] bg-gray-200 rounded animate-pulse"></div>
              
              {/* 2x3 Grid Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-[200px] bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
  
            {/* Desktop Skeleton */}
            <div className="hidden md:grid md:col-span-2 grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-[200px] bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="hidden md:block md:col-span-1">
              <div className="w-full h-full min-h-[400px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }
  return (
    <section className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title and Description */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">The Depop Edit</h2>
            <p className="text-base sm:text-lg text-gray-600">Items we love, updated daily</p>
          </div>
          <a href="#see-more" className="mt-4 sm:mt-0 text-gray-600 underline">
            See more
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left Side: 3 Columns and 3 Rows */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {items.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleProductClick(item.id)}
              >
                <img
                  src={item.photo_url} // Display the first image directly
                  alt={item.description}
                  className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-bold">${item.price}</p>
                  <p className="text-xs">{item.brand}</p>
                  <p className="text-xs">{item.condition}</p>
                </div>
              </div>
            ))}

            {/* Fill remaining spaces with empty images */}
            {items.length < 6 && 
              [...Array(6 - items.length)].map((_, i) => (
                <div key={i} className="relative overflow-hidden group cursor-default">
                  <div className="w-full h-[200px] bg-gray-200 rounded"></div>
                </div>
              ))
            }
          </div>

          {/* Right Side: Large Image or Placeholder */}
          <div className="col-span-1 relative overflow-hidden group cursor-default">
            {items.length > 6 ? (
              <div 
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleProductClick(items[6].id)} // Use the 7th item for the large image
              >
                <img
                  src={items[6].photo_url} // Display the first image directly
                  alt={items[6].description}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-bold">${items[6].price}</p>
                  <p className="text-xs">{items[6].brand}</p>
                  <p className="text-xs">{items[6].condition}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded"></div> // Placeholder for the large image
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheDepopEdit;