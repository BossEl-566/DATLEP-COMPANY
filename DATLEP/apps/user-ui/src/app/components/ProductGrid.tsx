'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Product } from './types';
import { TrendingUp, Sparkles, Star } from 'lucide-react';
import api from '../lib/axios';

interface ProductGridProps {
  title: string;
  type: 'popular' | 'featured' | 'top-rated' | 'top10';
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, type, limit = 8 }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', type, limit],
    queryFn: async () => {
      const response = await api.get('/product/api/get-all-products', {
  params: {
    type,
    limit,
    page: 1
  }
});
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const getIcon = () => {
    switch (type) {
      case 'popular':
        return <TrendingUp className="w-5 h-5" />;
      case 'featured':
        return <Sparkles className="w-5 h-5" />;
      case 'top-rated':
        return <Star className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'popular':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'featured':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'top-rated':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600">Unable to load products. Please try again.</p>
        </div>
      </div>
    );
  }

  const products = data?.data || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor()}`}>
            {type === 'popular' ? 'Trending' : 
             type === 'featured' ? 'Editor\'s Pick' : 
             type === 'top-rated' ? 'Highly Rated' : 'Best Sellers'}
          </span>
        </div>
        
        {data?.pagination && data.pagination.totalPages > 1 && (
          <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
            View All →
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination for non-top10 */}
      {type !== 'top10' && data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;