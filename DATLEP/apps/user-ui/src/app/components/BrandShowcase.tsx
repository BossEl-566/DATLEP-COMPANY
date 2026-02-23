// app/components/BrandShowcase.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

const BrandShowcase = () => {
  const { data } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get('/product/api/get-filtered-products', {
        params: { limit: 50, fields: 'brand' }
      });
      return response.data;
    },
  });

  // Extract unique brands from products
  const brands = [
    { name: "Nike", logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png", slug: "nike" },
    { name: "Adidas", logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png", slug: "adidas" },
    { name: "Zara", logo: "https://logos-world.net/wp-content/uploads/2020/04/Zara-Logo.png", slug: "zara" },
    { name: "H&M", logo: "https://logos-world.net/wp-content/uploads/2020/04/H&M-Logo.png", slug: "hm" },
    { name: "Gucci", logo: "https://logos-world.net/wp-content/uploads/2020/12/Gucci-Logo.png", slug: "gucci" },
    { name: "Prada", logo: "https://logos-world.net/wp-content/uploads/2020/12/Prada-Logo.png", slug: "prada" },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Brand</h2>
        <Link href="/brands" className="text-sm font-medium text-purple-600 hover:text-purple-800">
          View All Brands →
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/products?brand=${brand.slug}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 group"
          >
            <div className="relative h-12 mb-3 grayscale group-hover:grayscale-0 transition-all">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-700 group-hover:text-purple-600">
              {brand.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandShowcase;