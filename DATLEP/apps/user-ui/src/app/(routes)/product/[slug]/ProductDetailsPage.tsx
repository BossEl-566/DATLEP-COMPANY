// app/product/[slug]/ProductDetailsPage.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, Star, ShoppingBag, Share2, ChevronRight, Check, Store, Plus, Minus
} from 'lucide-react';
import { Product, Shop, Seller } from '../[slug]/types/index';
import { useStore } from '../../../../store/index';
import useUser from '../../../../configs/hooks/useUser';
import useLocationTracking from '../../../../configs/hooks/useLocationTracking';
import useDeviceTracking from '../../../../configs/hooks/useDeviceTracking';

// Import modular components
import ProductGallery from './components/ProductGallery';
import ProductTabs from './components/ProductTabs';
import SellerInfo from './components/SellerInfo';
import RelatedProducts from './components/RelatedProducts';
import DeliveryReturns from './components/DeliveryReturns';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetailsPage: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.find(c => c.available)?.hexCode || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.find(s => s.available && (s.stock ?? 0) > 0)?.size || ''
  );

  // User and tracking hooks
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  // Store actions
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist);

  // Derived data
  const mainImage = product.image?.url || '/placeholder-image.jpg';
  const galleryImages = product.gallery?.map(g => g.url) || [];
  const allImages = [mainImage, ...galleryImages];
  
  const salePrice = product.salePrice || 0;
  const regularPrice = product.regularPrice || 0;
  const discount = regularPrice > 0 && salePrice > 0 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : 0;

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const shop = product.shopId as unknown as Shop;
  const seller = shop?.seller as Seller;

  // Quantity handlers
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const productData = {
      _id: product._id,
      title: product.title,
      image: product.image?.url || '',
      price: salePrice > 0 ? salePrice : regularPrice,
      shopId: shop?._id || '',
      quantity: quantity,
      selectedColor,
      selectedSize
    };

    addToCart(productData, user, location, deviceInfo);
  };

  const handleToggleWishlist = () => {
    const productData = {
      _id: product._id,
      title: product.title,
      image: product.image?.url || '',
      price: salePrice > 0 ? salePrice : regularPrice,
      shopId: shop?._id || '',
      quantity: 1
    };

    if (isWishlisted) {
      removeFromWishlist(productData, product._id, user, location, deviceInfo);
    } else {
      addToWishlist(productData, user, location, deviceInfo);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on DATLEP`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-purple-600">
              {product.category || 'Category'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Gallery */}
            <div>
              <ProductGallery 
                images={allImages}
                title={product.title}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </div>

            {/* Right Column - Product Info & Actions */}
            <div>
              {/* Shop Badge */}
              {shop && (
                <Link 
                  href={`/shop/${shop.slug}`}
                  className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full mb-4 hover:bg-purple-100 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span className="text-sm font-medium">{shop.name}</span>
                  {shop.isVerifiedShop && (
                    <Check className="w-3 h-3 text-green-600" />
                  )}
                </Link>
              )}

              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2.5 rounded-full border transition-all ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.ratings?.average || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {(product.ratings?.average || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.ratings?.count || 0} reviews)
                </span>
                <span className="text-sm text-gray-500">
                  {product.views?.toLocaleString()} views
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    GH₵{(salePrice > 0 ? salePrice : regularPrice).toFixed(2)}
                  </span>
                  {salePrice > 0 && regularPrice > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        GH₵{regularPrice.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.shortDescription || 'Premium quality product with authentic design and craftsmanship.'}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color._id}
                        onClick={() => setSelectedColor(color.hexCode)}
                        disabled={!color.available}
                        className={`
                          w-10 h-10 rounded-full border-2 transition-all
                          ${selectedColor === color.hexCode 
                            ? 'border-purple-600 ring-2 ring-purple-200' 
                            : 'border-transparent hover:border-gray-300'
                          }
                          ${!color.available && 'opacity-50 cursor-not-allowed'}
                        `}
                        style={{ backgroundColor: color.hexCode }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size._id}
                        onClick={() => setSelectedSize(size.size)}
                        disabled={size.stock === 0}
                        className={`
                          min-w-[48px] px-4 py-2 text-sm font-medium rounded-lg border transition-all
                          ${selectedSize === size.size
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }
                          ${size.stock === 0 && 'opacity-50 cursor-not-allowed bg-gray-50'}
                        `}
                      >
                        {size.size}
                        {size.stock === 0 && ' (Out)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 
                    ? `${product.stock} units in stock` 
                    : 'Out of stock'
                  }
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Delivery Info */}
              <DeliveryReturns 
                cashOnDelivery={product.cashOnDelivery ?? false}
                shopLocation={shop?.address?.city || 'Ghana'}
              />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <ProductTabs 
            detailedDescription={product.detailedDescription || ''}
            specifications={product.customProperties ? Object.entries(product.customProperties).map(([key, value]) => ({ key, value })) : []}
            reviews={product.ratings ? { ...product.ratings, distribution: product.ratings.distribution || {} } : { average: 0, count: 0, distribution: {} }}
          />
        </div>

        {/* Seller Information */}
        <div className="mt-8">
          <SellerInfo shop={shop} seller={seller} />
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <RelatedProducts 
            category={product.category || 'General'}
            currentProductId={product._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;