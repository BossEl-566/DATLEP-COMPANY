// app/product/[slug]/components/RelatedProducts.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star } from 'lucide-react';
import axiosInstance from '../../../../../shared/utils/axiosInstance';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
  shopId?: string;
  tags?: string[];
}

interface RelatedProduct {
  _id: string;
  title: string;
  slug: string;
  image?: { url: string };
  gallery?: Array<{ url: string }>;
  regularPrice: number;
  salePrice?: number;
  ratings?: {
    average: number;
    count: number;
  };
  stock: number;
  shopId?: {
    _id: string;
    name: string;
    slug: string;
  };
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  category, 
  currentProductId,
  shopId,
  tags = []
}) => {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stableTags = useMemo(() => tags, [tags.join(',')]);

  useEffect(() => {
    console.log('RelatedProducts mounted with props:', { category, currentProductId, shopId, tags });
    
    if (!category) {
      console.log('No category provided, skipping fetch');
      setLoading(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching related products...');

        const params = new URLSearchParams({
          limit: '8',
          page: '1',
          sortBy: 'popular',
          inStock: 'true',
          categories: category,
          ...(shopId && { shopId }),
        });

        if (stableTags.length > 0) {
          params.append('tags', stableTags.join(','));
        }

        console.log('Fetching with params:', params.toString());
        
        const response = await axiosInstance.get(
          `/product/api/get-filtered-products?${params.toString()}`
        );

        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        if (response.data?.success) {
          const productsData = response.data.data || [];
          console.log('Products data array:', productsData);
          console.log('Products data length:', productsData.length);
          
          // TEMPORARILY COMMENT OUT FILTER TO SEE IF ANYTHING SHOWS
          // const filtered = productsData.filter(
          //   (p: RelatedProduct) => p._id !== currentProductId
          // );
          
          // Use all products temporarily for testing
          const filtered = productsData;
          
          console.log('Filtered products:', filtered);
          console.log('Filtered products length:', filtered.length);
          
          setProducts(filtered.slice(0, 6));
        } else {
          console.log('API success false or no data');
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Unable to load related products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId, shopId, stableTags]);

  console.log('Current state - loading:', loading, 'products:', products, 'error:', error);

  // Loading skeleton
  if (loading) {
    console.log('Rendering loading skeleton');
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">You May Also Like</h2>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    console.log('No products to display, returning null');
    // TEMPORARILY SHOW A MESSAGE INSTEAD OF NULL
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <p className="text-gray-500">No related products found (Debug: {products.length} products)</p>
      </div>
    );
  }

  console.log('Rendering products grid with', products.length, 'products');
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">You May Also Like</h2>
        <Link 
          href={`/category/${encodeURIComponent(category)}`}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => {
          console.log('Rendering product:', product._id, product.title);
          
          const productImage = product.image?.url || product.gallery?.[0]?.url || '/placeholder-image.jpg';
          const price = product.salePrice || product.regularPrice;
          const originalPrice = product.salePrice ? product.regularPrice : null;
          const discount = originalPrice && product.salePrice && originalPrice > product.salePrice
            ? Math.round(((originalPrice - product.salePrice) / originalPrice) * 100)
            : null;

          return (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                <Image
                  src={productImage}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
                
                {/* Discount Badge */}
                {discount && discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{discount}%
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                  {product.title}
                </h3>
                
                {/* Shop Name (if available) */}
                {product.shopId && typeof product.shopId === 'object' && (
                  <p className="text-xs text-gray-500 mb-1 truncate">
                    {product.shopId.name}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    GH₵{price.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-gray-400 line-through">
                      GH₵{originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {product.ratings.average.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.ratings.count})
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;