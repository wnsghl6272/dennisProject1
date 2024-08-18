// components/Container1.tsx
import React from 'react';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-black">
        Buy. Sell. Make fashion circular.
      </h1>
      <Link href="/sell-now" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-extrabold text-lg rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out">
        Sell Now
      </Link>
    </div>
  );
};

export default CallToAction;
