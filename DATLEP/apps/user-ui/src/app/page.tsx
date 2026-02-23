// app/page.tsx
'use client';

import React from 'react';
import HeroSection from './components/HeroSection';
import CategoryShowcase from './components/CategoryShowcase';
import ProductGrid from './components/ProductGrid';
import ShopGrid from './components/ShopGrid';
import DealsBanner from './components/DealsBanner';
import BrandShowcase from './components/BrandShowcase';
import NewsletterSection from './components/NewsletterSection';
import { Suspense } from 'react';

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Showcase - Like Amazon's department cards */}
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryShowcase />
        </Suspense>

        {/* Deals Banner - Flash Sales */}
        <Suspense fallback={<BannerSkeleton />}>
          <DealsBanner />
        </Suspense>

        {/* Featured Products - Editor's Picks */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Featured Collections"
            type="featured"
            limit={8}
            viewAllLink="/products?sortBy=featured"
          />
        </Suspense>

        {/* Top Rated Shops - Like Amazon's Top Brands */}
        <Suspense fallback={<ShopGridSkeleton />}>
          <ShopGrid 
            title="Top Rated Shops"
            type="top-rated"
            limit={4}
            viewAllLink="/shops?sortBy=top-rated"
          />
        </Suspense>

        {/* Popular Products - Trending Now */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Trending Now"
            type="popular"
            limit={8}
            viewAllLink="/products?sortBy=popular"
          />
        </Suspense>

        {/* Brand Showcase - Like Jumia's Brand Mall */}
        <Suspense fallback={<BrandSkeleton />}>
          <BrandShowcase />
        </Suspense>

        {/* New Arrivals */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="New Arrivals"
            type="new-arrivals"
            limit={8}
            viewAllLink="/products?sortBy=newest"
          />
        </Suspense>

        {/* Top 10 Best Sellers */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid 
            title="Best Sellers"
            type="top10"
            limit={10}
            viewAllLink="/products?sortBy=best-selling"
          />
        </Suspense>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
    </div>
  );
}

// Skeleton Loaders
function CategorySkeleton() {
  return (
    <div className="mb-12">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="mb-12 h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
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

function ShopGridSkeleton() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-32 bg-gray-200"></div>
            <div className="p-4">
              <div className="flex items-center -mt-12 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl border-4 border-white"></div>
                <div className="ml-3 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandSkeleton() {
  return (
    <div className="mb-12">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="w-full h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}