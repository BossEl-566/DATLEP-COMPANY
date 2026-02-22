// app/products/components/TrendingSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Star, Eye } from 'lucide-react';
import { Product } from '../types';

interface TrendingSidebarProps {
  products: Product[];
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ products }) => {
  if (!products.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Trending Now</h3>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => {
          const productImage = product.image?.url || '/placeholder-image.jpg';
          const price = product.salePrice || product.regularPrice;

          return (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="flex gap-3 group"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={productImage}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
                />
                <div className="absolute top-1 left-1 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-bold text-gray-900">GH₵{price.toFixed(2)}</span>
                  {product.ratings && product.ratings.count > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{product.ratings.average.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>{product.views?.toLocaleString()} views</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/products?sortBy=trending"
        className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4 pt-4 border-t border-gray-100"
      >
        View All Trending
      </Link>
    </div>
  );
};

export default TrendingSidebar;