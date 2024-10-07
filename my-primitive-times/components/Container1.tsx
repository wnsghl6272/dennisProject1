// components/Container1.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const CallToAction: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-black">
        {t('buy_sell_circular')}
      </h1>
      <Link 
        href="/sell-now" 
        className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-extrabold text-lg rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out"
      >
        {t('sell_now')}
      </Link>
    </div>
  );
};

export default CallToAction;
