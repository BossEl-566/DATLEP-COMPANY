'use client';

import React from 'react';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import { Suspense } from 'react';

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Suggested Products - Popular */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Popular This Week"
            type="popular"
            limit={8}
          />
        </Suspense>

        {/* Featured Products */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Featured Collections"
            type="featured"
            limit={8}
          />
        </Suspense>

        {/* Top Rated */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Top Rated"
            type="top-rated"
            limit={8}
          />
        </Suspense>
      </main>
    </div>
  );
}

function ProductGridSkeleton() {
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