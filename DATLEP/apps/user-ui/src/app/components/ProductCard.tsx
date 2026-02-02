'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Eye, ShoppingBag, Share2, Clock, Store, Shield, Truck, Check } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import WishlistButton from './WishlistButton';
import ProductQuickViewModal from './ProductQuickViewModal';
import { Product, Shop, Seller } from './types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Product data
  const mainImage = product.image?.url || '/placeholder-image.jpg';
  const galleryImages = product.gallery || [];
  const salePrice = product.salePrice || 0;
  const regularPrice = product.regularPrice || 0;
  const discount = regularPrice > 0 && salePrice > 0 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : 0;
  
  const rating = product.ratings?.average || 0;
  const reviewCount = product.ratings?.count || 0;
  const stock = product.stock || 0;
  const views = product.views || 0;
  const orderCount = product.orderCount || 0;

  // Shop and Seller data from populated fields
  const shop = product.shopId as unknown as Shop;
  const seller = shop?.seller as Seller;

  // Shop verification badges
  const isShopVerified = shop?.isVerifiedShop;
  const isShopFeatured = shop?.isFeatured;
  const isSellerVerified = seller?.isVerified;

  // Mock time left for sale
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 3);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart:', product.title);
    // Add to cart logic here
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Share:', product.title);
    // Share logic here
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
          {/* Left side - Discount & Featured */}
          <div className="flex flex-col gap-1">
            {discount > 0 && (
              <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full w-fit">
                -{discount}%
              </div>
            )}
            {product.featured && (
              <div className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full w-fit">
                Featured
              </div>
            )}
          </div>

          {/* Right side - Shop Verified Badge */}
          {isShopVerified && (
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified Shop
            </div>
          )}
        </div>

        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered && galleryImages.length > 0 ? 'scale-110' : ''
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          {/* Gallery Images on Hover */}
          {isHovered && galleryImages.length > 0 && (
            <div className="absolute inset-0 flex">
              {galleryImages.slice(0, 2).map((img, index) => (
                <div key={index} className="flex-1 relative">
                  <Image
                    src={img.url || '/placeholder-image.jpg'}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Sale Countdown Timer */}
          {discount > 0 && (
            <div className="absolute bottom-2 left-2 right-2">
              <CountdownTimer endDate={saleEndDate} />
            </div>
          )}

          {/* Action Buttons Overlay */}
          <div className={`absolute inset-0 bg-black/10 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Quick View"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <WishlistButton 
              productId={product._id}
              isWishlisted={isWishlisted}
              onToggle={() => setIsWishlisted(!isWishlisted)}
            />
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Shop Info */}
          {shop && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {shop.logo ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={shop.logo}
                        alt={shop.name}
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/shop/${shop.slug}`}
                      className="text-xs font-medium text-gray-900 hover:text-purple-600 truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {shop.name}
                    </Link>
                    {isShopFeatured && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{shop.rating?.toFixed(1) || 'New'}</span>
                    <span>•</span>
                    <span>{shop.totalReviews || 0} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12 hover:text-purple-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              ${salePrice > 0 ? salePrice.toFixed(2) : regularPrice.toFixed(2)}
            </span>
            {salePrice > 0 && regularPrice > 0 && salePrice < regularPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${regularPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock & Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span className={`${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </span>
              <span>{views.toLocaleString()} views</span>
            </div>
            {orderCount > 0 && (
              <span className="text-orange-600 font-medium">{orderCount} sold</span>
            )}
          </div>

          {/* Sizes (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.sizes.slice(0, 3).map((size, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-xs rounded border ${
                    size.quantity > 0 
                      ? 'bg-gray-100 text-gray-700 border-gray-300' 
                      : 'bg-gray-50 text-gray-400 border-gray-200 line-through'
                  }`}
                >
                  {size.size} {size.quantity > 0 ? `(${size.quantity})` : ''}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{product.sizes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              stock === 0 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 hover:shadow-lg'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Quick Stats Footer */}
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
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <ProductQuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;