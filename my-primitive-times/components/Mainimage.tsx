// components/MainImage.tsx
import React from 'react';
import Link from 'next/link';

const MainImage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-[500px]">
      {/* Menswear */}
      <div className="relative w-full md:w-1/2 h-full">
        <Link href="/menswear" passHref>
          <div className="relative w-full h-full cursor-pointer">
            <img
              src="main2.jpg" // Path for Menswear image
              alt="Menswear"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <h2 className="text-white text-3xl md:text-5xl font-bold text-shadow-lg font-[GT America Expanded], Arial Black, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif mx-4 my-0 break-words">
                  Menswear
                </h2>
                <div className="inline-flex items-center justify-center px-4 py-2 border-2 border-white text-black bg-white rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out mt-4">
                  Shop Now
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Womenswear */}
      <div className="relative w-full md:w-1/2 h-full">
        <Link href="/womenswear" passHref>
          <div className="relative w-full h-full cursor-pointer">
            <img
              src="main1.jpg" // Path for Womenswear image
              alt="Womenswear"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <h2 className="text-white text-3xl md:text-5xl font-bold text-shadow-lg font-[GT America Expanded], Arial Black, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif mx-4 my-0 break-words">
                  Womenswear
                </h2>
                <div className="inline-flex items-center justify-center px-4 py-2 border-2 border-white text-black bg-white rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out mt-4">
                  Shop Now
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainImage;
