// app/products/fakeapi/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface FakeProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller_name: string; // 판매자 이름 추가
  condition: string; // 상태 추가
  brand: string; // 브랜드 추가
  location: string; // 위치 추가
  city: string; // 도시 추가
  created_at: string; // 생성 날짜 추가
}

export default function FakeApiProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [fakeProduct, setFakeProduct] = useState<FakeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 로그인 상태 추가

  useEffect(() => {
    const fetchFakeProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setFakeProduct(response.data);
      } catch (error) {
        console.error('Error fetching product from Fake API:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check'); // 로그인 상태 확인 API 호출
        setIsLoggedIn(response.data.isLogin);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    fetchFakeProduct();
    checkLoginStatus();
  }, [id]);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push('/login'); // 로그인 페이지로 리다이렉트
    } else if (fakeProduct) {
      const query = new URLSearchParams({
        sellerName: fakeProduct.seller_name || 'Junn',
        productDescription: fakeProduct.description,
        productPrice: fakeProduct.price.toString(),
        productId: fakeProduct.id.toString(),
      }).toString();

      router.push(`/checkout?${query}`);
    } else {
      console.error('Product is not available');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!fakeProduct) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={fakeProduct.image} // Display the single image
            alt={fakeProduct.description}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Price and Condition */}
          <div className="mb-6">
            <p className="text-3xl font-bold">${fakeProduct.price}</p>
            <p className="text-gray-600">Condition: {fakeProduct.condition || 'Very Good'}</p>
            <p className="text-gray-600">Product ID: {fakeProduct.id}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Buy now
            </button>
          </div>

          {/* Description Section */}
          <div className="border-t border-b border-gray-200 py-4 my-6">
            <div className="space-y-2">
              <p className="text-gray-800">{fakeProduct.description}</p>
              <p className="text-gray-500 text-sm">
                Posted on {new Date(fakeProduct.created_at || '2025. 1. 24.').toLocaleDateString()} {/* 날짜 포맷 */}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <span className="font-medium">
                {fakeProduct.seller_name || 'Junn'} {/* 판매자 이름 표시 */}
              </span>
            </div>
            <div className="flex flex-col space-y-2 ml-13">
              <button className="w-[200px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                Visit shop
              </button>
              <button className="w-[200px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                Ask a question
              </button>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-600">Brand: {fakeProduct.brand || 'No Brand'}</p>
            <p className="text-gray-600">Category: {fakeProduct.category}</p>
            <p className="text-gray-600">Location: {fakeProduct.city || 'Sydney'}, {fakeProduct.location || 'Australia'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}