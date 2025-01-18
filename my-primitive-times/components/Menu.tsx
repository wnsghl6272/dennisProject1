// components/Menu.tsx
'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const Menu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <ul className="flex space-x-4">
        <li>
          <Link href="/menswear" className="text-gray-700 hover:text-gray-900">
            {t('menwear')}
          </Link>
        </li>
        <li>
          <Link href="/womenwear" className="text-gray-700 hover:text-gray-900">
            {t('womenwear')}
          </Link>
        </li>
        <li>
          <Link href="/salewear" className="text-red-600 font-bold hover:text-red-800">
            {t('sale')}
          </Link>
        </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
