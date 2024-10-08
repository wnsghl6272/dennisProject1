// components/ShopByStyle.tsx
'use client';
import React from 'react';

const styles = [
  { src: '/images/style1.jpg', name: 'Cosquette' },
  { src: '/images/style2.jpg', name: 'Streetwear' },
  { src: '/images/style3.jpg', name: 'Connect the dots' },
  { src: '/images/style4.jpg', name: 'Grunge' },
  { src: '/images/style5.jpg', name: 'Spectator style' },
  { src: '/images/style6.jpg', name: 'Camo' },
];

const ShopByStyle: React.FC = () => {
  return (
    <section className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by style</h2>

        {/* Style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {styles.map((style, index) => (
            <a
              key={index}
              href={`/style/${style.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              {/* Image with Hover Effect */}
              <div className="relative w-full h-60">
                <img
                  src={style.src}
                  alt={style.name}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              {/* Style Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 p-2 text-center">
                <h3 className="text-sm sm:text-lg font-bold">{style.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStyle;

