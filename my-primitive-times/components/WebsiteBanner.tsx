// components/WebsiteBanner.tsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const slides = [
  { src: '/websitebanner.webp', alt: 'Slide 1' },

];

const WebsiteBanner: React.FC = () => {
  return (
    <section className="relative w-full h-48 md:h-64 overflow-hidden"> {/* Reduced height */}
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Half: Text Section */}
        <div className="flex-1 md:flex-none md:w-1/3 bg-gray-800 text-white flex flex-col justify-center items-start p-4 md:p-8"> {/* 30% width */}
          <h2 className="text-l md:text-l font-bold mb-4">Get more style for less this Cyber Week</h2>
          <a
            href="/salewear"
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-white text-black font-bold rounded hover:bg-gray-200"
          >
            Shop Now
          </a>
        </div>

        {/* Right Half: Single Image */}
        <div className="relative flex-1 md:flex-none md:w-2/3 w-full h-full overflow-hidden"> {/* 70% width */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[0].src})` }} // Display the single image
          />
        </div>
      </div>
    </section>
  );
};

export default WebsiteBanner;
