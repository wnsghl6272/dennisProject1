// app/salewear/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // router 추가

interface Product {
  id: number;
  title: string;
  price: number;
  category: string; // 카테고리
  image: string; // 이미지 URL
}

const Salewear: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // router 초기화

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products'); // 모든 제품 가져오기
        console.log(response.data); // API 응답을 콘솔에 출력

        // 세일 중인 제품 필터링 (예: 가격이 20 이하인 경우)
        const saleProducts = response.data.filter((product: Product) => product.price < 20); // 예시로 가격이 20 이하인 제품을 세일로 간주
        setProducts(saleProducts); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Sale Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div>No products found.</div> // 제품이 없을 경우 메시지 표시
        ) : (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-48 object-cover cursor-pointer" 
                onClick={() => router.push(`/products/fakeapi/${product.id}`)} // 상품 클릭 시 fakeapi 상세 페이지로 이동
              />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-700">${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Salewear;