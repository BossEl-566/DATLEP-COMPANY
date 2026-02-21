// app/product/[slug]/components/SellerInfo.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, MapPin, Clock, Shield, Star, Check, MessageCircle } from 'lucide-react';

interface SellerInfoProps {
  shop: any;
  seller: any;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ shop, seller }) => {
  if (!shop) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h2>
      
      <div className="flex items-start gap-4">
        {/* Shop Logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            {shop.logo ? (
              <Image
                src={shop.logo}
                alt={shop.name}
                width={64}
                height={64}
                className="rounded-xl object-cover"
              />
            ) : (
              <Store className="w-8 h-8 text-purple-600" />
            )}
          </div>
          {shop.isVerifiedShop && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Shop Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/shop/${shop.slug}`}
              className="text-lg font-semibold text-gray-900 hover:text-purple-600"
            >
              {shop.name}
            </Link>
            {shop.isFeatured && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                FEATURED
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{shop.address?.city || 'Ghana'}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Joined {new Date(shop.createdAt).getFullYear()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{shop.rating?.toFixed(1) || 'New'}</span>
              <span className="text-gray-500">({shop.totalReviews || 0})</span>
            </div>
          </div>

          {/* Shop Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="text-sm text-gray-500">Products</div>
              <div className="font-semibold text-gray-900">{shop.products?.length || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Orders</div>
              <div className="font-semibold text-gray-900">{shop.completedOrders || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Response</div>
              <div className="font-semibold text-gray-900">{shop.responseTime || 24}h</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/shop/${shop.slug}`}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center"
            >
              Visit Shop
            </Link>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-purple-600 hover:text-purple-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;