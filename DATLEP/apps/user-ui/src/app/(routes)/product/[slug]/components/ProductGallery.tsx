// app/product/[slug]/components/ProductGallery.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  selectedImage,
  onImageSelect
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    onImageSelect((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    onImageSelect((selectedImage - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
        <Image
          src={images[selectedImage] || '/placeholder-image.jpg'}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-purple-600 ring-2 ring-purple-200' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;