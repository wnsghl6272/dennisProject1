// components/VerticalMenu.tsx
'use client';
import React from 'react';

const socialIcons = [
  { src: '/images/twitter-icon.png', alt: 'Twitter', link: 'https://twitter.com' },
  { src: '/images/instagram-icon.png', alt: 'Instagram', link: 'https://instagram.com' },
  { src: '/images/tiktok-icon.png', alt: 'TikTok', link: 'https://tiktok.com' }
];

const VerticalMenu: React.FC = () => {
  return (
    <section className="bg-gray-100 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 flex">
        {/* Menu Items */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="font-bold text-lg">Depop</div>
          <ul className="space-y-6"> {/* Increased padding */}
            <li><a href="#about-us">About us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#news">News</a></li>
            <li><a href="#impact">Impact</a></li>
          </ul>
        </div>

        <div className="flex-1 flex flex-col space-y-6">
          <div className="font-bold text-lg">Sell</div>
          <ul className="space-y-6"> {/* Increased padding */}
            <li><a href="#sell-on-depop">Sell on Depop</a></li>
            <li><a href="#become-creator">Become a Depop Creator</a></li>
          </ul>
        </div>

        <div className="flex-1 flex flex-col space-y-6">
          <div className="font-bold text-lg">Help</div>
          <ul className="space-y-6"> {/* Increased padding */}
            <li><a href="#help-centre">Help Centre</a></li>
            <li><a href="#safety-centre">Safety Centre</a></li>
            <li><a href="#depop-status">Depop Status</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="absolute bottom-4 right-4 flex space-x-4">
          {socialIcons.map((icon) => (
            <a key={icon.alt} href={icon.link} target="_blank" rel="noopener noreferrer">
              <img src={icon.src} alt={icon.alt} className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalMenu;
