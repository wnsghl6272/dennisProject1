'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}

const Menswear: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('https://api.escuelajs.co/api/v1/products');
      setProducts(response.data.slice(0, 15));
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Menswear Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-700">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menswear;