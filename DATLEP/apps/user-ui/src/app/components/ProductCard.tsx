'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Eye, ShoppingBag, Share2, Clock } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import WishlistButton from './WishlistButton';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

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

  // Mock time left for sale (you can replace with actual data from API)
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 3); // Sale ends in 3 days

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    // In a real app, you would open a modal here
    console.log('Quick view for:', product.title);
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
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            -{discount}%
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
            Featured
          </div>
        </div>
      )}

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
        {/* Category/Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-purple-600 transition-colors">
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
            <span className="text-orange-600">{orderCount} sold</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            stock === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Quick Stats Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Just added</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{product.wishlistCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Quick View Modal Trigger */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Quick View: {product.title}</h3>
              <button
                onClick={() => setShowQuickView(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p>Quick view content would go here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;