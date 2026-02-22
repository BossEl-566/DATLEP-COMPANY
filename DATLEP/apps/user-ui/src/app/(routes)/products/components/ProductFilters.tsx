// app/products/components/ProductFilters.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { ProductFilter } from '../types';

interface ProductFiltersProps {
  filters: ProductFilter;
  onFilterChange: (filters: Partial<ProductFilter>) => void;
  facets: {
    categories: Array<{ value: string; count: number }>;
    brands: Array<{ value: string; count: number }>;
  };
  onClear: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  facets,
  onClear,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    size: true,
    color: true,
    brand: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Grey', hex: '#808080' },
  ];

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : type === 'min' ? 0 : 10000;
    onFilterChange({
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    });
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    onFilterChange({ categories: newCategories });
  };

  const handleBrandChange = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    onFilterChange({ brands: newBrands });
  };

  const handleSizeChange = (size: string) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    onFilterChange({ sizes: newSizes });
  };

  const handleColorChange = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    onFilterChange({ colors: newColors });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ minRating: rating === filters.minRating ? undefined : rating });
  };

  const handleAvailabilityChange = (inStock: boolean) => {
    onFilterChange({ inStock });
  };

  const handleCashOnDeliveryChange = (cod: boolean) => {
    onFilterChange({ cashOnDelivery: cod });
  };

  const activeFilterCount = [
    filters.categories?.length || 0,
    filters.brands?.length || 0,
    filters.sizes?.length || 0,
    filters.colors?.length || 0,
    filters.minRating ? 1 : 0,
    filters.minPrice && filters.minPrice > 0 ? 1 : 0,
    filters.maxPrice && filters.maxPrice < 10000 ? 1 : 0,
    filters.inStock === false ? 1 : 0,
    filters.cashOnDelivery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Categories
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {facets.categories.map(cat => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(cat.value)}
                  onChange={() => handleCategoryChange(cat.value)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600 flex-1">{cat.value}</span>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <span className="text-gray-400 mt-5">-</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice === 10000 ? '' : filters.maxPrice}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Any"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Sizes
          {expandedSections.size ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.size && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors
                    ${filters.sizes?.includes(size)
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Colors
          {expandedSections.color ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.color && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className="group relative"
                  title={color.name}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all
                      ${filters.colors?.includes(color.name)
                        ? 'border-purple-600 ring-2 ring-purple-200'
                        : 'border-transparent hover:border-gray-300'
                      }
                    `}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Brands
          {expandedSections.brand ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {facets.brands.map(brand => (
              <label key={brand.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand.value)}
                  onChange={() => handleBrandChange(brand.value)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600 flex-1">{brand.value}</span>
                <span className="text-xs text-gray-400">({brand.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Customer Rating
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">
                  {rating}+ ★
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Availability
          {expandedSections.availability ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.availability && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock === true}
                onChange={() => handleAvailabilityChange(!filters.inStock)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.cashOnDelivery === true}
                onChange={() => handleCashOnDeliveryChange(!filters.cashOnDelivery)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Cash on Delivery</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;