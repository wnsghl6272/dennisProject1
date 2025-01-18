// components/ShopByStyle.tsx
'use client';
import React from 'react';
import Image from 'next/image';

const styles = [
  { src: '/styleitems/style1.webp', name: '90s Minimalism' },
  { src: '/styleitems/style2.webp', name: 'Romantic Summer' },
  { src: '/styleitems/style3.webp', name: 'Gorpcore' },
  { src: '/styleitems/style4.webp', name: 'Loungewear' },
  { src: '/styleitems/style5.webp', name: 'Silver Glow' },
  { src: '/styleitems/style6.webp', name: 'Party Sequins' },
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
              href={`/womenwear`}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              {/* Image with Hover Effect */}
              <div className="relative w-full h-60">
                <Image
                  src={style.src}
                  alt={style.name}
                  placeholder="blur"
                  blurDataURL='/data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
                  fill
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

