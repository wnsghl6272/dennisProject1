// components/SlidingBanner.tsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const slides = [
  { src: '/banner/banner1.jpg', alt: 'Slide 1' },
  { src: '/banner/banner2.jpg', alt: 'Slide 2' },
  { src: '/banner/banner3.jpg', alt: 'Slide 3' },
  // Add more slides as needed
];

const SlidingBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-64 md:h-96 overflow-hidden">
      {/* Mobile & Desktop View */}
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Half: Grey Background with Text and Button */}
        <div className="flex-1 bg-gray-800 text-white flex flex-col justify-center p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Heading Here</h2>
          <p className="text-base md:text-lg mb-6">Some description text about the banner.</p>
          <a
            href="#your-link"
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-white text-black font-bold rounded hover:bg-gray-200"
          >
            Your Button
          </a>
        </div>

        {/* Right Half: Sliding Images */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.src})` }}
              />
            ))}
          </div>
          {/* Navigation Arrow for Desktop */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-800 hidden md:block"
            onClick={nextSlide}
          >
            <span className="text-xl">&rarr;</span> {/* Right arrow */}
          </button>
        </div>
      </div>

      {/* Navigation Arrow for Mobile */}
      <div className="absolute bottom-4 right-4 md:hidden">
        <button
          className="bg-black text-white p-2 rounded-full hover:bg-gray-800"
          onClick={nextSlide}
        >
          <span className="text-xl">&rarr;</span> {/* Right arrow */}
        </button>
      </div>
    </section>
  );
};

export default SlidingBanner;
