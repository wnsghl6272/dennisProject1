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
        console.log('Fetched items:', response.data.items); // 디버깅용

        // 중복 제거
        const uniqueItems = [...new Map(response.data.items.map((item: Item) => [item.id, item])).values()];
        console.log('Unique items:', uniqueItems); // 디버깅용

        // 정확히 7개만 필요하다면
        const limitedItems = uniqueItems.slice(0, 7);
        console.log('Limited items:', limitedItems); // 디버깅용

        setItems(limitedItems);
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

  if (loading) {
    return <div>Loading...</div>;
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mobile: Large Image */}
          {items[0] && (
            <div 
              className="md:hidden col-span-1 relative overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(items[0].id)}
            >
              <img
                src={items[0].photo_url}
                alt={items[0].description}
                className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-bold">${items[0].price}</p>
                <p className="text-xs">{items[0].brand}</p>
                <p className="text-xs">{items[0].condition}</p>
              </div>
            </div>
          )}

          {/* Mobile: 2x3 Image Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 col-span-1">
            {items.slice(1, 7).map((item) => (
              <div 
                key={item.id} 
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleProductClick(item.id)}
              >
                <img
                  src={item.photo_url}
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
          </div>

          {/* Desktop: Left Side: 2x3 Images */}
          <div className="hidden md:grid md:col-span-2 grid-cols-3 gap-4">
            {items.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleProductClick(item.id)}
              >
                <img
                  src={item.photo_url}
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
          </div>

          {/* Desktop: Right Side: Large Image */}
          {items[6] && (
            <div 
              className="hidden md:block md:col-span-1 relative overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(items[6].id)}
            >
              <img
                src={items[6].photo_url}
                alt={items[6].description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-bold">${items[6].price}</p>
                <p className="text-xs">{items[6].brand}</p>
                <p className="text-xs">{items[6].condition}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TheDepopEdit;