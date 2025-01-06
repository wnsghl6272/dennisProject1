'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/app/utils/apiClient';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  product_id: string;
  description: string;
  price: number;
  photo_url: string;
}

const MyCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiClient.get('/api/cart');
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (cartItems.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      <div className="space-y-4">
        {cartItems.reduce((acc: CartItem[], item) => {
          const existingItem = acc.find(i => i.product_id === item.product_id);
          if (!existingItem) {
            acc.push(item);
          }
          return acc;
        }, []).map(item => (
          <div key={item.id} className="border p-4 rounded-lg flex items-center">
            <img src={item.photo_url} alt={item.description} className="w-16 h-16 mr-4" /> {/* 이미지 크기 조정 */}
            <div>
              <h2 className="text-lg font-semibold">{item.description}</h2>
              <p className="text-md">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCart;