// app/shops/components/ShopSort.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'top-rated' | 'most-reviewed' | 'featured' | 'most-orders' | 'newest' | 'verified' | 'open-now' | 'name-asc' | 'name-desc';

interface ShopSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const ShopSort: React.FC<ShopSortProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'top-rated', label: 'Top Rated' },
    { value: 'most-reviewed', label: 'Most Reviewed' },
    { value: 'featured', label: 'Featured' },
    { value: 'most-orders', label: 'Most Orders' },
    { value: 'newest', label: 'Newest' },
    { value: 'verified', label: 'Verified First' },
    { value: 'open-now', label: 'Open Now' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort by';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
      >
        <span className="text-gray-700">{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${currentSort === option.value
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''}
                  ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopSort;