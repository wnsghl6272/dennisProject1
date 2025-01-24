'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'; // Import useRouter

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter(); // Initialize useRouter
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const toggleLocationDropdown = () => setLocationDropdown(!locationDropdown);
  const toggleLanguageDropdown = () => setLanguageDropdown(!languageDropdown);

  const handleClickOutside = (event: MouseEvent) => {
    if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
      setLocationDropdown(false);
    }
    if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
      setLanguageDropdown(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageDropdown(false);
    router.push('/'); // Redirect to home page
  };

  if (!isMounted) {
    return null;
  }

  return (
    <footer className="bg-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Dropdown Menus */}
        <div className="flex space-x-4">
          {/* Location Dropdown */}
          <div className="relative" ref={locationRef}>
            <button
              onClick={toggleLocationDropdown}
              className="px-4 py-2 bg-gray-300 text-black rounded flex items-center focus:outline-none"
            >
              Australia
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {locationDropdown && (
              <ul className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                <li><a href="#australia" className="block px-4 py-2 hover:bg-gray-100">Australia</a></li>
                <li><a href="#korea" className="block px-4 py-2 hover:bg-gray-100">Korea</a></li>
                <li><a href="#china" className="block px-4 py-2 hover:bg-gray-100">China</a></li>
              </ul>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative" ref={languageRef}>
            <button
              onClick={toggleLanguageDropdown}
              className="px-4 py-2 bg-gray-300 text-black rounded flex items-center focus:outline-none"
            >
              {i18n.language === 'en' ? 'English' : i18n.language === 'ko' ? '한국어' : '中文'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {languageDropdown && (
              <ul className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                <li>
                  <button onClick={() => handleLanguageChange('en')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    English
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLanguageChange('cn')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Chinese
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLanguageChange('ko')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    한국어
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Menu on the Right Side */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#sitemaps" className="hover:underline">Sitemaps</a>
          <a href="#terms" className="hover:underline">Terms and Conditions</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <a href="#cookies" className="hover:underline">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
