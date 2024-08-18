import React from 'react';

const images = [
  { src: '/images/item1.jpg', alt: 'Item 1' },
  { src: '/images/item2.jpg', alt: 'Item 2' },
  { src: '/images/item3.jpg', alt: 'Item 3' },
  { src: '/images/item4.jpg', alt: 'Item 4' },
  { src: '/images/item5.jpg', alt: 'Item 5' },
  { src: '/images/item6.jpg', alt: 'Item 6' },
  { src: '/images/large-item.jpg', alt: 'Large Item' } // Large image
];

const TheDepopEdit: React.FC = () => {
  return (
    <section className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title and Description */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">The Depop Edit</h2>
            <p className="text-base sm:text-lg text-gray-600">Items we love, updated daily</p>
          </div>
          <a
            href="#see-more"
            className="mt-4 sm:mt-0 text-gray-600 underline"
          >
            See more
          </a>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mobile: Large Image */}
          <div className="md:hidden col-span-1 relative h-[200px]">
            <img
              src={images[6].src} // Large image
              alt={images[6].alt}
              className="w-full h-full object-cover"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Mobile: 2x3 Image Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 col-span-1">
            {images.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative h-[200px]" // Adjust height as needed
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Desktop: Left Side: 2x3 Images */}
          <div className="hidden md:grid md:col-span-2 grid-cols-3 gap-4">
            {images.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative h-[200px]" // Adjust height as needed
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Desktop: Right Side: Large Image */}
          <div className="hidden md:block md:col-span-1 relative">
            <img
              src={images[6].src} // Large image
              alt={images[6].alt}
              className="w-full h-full object-cover"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheDepopEdit;
