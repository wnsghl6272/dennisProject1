'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';

interface CartItem {
  cart_id: number;
  product_id: string;
  description: string;
  price: string;
  photo_url: string;
  seller_name: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/api/auth/user');
        if (response.status === 200) {
          setUserId(response.data.user.id);
          fetchCartItems(response.data.user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      }
    };

    const fetchCartItems = async (userId: string) => {
      try {
        const response = await apiClient.get(`/api/cart?userId=${userId}`);
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const removeFromCart = async (cartItemId: string | number) => {
    if (!cartItemId) {
      console.error('Invalid cart item ID');
      return;
    }

    try {
      const response = await apiClient.delete(`/api/cart/${cartItemId}`);
      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.cart_id !== cartItemId));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    router.push(`/checkout?fromCart=true&amount=${totalAmount}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="flex border rounded-lg p-4 space-x-4">
                <img
                  src={item.photo_url}
                  alt={item.description}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.description}</h3>
                  <p className="text-gray-600">Seller: {item.seller_name}</p>
                  <p className="text-lg font-bold">${item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.cart_id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="border rounded-lg p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}