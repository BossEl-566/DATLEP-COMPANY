// app/products/components/ProductsSkeleton.tsx
'use client';

import React from 'react';

interface ProductsSkeletonProps {
  count?: number;
}

const ProductsSkeleton: React.FC<ProductsSkeletonProps> = ({ count = 24 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Shop Name */}
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            
            {/* Title - Two lines */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-8" />
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            
            {/* Add to Cart Button */}
            <div className="h-10 bg-gray-200 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsSkeleton;