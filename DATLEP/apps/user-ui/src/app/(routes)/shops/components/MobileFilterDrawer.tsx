// app/shops/components/MobileFilterDrawer.tsx
'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, SlidersHorizontal } from 'lucide-react';
import ShopFilters from './ShopFilters';
import { ShopFilter } from '../types';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ShopFilter;
  onFilterChange: (filters: Partial<ShopFilter>) => void;
  facets: {
    categories: Array<{ value: string; count: number }>;
    shopTypes: Array<{ value: string; count: number }>;
    countries: Array<{ value: string; count: number }>;
    cities: Array<{ value: string; count: number }>;
  };
  onClear: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  facets,
  onClear,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  // Update temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFilterChange(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({
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
    onClear();
    onClose();
  };

  const handleTempFilterChange = (newFilters: Partial<ShopFilter>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate active filter count for mobile button
  const activeFilterCount = [
    tempFilters.categories?.length || 0,
    tempFilters.shopType?.length || 0,
    tempFilters.yearsInBusiness?.length || 0,
    tempFilters.country ? 1 : 0,
    tempFilters.city ? 1 : 0,
    tempFilters.minRating ? 1 : 0,
    tempFilters.minReviews ? 1 : 0,
    tempFilters.isVerifiedShop === true ? 1 : 0,
    tempFilters.isFeatured === true ? 1 : 0,
    tempFilters.isOpen === true ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Drawer */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Filter Shops
                </Dialog.Title>
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="overflow-y-auto h-[calc(100%-140px)] px-4">
              <ShopFilters
                filters={tempFilters}
                onFilterChange={handleTempFilterChange}
                facets={facets}
                onClear={handleClear}
                isMobile={true}
              />
            </div>

            {/* Footer with Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default MobileFilterDrawer;