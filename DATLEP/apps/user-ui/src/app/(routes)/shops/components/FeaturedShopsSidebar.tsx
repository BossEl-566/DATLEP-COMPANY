// app/shops/components/FeaturedShopsSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Award } from 'lucide-react';
import { Shop } from '../types';

interface FeaturedShopsSidebarProps {
  shops: Shop[];
}

const FeaturedShopsSidebar: React.FC<FeaturedShopsSidebarProps> = ({ shops }) => {
  if (!shops.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Featured Shops</h3>
      </div>

      <div className="space-y-4">
        {shops.map((shop, index) => {
          const shopLogo = shop.logo?.url || '/placeholder-shop.jpg';
          const rating = shop.rating || 0;

          return (
            <Link
              key={shop._id}
              href={`/shop/${shop.slug}`}
              className="flex gap-3 group"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={shopLogo}
                  alt={shop.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    1
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">
                    {shop.name}
                  </h4>
                  {shop.isVerifiedShop && (
                    <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{shop.totalReviews || 0} reviews</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {shop.isFeatured && (
                    <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      Featured
                    </span>
                  )}
                  {shop.isOpen && (
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      Open Now
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/shops?isFeatured=true"
        className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4 pt-4 border-t border-gray-100"
      >
        View All Featured Shops
      </Link>
    </div>
  );
};

export default FeaturedShopsSidebar;