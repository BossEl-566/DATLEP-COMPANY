// app/product/[slug]/components/RelatedProducts.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';
import { ChevronRight } from 'lucide-react';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

interface RelatedProduct {
  _id: string;
  title: string;
  slug: string;
  image: { url: string };
  salePrice: number;
  regularPrice: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  category, 
  currentProductId 
}) => {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axiosInstance.get(
          `/product/api/get-products?category=${category}&limit=4&exclude=${currentProductId}`
        );
        setProducts(response.data?.products || []);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">You might also like</h2>
        <Link 
          href={`/category/${category}`}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              <Image
                src={product.image?.url || '/placeholder-image.jpg'}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600">
              {product.title}
            </h3>
            <div className="text-sm font-bold text-gray-900">
              GH₵{(product.salePrice || product.regularPrice).toFixed(2)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;