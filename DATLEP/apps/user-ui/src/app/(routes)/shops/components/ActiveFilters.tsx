// app/shops/components/ActiveFilters.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { ShopFilter } from '../types';

interface ActiveFiltersProps {
  filters: ShopFilter;
  onFilterChange: (filters: Partial<ShopFilter>) => void;
  facets: {
    categories: Array<{ value: string; count: number }>;
    shopTypes: Array<{ value: string; count: number }>;
  };
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
  facets,
}) => {
  const shopTypeLabels: Record<string, string> = {
    retail: 'Retail',
    wholesale: 'Wholesale',
    both: 'Retail & Wholesale',
  };

  const yearsLabels: Record<string, string> = {
    '<1': '< 1 year',
    '1-3': '1-3 years',
    '3-5': '3-5 years',
    '5-10': '5-10 years',
    '10+': '10+ years',
  };

  const removeCategory = (category: string) => {
    onFilterChange({
      categories: filters.categories?.filter(c => c !== category),
    });
  };

  const removeShopType = (type: string) => {
    onFilterChange({
      shopType: filters.shopType?.filter(t => t !== type),
    });
  };

  const removeYears = (year: string) => {
    onFilterChange({
      yearsInBusiness: filters.yearsInBusiness?.filter(y => y !== year),
    });
  };

  const removeCountry = () => {
    onFilterChange({ country: undefined, city: undefined });
  };

  const removeCity = () => {
    onFilterChange({ city: undefined });
  };

  const removeRating = () => {
    onFilterChange({ minRating: undefined });
  };

  const removeVerification = () => {
    onFilterChange({ isVerifiedShop: undefined });
  };

  const removeFeatured = () => {
    onFilterChange({ isFeatured: undefined });
  };

  const removeOpenNow = () => {
    onFilterChange({ isOpen: undefined });
  };

  const activeFilters = [
    ...(filters.q ? [{
      type: 'search',
      value: 'search',
      label: `Search: "${filters.q}"`,
      onRemove: () => onFilterChange({ q: '' }),
    }] : []),
    ...(filters.categories?.map(cat => ({
      type: 'category',
      value: cat,
      label: cat,
      onRemove: () => removeCategory(cat),
    })) || []),
    ...(filters.shopType?.map(type => ({
      type: 'shopType',
      value: type,
      label: shopTypeLabels[type] || type,
      onRemove: () => removeShopType(type),
    })) || []),
    ...(filters.yearsInBusiness?.map(year => ({
      type: 'years',
      value: year,
      label: yearsLabels[year] || year,
      onRemove: () => removeYears(year),
    })) || []),
    ...(filters.country ? [{
      type: 'country',
      value: filters.country,
      label: `Country: ${filters.country}`,
      onRemove: removeCountry,
    }] : []),
    ...(filters.city ? [{
      type: 'city',
      value: filters.city,
      label: `City: ${filters.city}`,
      onRemove: removeCity,
    }] : []),
    ...(filters.minRating ? [{
      type: 'rating',
      value: filters.minRating,
      label: `${filters.minRating}+ Stars`,
      onRemove: removeRating,
    }] : []),
    ...(filters.isVerifiedShop ? [{
      type: 'verified',
      value: 'verified',
      label: 'Verified Only',
      onRemove: removeVerification,
    }] : []),
    ...(filters.isFeatured ? [{
      type: 'featured',
      value: 'featured',
      label: 'Featured Only',
      onRemove: removeFeatured,
    }] : []),
    ...(filters.isOpen ? [{
      type: 'open',
      value: 'open',
      label: 'Open Now',
      onRemove: removeOpenNow,
    }] : []),
  ];

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <span
            key={`${filter.type}-${filter.value}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
          >
            {filter.label}
            <button
              onClick={filter.onRemove}
              className="hover:text-purple-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;