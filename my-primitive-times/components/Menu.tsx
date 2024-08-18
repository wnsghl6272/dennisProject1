// components/Menu.tsx
import React from 'react';

const Menu: React.FC = () => {
  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-gray-700 hover:text-gray-900">Menwear</a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-gray-900">Womenwear</a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-gray-900">Brands</a>
          </li>
          <li>
            <a href="#" className="text-red-600 font-bold hover:text-red-800">Sale</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
