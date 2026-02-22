// app/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';

// Components
import ProductFilters from './components/ProductFilters';
import ProductGrid from './components/ProductGrid';
import ProductSort from './components/ProductSort';
import MobileFilterDrawer from './components/MobileFilterDrawer';
import ActiveFilters from './components/ActiveFilters';
import CategoryBreadcrumb from './components/CategoryBreadcrumb';
import FeaturedProductsCarousel from './components/FeaturedProductsCarousel';
import TrendingSidebar from './components/TrendingSidebar';
import Pagination from './components/Pagination';
import ProductsSkeleton from './components/ProductsSkeleton';

// Types
import {
  Product,
  ProductFilter,
  SortOption,
  Facets,
  Pagination as PaginationType,
} from './types';

/** ---------------- API response shapes (raw / flexible) ---------------- */

interface ApiFacetItemName {
  name: string;
  count: number;
}

interface ApiFacetItemValue {
  value: string;
  count: number;
}

interface RawProductFacets {
  categories?: string[] | ApiFacetItemName[] | ApiFacetItemValue[];
  brands?: string[] | ApiFacetItemName[] | ApiFacetItemValue[];
  [key: string]: unknown;
}

interface FilteredProductsResponse {
  data?: Product[];
  pagination?: Partial<PaginationType>;
  facets?: RawProductFacets;
}

interface ProductListResponse {
  data?: Product[];
}

/** ---------------- Helpers ---------------- */

const normalizeFacetArray = (
  input?: string[] | ApiFacetItemName[] | ApiFacetItemValue[]
): Array<{ value: string; count: number }> => {
  if (!input || !Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (typeof item === 'string') {
        return { value: item, count: 0 };
      }

      if ('value' in item && typeof item.value === 'string') {
        return { value: item.value, count: Number(item.count ?? 0) };
      }

      if ('name' in item && typeof item.name === 'string') {
        return { value: item.name, count: Number(item.count ?? 0) };
      }

      return null;
    })
    .filter((item): item is { value: string; count: number } => item !== null);
};

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    limit: 24,
    sortBy: 'popular',
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    q: searchParams.get('q') || '',
    minPrice: 0,
    maxPrice: 10000,
    inStock: true,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
      q: searchParams.get('q') || '',
      page: 1,
    }));
  }, [searchParams]);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery<FilteredProductsResponse, Error>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set('page', String(filters.page ?? 1));
      params.set('limit', String(filters.limit ?? 24));

      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.q?.trim()) params.set('q', filters.q.trim());

      if (filters.categories?.length) {
        params.set('categories', filters.categories.join(','));
      }
      if (filters.brands?.length) {
        params.set('brands', filters.brands.join(','));
      }
      if (filters.colors?.length) {
        params.set('colors', filters.colors.join(','));
      }
      if (filters.sizes?.length) {
        params.set('sizes', filters.sizes.join(','));
      }
      if (filters.tags?.length) {
        params.set('tags', filters.tags.join(','));
      }

      if (typeof filters.minPrice === 'number') {
        params.set('minPrice', String(filters.minPrice));
      }
      if (typeof filters.maxPrice === 'number') {
        params.set('maxPrice', String(filters.maxPrice));
      }
      if (typeof filters.inStock === 'boolean') {
        params.set('inStock', String(filters.inStock));
      }
      if (typeof filters.cashOnDelivery === 'boolean') {
        params.set('cashOnDelivery', String(filters.cashOnDelivery));
      }
      if (typeof filters.minRating === 'number') {
        params.set('minRating', String(filters.minRating));
      }
      if (typeof filters.minDiscount === 'number') {
        params.set('minDiscount', String(filters.minDiscount));
      }

      if (filters.shopId) {
        params.set('shopId', filters.shopId);
      }
      if (filters.sellerId) {
        params.set('sellerId', filters.sellerId);
      }

      const response = await axiosInstance.get<FilteredProductsResponse>(
        `/product/api/get-filtered-products?${params.toString()}`
      );

      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // TanStack Query v5 (cacheTime -> gcTime)
    retry: 2,
  });

  // Fetch featured products for carousel
  const { data: featuredData } = useQuery<ProductListResponse, Error>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await axiosInstance.get<ProductListResponse>(
        '/product/api/featured-products?limit=10'
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch trending products for sidebar
  const { data: trendingData } = useQuery<ProductListResponse, Error>({
    queryKey: ['trending-products'],
    queryFn: async () => {
      const response = await axiosInstance.get<ProductListResponse>(
        '/product/api/trending-products?limit=5'
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = (newFilters: Partial<ProductFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 24,
      sortBy: 'popular',
      categories: [],
      q: '',
      minPrice: 0,
      maxPrice: 10000,
      inStock: true,
    });
  };

  /** ---------------- Normalized UI-ready data ---------------- */

  const products: Product[] = productsData?.data ?? [];

  const pagination: PaginationType = {
    page: productsData?.pagination?.page ?? 1,
    limit: productsData?.pagination?.limit ?? 24,
    total: productsData?.pagination?.total ?? 0,
    totalPages: productsData?.pagination?.totalPages ?? 1,
    hasNextPage:
      productsData?.pagination?.hasNextPage ??
      (productsData?.pagination?.page ?? 1) < (productsData?.pagination?.totalPages ?? 1),
    hasPrevPage:
      productsData?.pagination?.hasPrevPage ??
      (productsData?.pagination?.page ?? 1) > 1,
  };

  const facets: Facets = {
    categories: normalizeFacetArray(productsData?.facets?.categories),
    brands: normalizeFacetArray(productsData?.facets?.brands),
  };

  const featuredProducts: Product[] = featuredData?.data ?? [];
  const trendingProducts: Product[] = trendingData?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <FeaturedProductsCarousel products={featuredProducts} />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <CategoryBreadcrumb category={filters.categories?.[0]} />

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 flex items-center justify-between"
          >
            <span className="font-medium">Filters</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters - Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                facets={facets}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with Results Count and Sort */}
            <div className="bg-white rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {filters.q ? `Search results for "${filters.q}"` : 'All Products'}
                </h1>
                <p className="text-sm text-gray-500">{pagination.total} products found</p>
              </div>

              <ProductSort
                currentSort={(filters.sortBy ?? 'popular') as SortOption}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              facets={facets}
            />

            {/* Products Grid */}
            {isLoading ? (
              <ProductsSkeleton count={filters.limit ?? 24} />
            ) : error ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-red-500 mb-4">Error loading products</p>
                <button
                  onClick={() => refetch()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>

          {/* Trending Sidebar - Desktop */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <TrendingSidebar products={trendingProducts} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        facets={facets}
        onClear={clearFilters}
      />
    </div>
  );
};

export default ProductsPage;