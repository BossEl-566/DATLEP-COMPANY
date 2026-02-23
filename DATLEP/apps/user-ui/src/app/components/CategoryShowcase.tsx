'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingBag,
  Shirt,
  Footprints,
  Gem,
  Sparkles,
  Package,
  Shapes,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import api from '../lib/axios';

interface CategoryCard {
  name: string;
  image: string;
  count: number;
  slug: string;
}

interface CategoriesApiResponse {
  categories?: string[];
  subCategories?: Record<string, string[]>;
}

const FALLBACK_CATEGORIES: CategoryCard[] = [
  { name: "Women's Fashion", image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop', count: 2453, slug: 'womens-fashion' },
  { name: "Men's Fashion", image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1200&auto=format&fit=crop', count: 1876, slug: 'mens-fashion' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=1200&auto=format&fit=crop', count: 892, slug: 'kids' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop', count: 1234, slug: 'shoes' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop', count: 567, slug: 'bags' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop', count: 789, slug: 'accessories' },
];

const categoryImageMap: Record<string, string> = {
  Clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
  Footwear: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
  Accessories: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop',
  Jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
  'Bags & Purses': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
  'Fabrics & Materials': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop',
};

const defaultCategoryImage =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

function getCategoryIcon(name: string): LucideIcon {
  const key = name.toLowerCase();

  if (
    key.includes('bag') ||
    key.includes('purse') ||
    key.includes('handbag')
  ) {
    return ShoppingBag;
  }

  if (
    key.includes('cloth') ||
    key.includes('fashion') ||
    key.includes('wear') ||
    key.includes('dress') ||
    key.includes('shirt') ||
    key.includes('men') ||
    key.includes('women') ||
    key.includes('kid')
  ) {
    return Shirt;
  }

  if (
    key.includes('shoe') ||
    key.includes('footwear') ||
    key.includes('sneaker') ||
    key.includes('slipper') ||
    key.includes('boot')
  ) {
    return Footprints;
  }

  if (
    key.includes('jewel') ||
    key.includes('ring') ||
    key.includes('necklace') ||
    key.includes('gold') ||
    key.includes('silver')
  ) {
    return Gem;
  }

  if (
    key.includes('accessor') ||
    key.includes('watch') ||
    key.includes('beauty') ||
    key.includes('cosmetic')
  ) {
    return Sparkles;
  }

  if (
    key.includes('fabric') ||
    key.includes('material') ||
    key.includes('textile')
  ) {
    return Shapes;
  }

  return Package;
}

function CategoryImageWithFallback({
  src,
  alt,
  categoryName,
}: {
  src: string;
  alt: string;
  categoryName: string;
}) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const Icon = getCategoryIcon(categoryName);

  if (failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-3">
          <div className="h-16 w-16 rounded-2xl bg-white/90 shadow-sm border border-gray-100 flex items-center justify-center">
            <Icon className="h-8 w-8 text-purple-500" strokeWidth={2} />
          </div>
          <p className="mt-3 text-xs text-gray-500 line-clamp-2">{categoryName}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
      className="object-cover group-hover:scale-110 transition-transform duration-500"
      onError={() => setFailed(true)}
      // Helps when some remote hosts are slow/flaky in dev:
      unoptimized
    />
  );
}

const CategoryShowcase = () => {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const { data, isLoading } = useQuery<CategoriesApiResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/product/api/get-category');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const normalizedCategories = useMemo<CategoryCard[]>(() => {
    if (!Array.isArray(data?.categories) || data.categories.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    const uniqueNames = Array.from(
      new Set(
        data.categories
          .map((c) => (typeof c === 'string' ? c.trim() : ''))
          .filter(Boolean)
      )
    );

    return uniqueNames
      .map((name) => ({
        name,
        slug: slugify(name),
        image: categoryImageMap[name] || defaultCategoryImage,
        count: Array.isArray(data?.subCategories?.[name])
          ? data.subCategories![name].length
          : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedCategories;
    return normalizedCategories.filter((category) =>
      category.name.toLowerCase().includes(q)
    );
  }, [normalizedCategories, search]);

  const visibleCategories = filteredCategories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCategories.length;

  React.useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [search]);

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredCategories.length.toLocaleString()} categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <Link
            href="/categories"
            className="whitespace-nowrap text-sm font-medium text-purple-600 hover:text-purple-800"
          >
            View All →
          </Link>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No categories found for “{search}”
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                title={category.name}
              >
                <div className="aspect-square relative">
                  <CategoryImageWithFallback
                    src={category.image}
                    alt={category.name}
                    categoryName={category.name}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-200">
                      {(category.count ?? 0).toLocaleString()} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCategories.length > INITIAL_VISIBLE_COUNT && (
            <div className="mt-6 flex justify-center gap-3">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + LOAD_MORE_COUNT, filteredCategories.length)
                    )
                  }
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
                >
                  Show More ({(filteredCategories.length - visibleCount).toLocaleString()} left)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryShowcase;