// components/ShopByPrice.tsx
'use client';
import React from 'react';

const priceCategories = [
  { title: 'Under $10', link: '/shopbyprice/under10' },
  { title: 'Under $20', link: '/shopbyprice/under20' },
  { title: 'Under $50', link: '/shopbyprice/under50' },
  { title: 'Under $100', link: '/shopbyprice/under100' },
];

const ShopByPrice: React.FC = () => {
  return (
    <section className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by price</h2>

        {/* Price Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {priceCategories.map((category, index) => (
            <a
              key={index}
              href={category.link}
              className="bg-gradient-to-b from-white to-blue-100 p-4 rounded-lg shadow-lg flex justify-center items-center h-40 hover:bg-blue-200 transition-colors"
            >
              {/* Centered Text */}
              <h3 className="text-xl sm:text-2xl font-bold">{category.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByPrice;

