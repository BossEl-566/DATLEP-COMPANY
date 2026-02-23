// app/shops/components/TopShopsCarousel.tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Shield, MapPin } from 'lucide-react';
import { Shop } from '../types';

interface TopShopsCarouselProps {
  shops: Shop[];
}

const TopShopsCarousel: React.FC<TopShopsCarouselProps> = ({ shops }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!shops.length) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Top Rated Shops</h2>
            <p className="text-purple-200 text-sm">Discover the best fashion sellers on DATLEP</p>
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
          {shops.map((shop) => {
            const shopLogo = shop.logo?.url || '/placeholder-shop.jpg';
            const rating = shop.rating || 0;

            return (
              <Link
                key={shop._id}
                href={`/shop/${shop.slug}`}
                className="flex-none w-72 group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={shopLogo}
                        alt={shop.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-200">
                        {shop.name}
                      </h3>
                      {shop.address && (
                        <p className="text-sm text-purple-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {shop.address.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-purple-200">•</span>
                    <span className="text-purple-200">{shop.totalReviews || 0} reviews</span>
                    {shop.isVerifiedShop && (
                      <>
                        <span className="text-purple-200">•</span>
                        <Shield className="w-4 h-4 text-green-400" />
                      </>
                    )}
                  </div>

                  <div className="mt-3 text-sm text-purple-200 line-clamp-2">
                    {shop.bio || 'Premium fashion shop on DATLEP'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopShopsCarousel;