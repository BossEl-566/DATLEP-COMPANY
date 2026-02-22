// app/products/components/CategoryBreadcrumb.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface CategoryBreadcrumbProps {
  category?: string;
}

type CategoryNode = {
  parent?: string;
  path: string;
};

const categoryMap: Record<string, CategoryNode> = {
  Clothing: { path: 'Clothing' },
  Men: { parent: 'Clothing', path: 'Clothing/Men' },
  Women: { parent: 'Clothing', path: 'Clothing/Women' },
  Kids: { parent: 'Clothing', path: 'Clothing/Kids' },
  Shoes: { path: 'Shoes' },
  Accessories: { path: 'Accessories' },
  Bags: { parent: 'Accessories', path: 'Accessories/Bags' },
  Jewelry: { parent: 'Accessories', path: 'Accessories/Jewelry' },
};

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({ category }) => {
  const getCategoryPath = (cat?: string): string[] => {
    if (!cat) return [];

    const path: string[] = [];
    let currentCat: string | undefined = cat;

    while (currentCat) {
      path.unshift(currentCat);

      const catInfo: CategoryNode | undefined = categoryMap[currentCat];
      currentCat = catInfo?.parent;
    }

    return path;
  };

  const path = getCategoryPath(category);

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-x-auto pb-2 whitespace-nowrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-purple-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

      <Link href="/products" className="hover:text-purple-600 transition-colors">
        Products
      </Link>

      {path.map((cat, index) => (
        <React.Fragment key={cat}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {index === path.length - 1 ? (
            <span className="text-gray-900 font-medium">{cat}</span>
          ) : (
            <Link
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="hover:text-purple-600 transition-colors"
            >
              {cat}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CategoryBreadcrumb;