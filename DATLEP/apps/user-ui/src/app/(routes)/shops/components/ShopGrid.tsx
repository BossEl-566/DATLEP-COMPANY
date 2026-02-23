// app/shops/components/ShopGrid.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, MapPin, Star, Shield, Clock, Package, ThumbsUp } from 'lucide-react';
import { Shop } from '../types';

interface ShopGridProps {
  shops: Shop[];
}

const ShopGrid: React.FC<ShopGridProps> = ({ shops }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {shops.map((shop) => {
        const shopLogo = shop.logo?.url || '/placeholder-shop.jpg';
        const coverImage = shop.coverImage?.url || '/placeholder-cover.jpg';
        const rating = shop.rating || 0;
        const totalReviews = shop.totalReviews || 0;
        const totalProducts = shop.products?.length || 0;

        return (
          <Link
            key={shop._id}
            href={`/shop/${shop.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Cover Image */}
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
              <Image
                src={coverImage}
                alt={shop.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Verification Badge */}
              {shop.isVerifiedShop && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </div>
              )}

              {/* Featured Badge */}
              {shop.isFeatured && (
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="px-4 pb-4">
              {/* Logo and Name */}
              <div className="flex items-end -mt-8 mb-3">
                <div className="relative w-16 h-16 rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
                  <Image
                    src={shopLogo}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                    {shop.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Store className="w-3 h-3" />
                    <span className="capitalize">{shop.category || 'Fashion Shop'}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              {shop.address && (
                <div className="flex items-start gap-1 mb-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    {shop.address.city}, {shop.address.country}
                  </span>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {totalReviews.toLocaleString()} reviews
                </span>
                {shop.responseTime && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {shop.responseTime}h response
                    </span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{totalProducts}</div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{shop.completedOrders || 0}</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{shop.followers || 0}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
              </div>

              {/* Bio */}
              {shop.bio && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {shop.bio}
                </p>
              )}

              {/* Open Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-xs font-medium ${shop.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
                  Visit Shop →
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ShopGrid;