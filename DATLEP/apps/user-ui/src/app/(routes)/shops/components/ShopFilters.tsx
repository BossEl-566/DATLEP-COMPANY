// app/shops/components/ShopFilters.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Store, Shield, Star, Clock } from 'lucide-react';
import { ShopFilter } from '../types';

// Update the ShopFilters component props interface
interface ShopFiltersProps {
  filters: ShopFilter;
  onFilterChange: (filters: Partial<ShopFilter>) => void;
  facets: {
    categories: Array<{ value: string; count: number }>;
    shopTypes: Array<{ value: string; count: number }>;
    countries: Array<{ value: string; count: number }>;
    cities: Array<{ value: string; count: number }>;
  };
  onClear: () => void;
  isMobile?: boolean; // Add this optional prop
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  filters,
  onFilterChange,
  facets,
  onClear,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    shopType: true,
    location: true,
    ratings: true,
    verification: true,
    yearsInBusiness: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const shopTypes = [
    { value: 'retail', label: 'Retail Shop' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'both', label: 'Retail & Wholesale' },
  ];

  const yearsOptions = [
    { value: '<1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

  const handleCategoryChange = (category: string) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFilterChange({ categories: updated });
  };

  const handleShopTypeChange = (type: string) => {
    const current = filters.shopType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange({ shopType: updated });
  };

  const handleYearsChange = (year: string) => {
    const current = filters.yearsInBusiness || [];
    const updated = current.includes(year)
      ? current.filter(y => y !== year)
      : [...current, year];
    onFilterChange({ yearsInBusiness: updated });
  };

  const handleCountryChange = (country: string) => {
    onFilterChange({ 
      country: filters.country === country ? undefined : country,
      city: undefined, // Reset city when country changes
    });
  };

  const handleCityChange = (city: string) => {
    onFilterChange({ city: filters.city === city ? undefined : city });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ minRating: rating === filters.minRating ? undefined : rating });
  };

  const handleVerificationChange = (verified: boolean) => {
    onFilterChange({ isVerifiedShop: verified === filters.isVerifiedShop ? undefined : verified });
  };

  const handleOpenNowChange = (open: boolean) => {
    onFilterChange({ isOpen: open === filters.isOpen ? undefined : open });
  };

  const handleFeaturedChange = (featured: boolean) => {
    onFilterChange({ isFeatured: featured === filters.isFeatured ? undefined : featured });
  };

  const activeFilterCount = [
    filters.categories?.length || 0,
    filters.shopType?.length || 0,
    filters.yearsInBusiness?.length || 0,
    filters.country ? 1 : 0,
    filters.city ? 1 : 0,
    filters.minRating ? 1 : 0,
    filters.minReviews ? 1 : 0,
    filters.isVerifiedShop === true ? 1 : 0,
    filters.isFeatured === true ? 1 : 0,
    filters.isOpen === true ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">Filter Shops</h2>
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
      {facets.categories.length > 0 && (
        <div className="border-b border-gray-200 py-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900"
          >
            Shop Categories
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
                  <span className="text-sm text-gray-600 flex-1 capitalize">{cat.value}</span>
                  <span className="text-xs text-gray-400">({cat.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shop Type */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('shopType')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Shop Type
          {expandedSections.shopType ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.shopType && (
          <div className="mt-3 space-y-2">
            {shopTypes.map(type => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.shopType?.includes(type.value)}
                  onChange={() => handleShopTypeChange(type.value)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600 flex-1">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Location
          {expandedSections.location ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.location && (
          <div className="mt-3 space-y-4">
            {/* Countries */}
            {facets.countries.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Country</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {facets.countries.map(country => (
                    <label key={country.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="country"
                        checked={filters.country === country.value}
                        onChange={() => handleCountryChange(country.value)}
                        className="rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600 flex-1">{country.value}</span>
                      <span className="text-xs text-gray-400">({country.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Cities (only show if country selected) */}
            {filters.country && facets.cities.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">City</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {facets.cities.map(city => (
                    <label key={city.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="city"
                        checked={filters.city === city.value}
                        onChange={() => handleCityChange(city.value)}
                        className="rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600 flex-1">{city.value}</span>
                      <span className="text-xs text-gray-400">({city.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('ratings')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Shop Rating
          {expandedSections.ratings ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.ratings && (
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
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  {rating}+ <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Verification & Status */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('verification')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Shop Status
          {expandedSections.verification ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.verification && (
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerifiedShop === true}
                onChange={() => handleVerificationChange(!filters.isVerifiedShop)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" />
                Verified Shops Only
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isFeatured === true}
                onChange={() => handleFeaturedChange(!filters.isFeatured)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Store className="w-4 h-4 text-purple-600" />
                Featured Shops
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isOpen === true}
                onChange={() => handleOpenNowChange(!filters.isOpen)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-600" />
                Open Now
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Years in Business */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('yearsInBusiness')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          Years in Business
          {expandedSections.yearsInBusiness ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.yearsInBusiness && (
          <div className="mt-3 space-y-2">
            {yearsOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.yearsInBusiness?.includes(option.value)}
                  onChange={() => handleYearsChange(option.value)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopFilters;