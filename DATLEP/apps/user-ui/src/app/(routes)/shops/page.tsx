// app/shops/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';

// Components
import ShopFilters from './components/ShopFilters';
import ShopGrid from './components/ShopGrid';
import ShopSort from './components/ShopSort';
import MobileFilterDrawer from './components/MobileFilterDrawer';
import ActiveFilters from './components/ActiveFilters';
import CategoryBreadcrumb from './components/CategoryBreadcrumb';
import TopShopsCarousel from './components/TopShopsCarousel';
import FeaturedShopsSidebar from './components/FeaturedShopsSidebar';
import Pagination from './components/Pagination';
import ShopsSkeleton from './components/ShopsSkeleton';
import SearchBar from './components/SearchBar';

// Types
import { Shop, ShopFilter, SortOption } from './types';

/** ---------------- API response shapes (raw/flexible) ---------------- */

interface ShopsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

interface FacetValueItem {
  value: string;
  count: number;
}

interface FacetNameItem {
  name: string;
  count: number;
}

type RawFacetArray = string[] | FacetValueItem[] | FacetNameItem[];

interface RawShopFacets {
  categories?: RawFacetArray;
  shopTypes?: RawFacetArray;
  countries?: RawFacetArray;
  cities?: RawFacetArray;
  specialties?: RawFacetArray;
  yearsInBusiness?: RawFacetArray;
  [key: string]: unknown;
}

interface FilteredShopsResponse {
  data?: Shop[];
  pagination?: Partial<ShopsPagination>;
  facets?: RawShopFacets;
}

interface ShopListResponse {
  data?: Shop[];
}

/** ---------------- UI facets shape (normalized) ---------------- */

interface ShopFacets {
  categories: Array<{ value: string; count: number }>;
  shopTypes: Array<{ value: string; count: number }>;
  countries: Array<{ value: string; count: number }>;
  cities: Array<{ value: string; count: number }>;
  specialties?: Array<{ value: string; count: number }>;
  yearsInBusiness?: Array<{ value: string; count: number }>;
  [key: string]: unknown;
}

/** ---------------- Helpers ---------------- */

const normalizeFacetArray = (input?: RawFacetArray): Array<{ value: string; count: number }> => {
  if (!input || !Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (typeof item === 'string') return { value: item, count: 0 };
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

const ShopsPage = () => {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<ShopFilter>({
    page: 1,
    limit: 24,
    sortBy: 'top-rated',
    q: searchParams.get('q') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    country: searchParams.get('country') || undefined,
    city: searchParams.get('city') || undefined,
    isVerifiedShop: true,
    isOpen: true,
    minRating: 0,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      q: searchParams.get('q') || '',
      categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
      country: searchParams.get('country') || undefined,
      city: searchParams.get('city') || undefined,
      page: 1,
    }));
  }, [searchParams]);

  // Fetch filtered shops
  const {
    data: shopsData,
    isLoading,
    error,
    refetch,
  } = useQuery<FilteredShopsResponse, Error>({
    queryKey: ['shops', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Required/base params
      params.set('page', String(filters.page ?? 1));
      params.set('limit', String(filters.limit ?? 24));
      if (filters.sortBy) params.set('sortBy', String(filters.sortBy));

      // Optional strings
      if (filters.q?.trim()) params.set('q', filters.q.trim());
      if (filters.country) params.set('country', filters.country);
      if (filters.city) params.set('city', filters.city);

      // Optional arrays
      if (filters.categories?.length) params.set('categories', filters.categories.join(','));
      if (filters.shopType?.length) params.set('shopType', filters.shopType.join(','));
      if (filters.specialties?.length) params.set('specialties', filters.specialties.join(','));
      if (filters.yearsInBusiness?.length) {
        params.set('yearsInBusiness', filters.yearsInBusiness.join(','));
      }

      // Optional booleans
      if (typeof filters.isVerifiedShop === 'boolean') {
        params.set('isVerifiedShop', String(filters.isVerifiedShop));
      }
      if (typeof filters.isFeatured === 'boolean') {
        params.set('isFeatured', String(filters.isFeatured));
      }
      if (typeof filters.isOpen === 'boolean') {
        params.set('isOpen', String(filters.isOpen));
      }

      // Optional numbers (only include if > 0)
      if (typeof filters.minRating === 'number' && filters.minRating > 0) {
        params.set('minRating', String(filters.minRating));
      }
      if (typeof filters.minReviews === 'number' && filters.minReviews > 0) {
        params.set('minReviews', String(filters.minReviews));
      }

      const response = await axiosInstance.get<FilteredShopsResponse>(
        `/product/api/get-filtered-shops?${params.toString()}`
      );

      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // ✅ TanStack Query v5
    retry: 2,
  });

  // Fetch top shops for carousel
  const { data: topShopsData } = useQuery<ShopListResponse, Error>({
    queryKey: ['top-shops'],
    queryFn: async () => {
      const response = await axiosInstance.get<ShopListResponse>(
        '/product/api/top-shops?limit=10&sortBy=top-rated'
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch featured shops for sidebar
  const { data: featuredShopsData } = useQuery<ShopListResponse, Error>({
    queryKey: ['featured-shops'],
    queryFn: async () => {
      const response = await axiosInstance.get<ShopListResponse>(
        '/product/api/top-shops?limit=5&featuredOnly=true&sortBy=featured'
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = (newFilters: Partial<ShopFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, q: query, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 24,
      sortBy: 'top-rated',
      q: '',
      categories: [],
      shopType: [],
      specialties: [],
      yearsInBusiness: [],
      country: undefined,
      city: undefined,
      isVerifiedShop: true,
      isOpen: true,
      minRating: 0,
      minReviews: 0,
    });
  };

  /** ---------------- Normalized UI-ready data ---------------- */

  const shops: Shop[] = shopsData?.data ?? [];

  const pagination: ShopsPagination = {
    page: shopsData?.pagination?.page ?? 1,
    limit: shopsData?.pagination?.limit ?? 24,
    total: shopsData?.pagination?.total ?? 0,
    totalPages: shopsData?.pagination?.totalPages ?? 1,
    hasNextPage:
      shopsData?.pagination?.hasNextPage ??
      (shopsData?.pagination?.page ?? 1) < (shopsData?.pagination?.totalPages ?? 1),
    hasPrevPage:
      shopsData?.pagination?.hasPrevPage ?? (shopsData?.pagination?.page ?? 1) > 1,
  };

  const facets: ShopFacets = {
    categories: normalizeFacetArray(shopsData?.facets?.categories),
    shopTypes: normalizeFacetArray(shopsData?.facets?.shopTypes),
    countries: normalizeFacetArray(shopsData?.facets?.countries),
    cities: normalizeFacetArray(shopsData?.facets?.cities),
    specialties: normalizeFacetArray(shopsData?.facets?.specialties),
    yearsInBusiness: normalizeFacetArray(shopsData?.facets?.yearsInBusiness),
  };

  const topShops: Shop[] = topShopsData?.data ?? [];
  const featuredShops: Shop[] = featuredShopsData?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Shops Carousel */}
      {topShops.length > 0 && <TopShopsCarousel shops={topShops} />}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <CategoryBreadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shops', href: '/shops' },
            ...(filters.categories?.[0] ? [{ label: filters.categories[0], href: '#' }] : []),
          ]}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            initialQuery={filters.q || ''}
            onSearch={handleSearch}
            placeholder="Search for shops, brands, or sellers..."
          />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 flex items-center justify-between"
          >
            <span className="font-medium">Filter Shops</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters - Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4">
              <ShopFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                facets={facets as any}
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
                  {filters.q ? `Shops matching "${filters.q}"` : 'Fashion Shops'}
                </h1>
                <p className="text-sm text-gray-500">{pagination.total} shops found</p>
              </div>

              <ShopSort
                currentSort={(filters.sortBy ?? 'top-rated') as SortOption}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              facets={facets as any}
            />

            {/* Shops Grid */}
            {isLoading ? (
              <ShopsSkeleton count={filters.limit ?? 24} />
            ) : error ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-red-500 mb-4">Error loading shops</p>
                <button
                  onClick={() => refetch()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Try Again
                </button>
              </div>
            ) : shops.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops found</h3>
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
                <ShopGrid shops={shops} />

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

          {/* Featured Shops Sidebar - Desktop */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <FeaturedShopsSidebar shops={featuredShops} />
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
        facets={facets as any}
        onClear={clearFilters}
      />
    </div>
  );
};

export default ShopsPage;