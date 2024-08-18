// components/PopularThisWeek.tsx
'use client';
import React, { useState } from 'react';

const items = [
  { src: '/images/item1.jpg', title: 'Jumper', description: '+1k searches in the last week', link: '/jumper' },
  { src: '/images/item2.jpg', title: 'T-shirt', description: '+800 searches in the last week', link: '/t-shirt' },
  { src: '/images/item3.jpg', title: 'Shoes', description: '+1.5k searches in the last week', link: '/shoes' },
  { src: '/images/item4.jpg', title: 'Hat', description: '+500 searches in the last week', link: '/hat' },
  { src: '/images/item5.jpg', title: 'Jacket', description: '+700 searches in the last week', link: '/jacket' },
  { src: '/images/item6.jpg', title: 'Scarf', description: '+400 searches in the last week', link: '/scarf' },
  { src: '/images/item7.jpg', title: 'Gloves', description: '+300 searches in the last week', link: '/gloves' },
  { src: '/images/item8.jpg', title: 'Socks', description: '+600 searches in the last week', link: '/socks' },
];

const PopularItems: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(items.length / 4));
  };

  return (
    <section className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">Popular this week</h2>

        {/* Popular Items Container */}
        <div className="relative">
          {/* Items Grid (Desktop) */}
          <div className="hidden md:flex overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="flex-shrink-0 w-1/4 p-2"
                >
                  {/* Image with Hover Effect */}
                  <div className="relative w-full h-60 overflow-hidden rounded-lg shadow-lg group">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  {/* Title and Description */}
                  <div className="mt-2 text-center">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
            {/* Right Arrow Button (Desktop) */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-800"
              onClick={nextSlide}
            >
              <span className="text-xl">&rarr;</span> {/* Right arrow */}
            </button>
          </div>

          {/* Horizontal Scroll (Mobile) */}
          <div className="md:hidden flex overflow-x-auto space-x-4 py-4">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 p-2"
              >
                {/* Image with Hover Effect */}
                <div className="relative w-full h-60 overflow-hidden rounded-lg shadow-lg group">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                {/* Title and Description */}
                <div className="mt-2 text-center">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
