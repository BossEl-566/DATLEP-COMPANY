// app/products/components/ProductGrid.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Star,
  ShoppingBag,
  Eye,
  Share2,
  Shield,
  Store,
  Check,
  Truck,
  Clock,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../../../../store';
import useUser from '../../../../configs/hooks/useUser';
import useLocationTracking from '../../../../configs/hooks/useLocationTracking';
import useDeviceTracking from '../../../../configs/hooks/useDeviceTracking';

interface ProductGridProps {
  products: Product[];
}

// Minimal local typings for populated shop/seller objects (safe + optional)
interface SellerLike {
  isVerified?: boolean;
}

interface ShopLike {
  _id?: string;
  name?: string;
  slug?: string;
  logo?: string;
  isVerifiedShop?: boolean;
  isFeatured?: boolean;
  rating?: number;
  totalReviews?: number;
  seller?: SellerLike;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { user } = useUser();

  // ✅ Track user context for analytics/actions instead of passing null
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const wishlist = useStore((state) => state.wishlist);

  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const cart = useStore((state) => state.cart);

  const buildProductPayload = (product: Product) => {
    const shopObj =
      product.shopId && typeof product.shopId === 'object'
        ? (product.shopId as unknown as ShopLike)
        : null;

    return {
      _id: product._id,
      title: product.title,
      image: product.image?.url || '',
      price:
        typeof product.salePrice === 'number' && product.salePrice > 0
          ? product.salePrice
          : product.regularPrice,
      shopId:
        (shopObj?._id as string) ||
        (typeof product.shopId === 'string' ? product.shopId : '') ||
        '',
      quantity: 1,
      // keep this if your backend/store expects it in some paths
      quality: 1,
    };
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = wishlist.some((item) => item._id === product._id);
    const productData = buildProductPayload(product);

    if (isWishlisted) {
      // ✅ pass real tracking info
      removeFromWishlist(productData, product._id, user, location, deviceInfo);
    } else {
      // ✅ pass real tracking info
      addToWishlist(productData, user, location, deviceInfo);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const isInCart = cart.some((item) => item._id === product._id);
    const productData = buildProductPayload(product);

    if (isInCart) {
      removeFromCart(productData, product._id, user, location, deviceInfo);
    } else {
      addToCart(productData, user, location, deviceInfo);
    }
  };

  const handleShare = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/product/${product.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on our marketplace`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch {
      // user cancelled share or browser blocked; ignore
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const isWishlisted = wishlist.some((item) => item._id === product._id);
        const isInCart = cart.some((item) => item._id === product._id);

        const productImage = product.image?.url || '/placeholder-image.jpg';

        const salePrice =
          typeof product.salePrice === 'number' ? product.salePrice : 0;
        const regularPrice =
          typeof product.regularPrice === 'number' ? product.regularPrice : 0;

        const price = salePrice > 0 ? salePrice : regularPrice;
        const originalPrice =
          salePrice > 0 && regularPrice > salePrice ? regularPrice : null;

        const discount =
          originalPrice && salePrice > 0
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : 0;

        const stock = product.stock ?? 0;
        const rating = product.ratings?.average || 0;
        const reviewCount = product.ratings?.count || 0;
        const views = product.views || 0;
        const orderCount = product.orderCount || 0;

        const shop =
          product.shopId && typeof product.shopId === 'object'
            ? (product.shopId as unknown as ShopLike)
            : null;

        const isShopVerified = !!shop?.isVerifiedShop;
        const isShopFeatured = !!shop?.isFeatured;
        const isSellerVerified = !!shop?.seller?.isVerified;

        return (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Top badges */}
              <div className="absolute top-2 left-2 right-2 z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  {discount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discount}%
                    </div>
                  )}
                  {product.featured && (
                    <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>

                {isShopVerified && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span className="hidden sm:inline">Verified Shop</span>
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="absolute top-12 right-2 flex flex-col gap-2">
                <button
                  onClick={(e) => handleWishlist(e, product)}
                  title={
                    isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                  }
                  className={`
                    p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all
                    hover:scale-110 opacity-0 group-hover:opacity-100
                    ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
                  `}
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Hook up quick view modal if/when needed
                  }}
                  title="Quick view"
                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-600 hover:text-purple-600 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleShare(e, product)}
                  title="Share"
                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-600 hover:text-blue-600 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Out of Stock Overlay */}
              {stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium px-3 py-1.5 bg-black/60 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Shop Info */}
              {shop && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative shrink-0">
                    {shop.logo ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={shop.logo}
                          alt={shop.name || 'Shop'}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <Store className="w-3 h-3 text-purple-600" />
                      </div>
                    )}

                    {isSellerVerified && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      {shop.slug ? (
                        <Link
                          href={`/shop/${shop.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-gray-500 truncate hover:text-purple-600"
                        >
                          {shop.name || 'Shop'}
                        </Link>
                      ) : (
                        <p className="text-xs text-gray-500 truncate">
                          {shop.name || 'Shop'}
                        </p>
                      )}

                      {isShopFeatured && (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12 group-hover:text-purple-600 transition-colors">
                {product.title}
              </h3>

              {/* Rating */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {rating.toFixed(1)} ({reviewCount})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  GH₵{Number(price || 0).toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    GH₵{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock & Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={stock > 0 ? 'text-green-600' : 'text-red-600'}
                  >
                    {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                  </span>
                  {views > 0 && <span>{views.toLocaleString()} views</span>}
                </div>
                {orderCount > 0 && (
                  <span className="text-orange-600 font-medium">
                    {orderCount} sold
                  </span>
                )}
              </div>

              {/* Sizes preview */}
              {Array.isArray((product as any).sizes) &&
                (product as any).sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(product as any).sizes.slice(0, 3).map((size: any, idx: number) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-[10px] rounded border ${
                          (size?.quantity ?? 0) > 0
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-gray-50 text-gray-400 border-gray-200 line-through'
                        }`}
                      >
                        {size?.size}
                        {(size?.quantity ?? 0) > 0 ? ` (${size.quantity})` : ''}
                      </span>
                    ))}
                    {(product as any).sizes.length > 3 && (
                      <span className="px-2 py-1 text-[10px] text-gray-500">
                        +{(product as any).sizes.length - 3} more
                      </span>
                    )}
                  </div>
                )}

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={stock === 0}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  stock === 0
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : isInCart
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {stock === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
              </button>

              {/* Quick footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Just added</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Free shipping</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;