// components/MainImage.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const MainImage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row w-full h-[500px]">
      {/* Menswear */}
      <div className="relative w-full md:w-1/2 h-full">
        <Link href="/menswear" passHref>
          <div className="relative w-full h-full cursor-pointer">
            <Image
              src="/main2.webp"
              alt={t('menwear')}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL='/data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
              fill
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <h2 className="text-white text-3xl md:text-5xl font-bold text-shadow-lg font-[GT America Expanded], Arial Black, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif mx-4 my-0 break-words">
                  {t('menwear')}
                </h2>
                <div className="inline-flex items-center justify-center px-4 py-2 border-2 border-white text-black bg-white rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out mt-4">
                  {t('shop_now')}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Womenswear */}
      <div className="relative w-full md:w-1/2 h-full">
        <Link href="/womenwear" passHref>
          <div className="relative w-full h-full cursor-pointer">
            <Image
              src="/main1.webp"
              alt={t('womenwear')}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL='/data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
              fill
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <h2 className="text-white text-3xl md:text-5xl font-bold text-shadow-lg font-[GT America Expanded], Arial Black, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif mx-4 my-0 break-words">
                  {t('womenwear')}
                </h2>
                <div className="inline-flex items-center justify-center px-4 py-2 border-2 border-white text-black bg-white rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out mt-4">
                  {t('shop_now')}
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
