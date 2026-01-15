"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, ShoppingCart, User, Menu, X, Bell, HelpCircle } from 'lucide-react';
import ChartIcon from '../../assets/svgs/ChartIcon';
import WishlistIcon from '../../assets/svgs/WishlistIcon';
import BespokeIcon from '../../assets/svgs/BespokeIcon';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('marketplace'); // 'marketplace' or 'bespoke'
  const [cartItems] = useState(3);
  const [wishlistItems] = useState(5);
  const [chartItems] = useState(2);
  const [currentLocation, setCurrentLocation] = useState('Lagos, Nigeria');

  const locations = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'Accra, Ghana',
    'Nairobi, Kenya',
    'Cairo, Egypt',
    'Johannesburg, South Africa'
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Bell className="w-4 h-4 mr-1" />
              New: Custom Tailoring in 7 Days!
            </span>
            <span className="hidden md:flex items-center">
              <HelpCircle className="w-4 h-4 mr-1" />
              Need help? Chat with us
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-purple-200 transition">Sell on DATLEP</button>
            <button className="hover:text-purple-200 transition">Become a Creator</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/images/datlep-logo.png"
                  alt="DATLEP Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                DATLEP
              </span>
            </div>

            {/* Mode Switch */}
            <div className="hidden lg:flex items-center space-x-2 ml-6">
              <button
                onClick={() => setActiveMode('marketplace')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeMode === 'marketplace' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveMode('bespoke')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeMode === 'bespoke' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <BespokeIcon className="w-4 h-4 mr-2" />
                Bespoke
              </button>
            </div>
          </div>

          {/* Location Selector */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <div className="relative group">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Deliver to</span>
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{currentLocation}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Location Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Select Location</h3>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => setCurrentLocation(location)}
                        className={`w-full text-left px-3 py-2 rounded-md transition ${currentLocation === location 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'hover:bg-gray-50'}`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`Search for ${activeMode === 'bespoke' ? 'tailors, fabrics, measurements...' : 'fashion, thrift stores, repair...'}`}
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition">
                Search
              </button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Chart */}
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
                <ChartIcon className="w-6 h-6 text-gray-700" />
                {chartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {chartItems}
                  </span>
                )}
              </button>
              <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                Compare Items
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>

            {/* Wishlist */}
            <div className="relative group hidden lg:block">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
                <WishlistIcon className="w-6 h-6 text-gray-700" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </button>
              <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                Wishlist
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>

            {/* Cart */}
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
              <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                Cart
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>

            {/* Account */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium">Hello, Sign in</div>
                  <div className="text-xs text-gray-600">Account & Orders</div>
                </div>
                <ChevronDown className="hidden lg:block w-4 h-4" />
              </button>
              
              {/* Account Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="mb-4">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition">
                      Sign in
                    </button>
                  </div>
                  <div className="space-y-3">
                    <a href="#" className="block hover:text-purple-600 transition">Your Orders</a>
                    <a href="#" className="block hover:text-purple-600 transition">Your Measurements</a>
                    <a href="#" className="block hover:text-purple-600 transition">Saved Tailors</a>
                    <a href="#" className="block hover:text-purple-600 transition">Account Settings</a>
                    <hr className="my-2" />
                    <a href="#" className="block hover:text-purple-600 transition">Become a Seller</a>
                    <a href="#" className="block hover:text-purple-600 transition">Help Center</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search on DATLEP..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {/* Mobile Location & Mode */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-sm">{currentLocation}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMode('marketplace')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${activeMode === 'marketplace' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600'}`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveMode('bespoke')}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${activeMode === 'bespoke' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-100 text-gray-600'}`}
              >
                <BespokeIcon className="w-3 h-3 mr-1" />
                Bespoke
              </button>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="hidden lg:flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Fashion</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Tailors</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Shoemakers</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Fabrics</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Thrift Stores</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Repair Services</a>
            <a href="#" className="text-purple-600 font-medium flex items-center">
              <BespokeIcon className="w-4 h-4 mr-1" />
              Custom Orders
            </a>
          </div>
          <div className="text-sm text-gray-600">
            {activeMode === 'bespoke' ? '✨ Book a tailor today!' : '🎉 New arrivals daily!'}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="space-y-4">
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Fashion</a>
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Tailors</a>
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Shoemakers</a>
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Fabrics</a>
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Thrift Stores</a>
              <a href="#" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Repair Services</a>
              <div className="pt-4 border-t">
                <a href="#" className="block text-gray-700 hover:text-purple-600 py-2">Your Orders</a>
                <a href="#" className="block text-gray-700 hover:text-purple-600 py-2">Wishlist</a>
                <a href="#" className="block text-gray-700 hover:text-purple-600 py-2">Compare Items</a>
                <a href="#" className="block text-gray-700 hover:text-purple-600 py-2">Account</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;