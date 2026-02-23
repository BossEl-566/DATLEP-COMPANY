// app/shops/components/ShopsSkeleton.tsx
'use client';

import React from 'react';

interface ShopsSkeletonProps {
  count?: number;
}

const ShopsSkeleton: React.FC<ShopsSkeletonProps> = ({ count = 24 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300" />
          
          {/* Content */}
          <div className="px-4 pb-4">
            {/* Logo and Name */}
            <div className="flex items-end -mt-8 mb-3">
              <div className="w-16 h-16 rounded-xl bg-gray-200 border-4 border-white" />
              <div className="ml-3 flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>

            {/* Location */}
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />

            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-100">
              <div className="text-center">
                <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopsSkeleton;