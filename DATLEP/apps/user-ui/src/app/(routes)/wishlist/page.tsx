"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Share2, Eye, ChevronRight, Filter, Search, Package, Shield, Truck, Clock, Star, Check, X, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../../store';
import useUser from '../../../configs/hooks/useUser';
import useLocationTracking from '../../../configs/hooks/useLocationTracking';
import useDeviceTracking from '../../../configs/hooks/useDeviceTracking';
import Footer from '../../components/Footer';

type Product = {
  _id: string;
  title: string;
  image: string;
  price: number;
  quantity?: number;
  shopId: string;
  shop?: {
    name: string;
    logo: string;
    isVerified: boolean;
    rating: number;
  };
  isInStock?: boolean;
  discount?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
};

const WishlistPage = () => {
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  
  // Get wishlist state and functions from store
  const wishlist = useStore((state) => state.wishlist);
  const cart = useStore((state) => state.cart);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const clearWishlist = useStore((state) => state.clearWishlist);
  
  const [filteredWishlist, setFilteredWishlist] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-added');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState<{ type: string; message: string } | null>(null);

  // Get categories from wishlist items
  const categories = ['all', ...new Set(wishlist.map(item => item.category || 'uncategorized').filter(Boolean))];

  // Filter and sort wishlist
  useEffect(() => {
    setIsLoading(true);
    
    let result = [...wishlist];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shop?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort items
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'name-a-z':
          return a.title.localeCompare(b.title);
        case 'name-z-a':
          return b.title.localeCompare(a.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default: // date-added
          return 0; // Keep original order (most recently added first)
      }
    });
    
    setFilteredWishlist(result);
    setIsLoading(false);
  }, [wishlist, selectedCategory, sortBy, searchQuery]);

  // Show notification
  const showNotificationMessage = (type: string, message: string) => {
    setShowNotification({ type, message });
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (product: Product) => {
    removeFromWishlist({ ...product, quantity: product.quantity ?? 1 }, product._id, user, location, deviceInfo);
    showNotificationMessage('info', 'Removed from wishlist');
  };

  // Handle add to cart from wishlist
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: product.quantity ?? 1 }, user, location, deviceInfo);
    showNotificationMessage('success', 'Added to cart!');
  };

  // Handle select item
  const handleSelectItem = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === filteredWishlist.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredWishlist.map(item => item._id)));
    }
  };

  // Handle move selected to cart
  const handleMoveSelectedToCart = () => {
    selectedItems.forEach(productId => {
      const product = wishlist.find(item => item._id === productId);
      if (product) {
        addToCart(product, user, location, deviceInfo);
        removeFromWishlist(product, product._id, user, location, deviceInfo);
      }
    });
    showNotificationMessage('success', `Moved ${selectedItems.size} items to cart`);
    setSelectedItems(new Set());
  };

  // Handle remove selected
  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      const product = wishlist.find(item => item._id === productId);
      if (product) {
        removeFromWishlist(product, product._id, user, location, deviceInfo);
      }
    });
    showNotificationMessage('info', `Removed ${selectedItems.size} items`);
    setSelectedItems(new Set());
  };

  // Handle share wishlist
  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishlist.length} items!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotificationMessage('info', 'Link copied to clipboard!');
    }
  };

  // Calculate totals
  const totalItems = wishlist.length;
  const selectedCount = selectedItems.size;
  const totalPrice = filteredWishlist.reduce((sum, item) => sum + item.price, 0);
  const selectedPrice = filteredWishlist
    .filter(item => selectedItems.has(item._id))
    .reduce((sum, item) => sum + item.price, 0);

  // Check if item is in cart
  const isInCart = (productId: string) => {
    return cart.some(item => item._id === productId);
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 ${
              showNotification.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {showNotification.type === 'success' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Info className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-medium">{showNotification.message}</span>
              <button onClick={() => setShowNotification(null)}>
                <X className="w-4 h-4 ml-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-900 font-medium">My Wishlist</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={handleShareWishlist}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Wishlist</span>
              </button>
              
              {wishlist.length > 0 && (
                <button
                  onClick={() => clearWishlist()}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Estimated Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${totalPrice.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Your Cart</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{cart.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredWishlist.length && filteredWishlist.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
                  </span>
                </div>
                
                {selectedCount > 0 && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleMoveSelectedToCart}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={handleRemoveSelected}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search in wishlist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-900 outline-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-900 outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-900 outline-none"
                  >
                    <option value="date-added">Date Added</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                    <option value="name-z-a">Name: Z to A</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist Content */}
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save items you love for later. Click the heart icon on any product to add it here.
              </p>
              <Link href="/marketplace">
                <button className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : filteredWishlist.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No items found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No items match your current filters. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <AnimatePresence>
                  {filteredWishlist.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Item Header */}
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                            className="w-4 h-4 text-blue-900 rounded"
                          />
                          {item.shop && (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                                {item.shop.logo ? (
                                  <Image
                                    src={item.shop.logo}
                                    alt={item.shop.name}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-800">
                                      {item.shop.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-medium">{item.shop.name}</span>
                              {item.shop.isVerified && (
                                <Shield className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRemoveFromWishlist(item)}
                            className="p-2 hover:bg-red-50 rounded-full text-red-500"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Item Image */}
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {item.discount && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            -{item.discount}%
                          </div>
                        )}
                        
                        <Link href={`/product/${item._id}`}>
                          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-50 transition">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                        </Link>
                      </div>
                      
                      {/* Item Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating || 0) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({item.reviewCount || 0})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Added recently</span>
                          </div>
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex items-center space-x-1 ${
                            item.isInStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.isInStock ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Truck className="w-4 h-4" />
                            <span>Free Shipping</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          {isInCart(item._id) ? (
                            <Link href="/cart" className="flex-1">
                              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center space-x-2">
                                <ShoppingCart className="w-4 h-4" />
                                <span>View in Cart</span>
                              </button>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.isInStock}
                              className={`flex-1 py-2.5 rounded-lg font-medium transition flex items-center justify-center space-x-2 ${
                                item.isInStock
                                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{item.isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                            </button>
                          )}
                          
                          <Link href={`/product/${item._id}`} className="flex-1">
                            <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Recommendations */}
              {wishlist.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
                    <Link href="/marketplace" className="text-blue-900 font-medium hover:text-blue-800">
                      View All Products →
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <Shield className="w-6 h-6 text-blue-700" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Safe & Verified</h3>
                        <p className="text-gray-600 text-sm">
                          All products come from verified sellers with quality guarantees
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <Truck className="w-6 h-6 text-green-700" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
                        <p className="text-gray-600 text-sm">
                          Enjoy free delivery on orders above $50 from your wishlist
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                          <Clock className="w-6 h-6 text-purple-700" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Price Drop Alerts</h3>
                        <p className="text-gray-600 text-sm">
                          Get notified when items in your wishlist go on sale
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default WishlistPage;