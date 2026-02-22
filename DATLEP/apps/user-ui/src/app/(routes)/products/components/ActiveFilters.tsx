// app/products/components/ActiveFilters.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { ProductFilter } from '../types';

interface ActiveFiltersProps {
  filters: ProductFilter;
  onFilterChange: (filters: Partial<ProductFilter>) => void;
  facets: {
    categories: Array<{ value: string; count: number }>;
    brands: Array<{ value: string; count: number }>;
  };
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
  facets,
}) => {
  const removeCategory = (category: string) => {
    onFilterChange({
      categories: filters.categories?.filter(c => c !== category),
    });
  };

  const removeBrand = (brand: string) => {
    onFilterChange({
      brands: filters.brands?.filter(b => b !== brand),
    });
  };

  const removeSize = (size: string) => {
    onFilterChange({
      sizes: filters.sizes?.filter(s => s !== size),
    });
  };

  const removeColor = (color: string) => {
    onFilterChange({
      colors: filters.colors?.filter(c => c !== color),
    });
  };

  const removeRating = () => {
    onFilterChange({ minRating: undefined });
  };

  const removePrice = () => {
    onFilterChange({ minPrice: 0, maxPrice: 10000 });
  };

  const removeAvailability = () => {
    onFilterChange({ inStock: undefined });
  };

  const removeCOD = () => {
    onFilterChange({ cashOnDelivery: undefined });
  };

  const activeFilters = [
    ...(filters.categories?.map(cat => ({
      type: 'category',
      value: cat,
      label: cat,
      onRemove: () => removeCategory(cat),
    })) || []),
    ...(filters.brands?.map(brand => ({
      type: 'brand',
      value: brand,
      label: brand,
      onRemove: () => removeBrand(brand),
    })) || []),
    ...(filters.sizes?.map(size => ({
      type: 'size',
      value: size,
      label: `Size: ${size}`,
      onRemove: () => removeSize(size),
    })) || []),
    ...(filters.colors?.map(color => ({
      type: 'color',
      value: color,
      label: color,
      onRemove: () => removeColor(color),
    })) || []),
    ...(filters.minRating ? [{
      type: 'rating',
      value: filters.minRating,
      label: `${filters.minRating}+ Stars`,
      onRemove: removeRating,
    }] : []),
    ...(filters.minPrice && filters.minPrice > 0 ? [{
      type: 'price',
      value: 'min',
      label: `Min: GH₵${filters.minPrice}`,
      onRemove: removePrice,
    }] : []),
    ...(filters.maxPrice && filters.maxPrice < 10000 ? [{
      type: 'price',
      value: 'max',
      label: `Max: GH₵${filters.maxPrice}`,
      onRemove: removePrice,
    }] : []),
    ...(filters.inStock === true ? [{
      type: 'stock',
      value: 'inStock',
      label: 'In Stock',
      onRemove: removeAvailability,
    }] : []),
    ...(filters.cashOnDelivery ? [{
      type: 'cod',
      value: 'cod',
      label: 'Cash on Delivery',
      onRemove: removeCOD,
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