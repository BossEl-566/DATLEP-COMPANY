// app/products/components/FeaturedProductsCarousel.tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product } from '../types';

interface FeaturedProductsCarouselProps {
  products: Product[];
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products.length) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Featured Collections</h2>
            <p className="text-purple-200 text-sm">Curated picks just for you</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => {
            const productImage = product.image?.url || '/placeholder-image.jpg';
            const price = product.salePrice || product.regularPrice;

            return (
              <Link
                key={product._id}
                href={`/product/${product.slug}`}
                className="flex-none w-64 group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={productImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="256px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-medium text-white mb-1 line-clamp-2 group-hover:text-purple-200">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold">GH₵{price.toFixed(2)}</span>
                  {product.ratings && product.ratings.count > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">{product.ratings.average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;