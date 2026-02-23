// app/components/ShopGrid.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Store, Star, MapPin, Shield } from 'lucide-react';
import api from '../lib/axios';

interface ShopGridProps {
  title: string;
  type: 'top-rated' | 'featured' | 'most-reviewed';
  limit?: number;
  viewAllLink?: string;
}

const ShopGrid: React.FC<ShopGridProps> = ({ title, type, limit = 4, viewAllLink }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['top-shops', type, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        sortBy: type === 'top-rated' ? 'top-rated' : type === 'featured' ? 'featured' : 'most-reviewed',
      });
      const response = await api.get(`/product/api/top-shops?${params.toString()}`);
      return response.data;
    },
  });

  const shops = data?.data || [];

  if (isLoading || shops.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm font-medium text-purple-600 hover:text-purple-800">
            View All →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shops.map((shop: any) => (
          <Link
            key={shop._id}
            href={`/shop/${shop.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Cover Image */}
            <div className="relative h-24 bg-gradient-to-r from-purple-500 to-pink-500">
              {shop.coverImage && (
                <Image
                  src={shop.coverImage.url}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Shop Info */}
            <div className="px-4 pb-4">
              {/* Logo */}
              <div className="flex items-end -mt-8 mb-3">
                <div className="relative w-16 h-16 rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
                  <Image
                    src={shop.logo?.url || '/placeholder-shop.jpg'}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600">
                    {shop.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Store className="w-3 h-3" />
                    <span className="capitalize">{shop.category || 'Fashion Shop'}</span>
                  </div>
                </div>
              </div>

              {/* Location & Rating */}
              <div className="flex items-center justify-between mb-3">
                {shop.address && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{shop.address.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{shop.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-gray-500">({shop.totalReviews || 0})</span>
                </div>
              </div>

              {/* Verification Badge */}
              {shop.isVerifiedShop && (
                <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                  <Shield className="w-3 h-3" />
                  <span>Verified Shop</span>
                </div>
              )}

              {/* Product Previews */}
              <div className="grid grid-cols-3 gap-1 mb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded"></div>
                ))}
              </div>

              {/* Follow Button */}
              <button className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition-colors">
                Follow Shop
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopGrid;