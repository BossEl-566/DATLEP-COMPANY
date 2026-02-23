// app/components/ProductGrid.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Product } from './types';
import { TrendingUp, Sparkles, Star, Clock, Award } from 'lucide-react';
import api from '../lib/axios';

interface ProductGridProps {
  title: string;
  type: 'popular' | 'featured' | 'top-rated' | 'new-arrivals' | 'top10';
  limit?: number;
  viewAllLink?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title, 
  type, 
  limit = 8, 
  viewAllLink 
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', type, limit],
    queryFn: async () => {
      let endpoint = '';
      let params: any = { limit, page: 1 };

      switch (type) {
        case 'featured':
          endpoint = '/product/api/featured-products';
          break;
        case 'popular':
        case 'top-rated':
          endpoint = '/product/api/trending-products';
          params.sortBy = type === 'top-rated' ? 'rating' : 'views';
          break;
        case 'new-arrivals':
          endpoint = '/product/api/new-arrivals';
          break;
        case 'top10':
          endpoint = '/product/api/get-filtered-products';
          params.sortBy = 'best-selling';
          params.limit = 10;
          break;
        default:
          endpoint = '/product/api/get-filtered-products';
      }

      const response = await api.get(endpoint, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const getIcon = () => {
    switch (type) {
      case 'popular':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'featured':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'top-rated':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'new-arrivals':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'top10':
        return <Award className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getBadge = () => {
    switch (type) {
      case 'popular':
        return { text: 'Trending', color: 'bg-orange-100 text-orange-700' };
      case 'featured':
        return { text: "Editor's Pick", color: 'bg-purple-100 text-purple-700' };
      case 'top-rated':
        return { text: 'Highly Rated', color: 'bg-yellow-100 text-yellow-700' };
      case 'new-arrivals':
        return { text: 'Just In', color: 'bg-blue-100 text-blue-700' };
      case 'top10':
        return { text: 'Best Sellers', color: 'bg-red-100 text-red-700' };
      default:
        return null;
    }
  };

  const badge = getBadge();
  const products = data?.data || [];

  if (isLoading) return null;
  if (error || products.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            View All
            <span className="text-lg">→</span>
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.slice(0, limit).map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;