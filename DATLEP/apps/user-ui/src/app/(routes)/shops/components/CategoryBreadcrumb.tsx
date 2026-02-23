// app/shops/components/CategoryBreadcrumb.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[];
}

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-x-auto pb-2 whitespace-nowrap" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-purple-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-purple-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CategoryBreadcrumb;