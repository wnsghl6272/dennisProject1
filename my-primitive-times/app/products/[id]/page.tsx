'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';
import Image from 'next/image';

interface Product {
  id: string;
  photo_url: string;
  description: string;
  category: string;
  brand: string;
  condition: string;
  price: string;
  location: string;
  city: string;
  user_id: string;
  created_at: string;
  seller_name: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/api/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.photo_url}
            alt={product.description}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Price and Condition */}
          <div className="mb-6">
            <p className="text-3xl font-bold">${product.price}</p>
            <p className="text-gray-600">Condition: {product.condition}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Buy now
            </button>
            <button className="w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Add to bag
            </button>
            <button className="w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Make offer
            </button>
          </div>

          {/* Description Section */}
          <div className="border-t border-b border-gray-200 py-4 my-6">
            <div className="space-y-2">
              <p className="text-gray-800">{product.description}</p>
              <p className="text-gray-500 text-sm">
                Posted on {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <span className="font-medium">
                {product.seller_name} {/* 판매자 이름 표시 */}
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
            <p className="text-gray-600">Brand: {product.brand}</p>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Location: {product.city}, {product.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}