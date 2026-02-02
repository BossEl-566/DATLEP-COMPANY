'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, Star, ShoppingBag, Share2, Truck, Shield, Store, Check, Minus, Plus, MapPin, Package } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { Product, Shop, Seller } from './types';
import { useStore } from '../../store';
import useDeviceTracking from '../../configs/hooks/useDeviceTracking';

interface ProductQuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  user: any;
  location: any;
  deviceInfo: string;
}

const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  user,
  location,
  deviceInfo
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Zustand store hooks
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  
  const wishlist = useStore((state) => state.wishlist);
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  
  const cart = useStore((state) => state.cart);
  const isInCart = cart.some((item) => item._id === product._id);

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
  const orderCount = product.orderCount || 0;

  // Shop and Seller data
  const shop = product.shopId as unknown as Shop;
  const seller = shop?.seller as Seller;
  const isShopVerified = shop?.isVerifiedShop;
  const isSellerVerified = seller?.isVerified;

  // Available sizes
  const availableSizes = product.sizes?.filter(size => size.quantity > 0) || [];
  
  // Mock sale end date
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 3);

  // Get device info
  const deviceTrackingInfo = useDeviceTracking();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleToggleWishlist = () => {
    const productData = {
      _id: product._id,
      title: product.title,
      image: product.image?.url || '',
      price: salePrice > 0 ? salePrice : regularPrice,
      shopId: shop?._id || ''
    };

    if (isWishlisted) {
      removeFromWishlist(productData, product._id, user, location, deviceInfo || deviceTrackingInfo);
    } else {
      addToWishlist(productData, user, location, deviceInfo || deviceTrackingInfo);
    }
  };

  const handleAddToCart = () => {
    const productData = {
      _id: product._id,
      title: product.title,
      image: product.image?.url || '',
      price: salePrice > 0 ? salePrice : regularPrice,
      shopId: shop?._id || '',
      size: selectedSize || undefined,
      quantity: quantity
    };

    if (isInCart && selectedSize) {
      // If item is already in cart with this size, update quantity
      addToCart(productData, user, location, deviceInfo || deviceTrackingInfo);
    } else if (isInCart) {
      // Remove if already in cart without size selection
      removeFromCart(productData, product._id, user, location, deviceInfo || deviceTrackingInfo);
    } else {
      addToCart(productData, user, location, deviceInfo || deviceTrackingInfo);
    }
    
    handleClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on our marketplace`,
        url: window.location.origin + `/product/${product.slug}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.slug}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  if (!isOpen) return null;

  const displayImages = [mainImage, ...(galleryImages.map(img => img.url) || [])];
  const currentImage = displayImages[selectedImage] || mainImage;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Column - Images */}
            <div className="relative bg-gray-50 h-[400px] lg:h-auto">
              {/* Main Image */}
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <div className="px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full">
                      -{discount}% OFF
                    </div>
                  )}
                  {product.featured && (
                    <div className="px-3 py-1.5 bg-purple-600 text-white text-sm font-bold rounded-full">
                      Featured Product
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto py-2">
                  {displayImages.slice(0, 5).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-purple-600 shadow-lg scale-105'
                          : 'border-white hover:border-purple-400'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="p-6 lg:p-8 overflow-y-auto max-h-[400px] lg:max-h-[calc(90vh-2rem)]">
              {/* Shop Info */}
              {shop && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="relative">
                    {shop.logo ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow">
                        <Image
                          src={shop.logo}
                          alt={shop.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow flex items-center justify-center">
                        <Store className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    {isSellerVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/shop/${shop.slug}`}
                        className="font-semibold text-gray-900 hover:text-purple-600 truncate"
                        onClick={handleClose}
                      >
                        {shop.name}
                      </Link>
                      {isShopVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {shop.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{shop.rating?.toFixed(1) || 'New'}</span>
                      </div>
                      <span>•</span>
                      <span>{shop.totalReviews || 0} reviews</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{location?.city || 'Online'} • {location?.country || 'Worldwide'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 ml-1">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
                {orderCount > 0 && (
                  <span className="text-orange-600 font-medium">
                    {orderCount} sold
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${salePrice > 0 ? salePrice.toFixed(2) : regularPrice.toFixed(2)}
                </span>
                {salePrice > 0 && regularPrice > 0 && salePrice < regularPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${regularPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 font-bold rounded">
                      Save ${(regularPrice - salePrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Sale Countdown */}
              {discount > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Sale ends in:</div>
                  <CountdownTimer endDate={saleEndDate} />
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock > 0 ? (
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {stock} items in stock
                    </span>
                  ) : (
                    <span>❌ Out of stock</span>
                  )}
                </div>
              </div>

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    Select Size:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => handleSizeSelect(size.size)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                          selectedSize === size.size
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        } ${size.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={size.quantity === 0}
                      >
                        {size.size} {size.quantity > 0 && `(${size.quantity})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  Quantity:
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= stock}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stock} available
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0 || (availableSizes.length > 0 && !selectedSize)}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    stock === 0 || (availableSizes.length > 0 && !selectedSize)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isInCart
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:opacity-90'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:opacity-90'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isInCart ? 'Update Cart' : 'Add to Cart'}
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                      isWishlisted
                        ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Free shipping</span>
                  <span>•</span>
                  <span>Delivery in 3-5 business days</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Return policy:</span> 30-day return or exchange
                </div>
              </div>

              {/* View Full Details Link */}
              <div className="mt-6 text-center">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
                  onClick={handleClose}
                >
                  View full product details
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;