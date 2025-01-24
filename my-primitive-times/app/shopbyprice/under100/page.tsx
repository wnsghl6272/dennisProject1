// app/shopbyprice/under100/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // router 추가

interface Product {
  id: number;
  title: string;
  price: number;
  image: string; // 이미지 URL
}

const Under100: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // router 초기화

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const filteredProducts = response.data.filter((product: Product) => product.price < 100);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Products Under $100</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div>No products found.</div>
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

export default Under100;