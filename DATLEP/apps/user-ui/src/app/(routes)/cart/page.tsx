"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ChevronRight, Shield, Truck, Clock, Package, CreditCard, ArrowRight, X, Check, AlertCircle, Info } from 'lucide-react';
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
  quantity: number;
  shopId: string;
  shop?: {
    name: string;
    logo: string;
    isVerified: boolean;
    rating: number;
    isOnline?: boolean;
    responseTime?: string;
  };
  isInStock?: boolean;
  maxQuantity?: number;
  deliveryTime?: string;
  deliveryCost?: number;
  isFreeShipping?: boolean;
};

const CartPage = () => {
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  
  // Get cart state and functions from store
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const addToCart = useStore((state) => state.addToCart);
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState<{ type: string; message: string } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  // Calculate cart totals
  const calculateTotals = () => {
    const selectedProducts = cart.filter(item => selectedItems.has(item._id));
    
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = selectedProducts.reduce((sum, item) => {
      if (item.isFreeShipping) return sum;
      return sum + (item.deliveryCost || 5);
    }, 0);
    
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const total = subtotal + shipping - discount;
    
    const itemCount = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
    
    return { subtotal, shipping, discount, total, itemCount };
  };

  const { subtotal, shipping, discount, total, itemCount } = calculateTotals();

  // Get unique sellers in cart
  const sellers = Array.from(new Set(cart.map(item => item.shopId)))
    .map(shopId => {
      const shopProducts = cart.filter(item => item.shopId === shopId);
      const shop = shopProducts[0]?.shop;
      return {
        id: shopId,
        name: shop?.name || 'Unknown Seller',
        logo: shop?.logo,
        isVerified: shop?.isVerified || false,
        isOnline: shop?.isOnline || false,
        responseTime: shop?.responseTime || 'Within 24 hours',
        products: shopProducts,
      };
    });

  // Select all items on load
  useEffect(() => {
    if (cart.length > 0 && selectedItems.size === 0) {
      setSelectedItems(new Set(cart.map(item => item._id)));
    }
    setIsLoading(false);
  }, [cart]);

  // Show notification
  const showNotificationMessage = (type: string, message: string) => {
    setShowNotification({ type, message });
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = cart.find(item => item._id === productId);
    if (!product) return;

    const maxQty = product.maxQuantity || 10;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > maxQty) {
      showNotificationMessage('warning', `Maximum quantity is ${maxQty}`);
      newQuantity = maxQty;
    }

    // Update quantity by removing and re-adding with new quantity
    removeFromCart(product, productId, user, location, deviceInfo);
    
    const updatedProduct = { ...product, quantity: newQuantity };
    addToCart(updatedProduct, user, location, deviceInfo);
  };

  // Handle remove from cart
  const handleRemoveFromCart = (product: Product) => {
    removeFromCart(product, product._id, user, location, deviceInfo);
    showNotificationMessage('info', 'Removed from cart');
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
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item._id)));
    }
  };

  // Handle select seller items
  const handleSelectSellerItems = (sellerId: string) => {
    const sellerItems = cart.filter(item => item.shopId === sellerId).map(item => item._id);
    const newSelected = new Set(selectedItems);
    
    const allSelected = sellerItems.every(id => newSelected.has(id));
    
    if (allSelected) {
      sellerItems.forEach(id => newSelected.delete(id));
    } else {
      sellerItems.forEach(id => newSelected.add(id));
    }
    
    setSelectedItems(newSelected);
  };

  // Handle apply coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showNotificationMessage('warning', 'Please enter a coupon code');
      return;
    }

    // Mock coupon validation
    const validCoupons = [
      { code: 'SAVE10', discount: 10 },
      { code: 'WELCOME20', discount: 20 },
      { code: 'FREESHIP', discount: 0, freeShipping: true },
    ];

    const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      setAppliedCoupon(coupon);
      showNotificationMessage('success', `Coupon applied! ${coupon.discount > 0 ? `${coupon.discount}% off` : 'Free shipping!'}`);
      setCouponCode('');
    } else {
      showNotificationMessage('error', 'Invalid coupon code');
    }
  };

  // Handle chat with seller
  const handleChatWithSeller = (sellerId: string, sellerName: string) => {
    setSelectedSeller(sellerName);
    setShowChatModal(true);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!chatMessage.trim()) {
      showNotificationMessage('warning', 'Please enter a message');
      return;
    }

    // Here you would typically send the message to your backend
    console.log(`Message to ${selectedSeller}: ${chatMessage}`);
    
    showNotificationMessage('success', `Message sent to ${selectedSeller}`);
    setChatMessage('');
    setShowChatModal(false);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      showNotificationMessage('warning', 'Please select items to checkout');
      return;
    }

    // Here you would typically redirect to checkout page
    showNotificationMessage('success', 'Proceeding to checkout...');
    
    // Mock checkout redirect
    setTimeout(() => {
      // window.location.href = '/checkout';
      console.log('Redirecting to checkout with items:', Array.from(selectedItems));
    }, 1000);
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
                : showNotification.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}>
              {showNotification.type === 'success' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : showNotification.type === 'error' ? (
                <X className="w-5 h-5 text-red-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <span className="font-medium">{showNotification.message}</span>
              <button onClick={() => setShowNotification(null)}>
                <X className="w-4 h-4 ml-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Chat with {selectedSeller}</h3>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Send a message to {selectedSeller} about the products in your cart. You can ask about:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Product availability
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Bulk discounts
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Customization options
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Shipping queries
                    </li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-900 outline-none resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-900 font-medium">Shopping Cart</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {cart.length > 0 && (
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button
                  onClick={() => clearCart()}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
                
                <Link href="/marketplace">
                  <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <ArrowRight className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Items Selected</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{itemCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Subtotal</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${subtotal.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Shipping</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${total.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link href="/marketplace">
                <button className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2">
                {/* Cart Controls */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cart.length && cart.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-900 rounded"
                      />
                      <span className="ml-3 font-medium">
                        {selectedItems.size > 0 
                          ? `${selectedItems.size} of ${cart.length} selected` 
                          : 'Select all items'}
                      </span>
                    </div>
                    
                    {selectedItems.size > 0 && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            cart.forEach(item => {
                              if (selectedItems.has(item._id)) {
                                removeFromCart(item, item._id, user, location, deviceInfo);
                              }
                            });
                            setSelectedItems(new Set());
                            showNotificationMessage('info', `Removed ${selectedItems.size} items`);
                          }}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                        >
                          Remove Selected
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sellers Sections */}
                <AnimatePresence>
                  {sellers.map((seller) => {
                    const sellerItems = seller.products;
                    const sellerSelectedItems = sellerItems.filter(item => selectedItems.has(item._id));
                    const allSelected = sellerItems.length > 0 && sellerItems.every(item => selectedItems.has(item._id));
                    
                    return (
                      <motion.div
                        key={seller.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden"
                      >
                        {/* Seller Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() => handleSelectSellerItems(seller.id)}
                                className="w-5 h-5 text-blue-900 rounded"
                              />
                              
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                    {seller.logo ? (
                                      <Image
                                        src={seller.logo}
                                        alt={seller.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-800">
                                          {seller.name.charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {seller.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                  )}
                                </div>
                                
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-bold text-gray-900">{seller.name}</h3>
                                    {seller.isVerified && (
                                      <Shield className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className={`text-sm ${seller.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                      {seller.isOnline ? 'Online Now' : 'Offline'}
                                    </span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">
                                      Responds {seller.responseTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleChatWithSeller(seller.id, seller.name)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition font-medium"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Chat with Seller</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Seller Items */}
                        <div className="divide-y divide-gray-100">
                          {sellerItems.map((item) => (
                            <div key={item._id} className="p-6">
                              <div className="flex items-start space-x-4">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(item._id)}
                                  onChange={() => handleSelectItem(item._id)}
                                  className="w-5 h-5 text-blue-900 rounded mt-4"
                                />
                                
                                <div className="flex-1 flex items-start space-x-4">
                                  {/* Product Image */}
                                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.image || '/placeholder-image.jpg'}
                                      alt={item.title}
                                      width={96}
                                      height={96}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  
                                  {/* Product Info */}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                          {item.title}
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                          ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      
                                      <button
                                        onClick={() => handleRemoveFromCart(item)}
                                        className="p-2 hover:bg-red-50 rounded-full text-red-500"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                      {/* Quantity Controls */}
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                          >
                                            <Minus className="w-4 h-4" />
                                          </button>
                                          <span className="w-12 text-center font-medium">
                                            {item.quantity}
                                          </span>
                                          <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </button>
                                        </div>
                                        
                                        <span className="text-sm text-gray-500">
                                          Max: {item.maxQuantity || 10}
                                        </span>
                                      </div>
                                      
                                      {/* Stock & Delivery */}
                                      <div className="flex items-center space-x-4">
                                        <div className={`flex items-center space-x-1 ${
                                          item.isInStock ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {item.isInStock ? (
                                            <>
                                              <Check className="w-4 h-4" />
                                              <span className="text-sm">In Stock</span>
                                            </>
                                          ) : (
                                            <>
                                              <X className="w-4 h-4" />
                                              <span className="text-sm">Out of Stock</span>
                                            </>
                                          )}
                                        </div>
                                        
                                        <div className="flex items-center space-x-1 text-gray-600">
                                          <Truck className="w-4 h-4" />
                                          <span className="text-sm">
                                            {item.isFreeShipping ? 'Free Shipping' : `$${item.deliveryCost || 5} shipping`}
                                          </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1 text-gray-600">
                                          <Clock className="w-4 h-4" />
                                          <span className="text-sm">
                                            {item.deliveryTime || '3-5 days'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Item Total */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                      <div className="text-right">
                                        <p className="text-sm text-gray-600">Item Total</p>
                                        <p className="text-xl font-bold text-gray-900">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Seller Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {sellerSelectedItems.length} of {sellerItems.length} items selected from this seller
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Seller Total</p>
                              <p className="text-xl font-bold text-gray-900">
                                ${sellerSelectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  {/* Order Summary Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                    </div>
                    
                    <div className="p-6">
                      {/* Order Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">
                            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        
                        {/* Coupon Section */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600">Coupon Discount</span>
                            {appliedCoupon && (
                              <span className="font-medium text-green-600">
                                -${discount.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          {!appliedCoupon ? (
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-900 outline-none"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                              >
                                Apply
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                                <p className="text-sm text-green-600">
                                  {appliedCoupon.discount > 0 
                                    ? `${appliedCoupon.discount}% discount applied` 
                                    : 'Free shipping applied'}
                                </p>
                              </div>
                              <button
                                onClick={() => setAppliedCoupon(null)}
                                className="p-1 hover:bg-green-100 rounded-full"
                              >
                                <X className="w-4 h-4 text-green-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="py-4 border-t border-b border-gray-200 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Including taxes</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Checkout Button */}
                      <button
                        onClick={handleCheckout}
                        disabled={selectedItems.size === 0}
                        className={`w-full py-3.5 rounded-lg font-bold transition mb-4 ${
                          selectedItems.size === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-900 to-purple-800 text-white hover:opacity-90'
                        }`}
                      >
                        Proceed to Checkout
                      </button>
                      
                      {/* Secure Checkout Info */}
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                          <Shield className="w-4 h-4" />
                          <span>Secure Checkout</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Options */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Shipping Options</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="standard"
                              checked={shippingMethod === 'standard'}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="w-4 h-4 text-blue-900"
                            />
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-gray-600">3-5 business days</p>
                            </div>
                          </div>
                          <span className="font-bold">FREE</span>
                        </label>
                        
                        <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="express"
                              checked={shippingMethod === 'express'}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="w-4 h-4 text-blue-900"
                            />
                            <div>
                              <p className="font-medium">Express Shipping</p>
                              <p className="text-sm text-gray-600">1-2 business days</p>
                            </div>
                          </div>
                          <span className="font-bold">$9.99</span>
                        </label>
                        
                        <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="same-day"
                              checked={shippingMethod === 'same-day'}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="w-4 h-4 text-blue-900"
                            />
                            <div>
                              <p className="font-medium">Same Day Delivery</p>
                              <p className="text-sm text-gray-600">Order before 2 PM</p>
                            </div>
                          </div>
                          <span className="font-bold">$19.99</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Support Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Need Help?</h4>
                        <p className="text-sm text-gray-600">Chat with our support team</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about your order? Our support team is here to help 24/7.
                    </p>
                    <button className="w-full py-2.5 bg-white border border-blue-200 text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition">
                      Start Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CartPage;