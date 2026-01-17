"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, ShoppingCart, User, Menu, X, Bell, HelpCircle, Tag, Truck, Shield } from 'lucide-react';
import ChartIcon from '../../assets/svgs/ChartIcon';
import WishlistIcon from '../../assets/svgs/WishlistIcon';
import BespokeIcon from '../../assets/svgs/BespokeIcon';
import HeaderCategories from './header-button';
import logo from '../../assets/images/datlep-logo.png';
import Link from 'next/link';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'marketplace' | 'bespoke'>('marketplace');
  const [cartItems] = useState(3);
  const [wishlistItems] = useState(5);
  const [chartItems] = useState(2);
  const [currentLocation, setCurrentLocation] = useState('Lagos, Nigeria');
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const headerRef = React.useRef<HTMLElement>(null);

  // Login routes for different scenarios
  const loginRoutes = {
    // Main login page
    mainLogin: '/login',
    // Alternative login pages
    customerLogin: '/auth/customer/login',
    tailorLogin: '/auth/tailor/login',
    sellerLogin: '/auth/seller/login',
    // Social login redirects
    googleLogin: '/api/auth/google',
    facebookLogin: '/api/auth/facebook',
    // Specific flows
    loginWithReturn: '/auth/login?returnUrl=/dashboard',
    loginWithMode: '/auth/login?mode=bespoke',
    // Registration flows
    register: '/auth/register',
    registerCustomer: '/auth/register/customer',
    registerTailor: '/auth/register/tailor',
  };

  const locations = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'Accra, Ghana',
    'Nairobi, Kenya',
    'Cairo, Egypt',
    'Johannesburg, South Africa'
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > headerHeight * 0.8) {
            setShowCompactHeader(true);
          } else {
            setShowCompactHeader(false);
          }
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsScrolled(true);
          } else if (currentScrollY < lastScrollY) {
            setIsScrolled(false);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [headerHeight]);

  // Account dropdown content (updated without gradient)
  const AccountDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="p-5">
        <div className="mb-4">
          <Link href={loginRoutes.mainLogin} className="w-full block">
            <button className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition shadow-sm">
              Sign in / Register
            </button>
          </Link>
        </div>
        <div className="space-y-3">
          <Link href={loginRoutes.customerLogin} className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">
            Customer Login
          </Link>
          <Link href={loginRoutes.tailorLogin} className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">
            Tailor Login
          </Link>
          <Link href={loginRoutes.sellerLogin} className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">
            Seller Login
          </Link>
          <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">Your Orders</Link>
          <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">Your Measurements</Link>
          <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">Saved Tailors</Link>
          <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium transition py-2 hover:bg-blue-50 px-2 rounded">Account Settings</Link>
          <hr className="my-3 border-gray-200" />
          <Link href={loginRoutes.registerTailor} className="block text-blue-900 font-semibold transition py-2 hover:bg-blue-50 px-2 rounded">
            Become a Seller
          </Link>
          <Link href="#" className="block text-blue-900 font-semibold transition py-2 hover:bg-blue-50 px-2 rounded">Help Center</Link>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Quick login with:</div>
          <div className="flex space-x-2">
            <Link href={loginRoutes.googleLogin} className="flex-1">
              <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-xs py-2 px-3 rounded-lg font-medium transition">
                Google
              </button>
            </Link>
            <Link href={loginRoutes.facebookLogin} className="flex-1">
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-2 px-3 rounded-lg font-medium transition">
                Facebook
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Location dropdown component
  const LocationDropdown = ({ isCompact = false }: { isCompact?: boolean }) => (
    <div className={`absolute ${isCompact ? 'top-full left-0 mt-2' : 'top-full left-0 mt-2'} w-72 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Select Your Location</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setCurrentLocation(location)}
              className={`w-full text-left px-4 py-3 rounded-md transition flex items-center ${currentLocation === location 
                ? 'bg-blue-50 text-blue-900 border-l-4 border-amber-500' 
                : 'hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'}`}
            >
              <MapPin className="w-4 h-4 mr-3 text-gray-500" />
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile Menu Component
  const MobileMenu = () => (
    <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-medium">Verified Tailors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium">Free Delivery</span>
            </div>
          </div>
          
          {/* Mobile Categories Button */}
          <div className="mb-4">
            <HeaderCategories activeMode={activeMode} isCompact={true} />
          </div>
          
          {/* Location selection in mobile menu */}
          <div className="pt-6 border-t mt-6">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Change Location</h4>
              <div className="space-y-2">
                {locations.slice(0, 4).map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setCurrentLocation(location);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-md transition flex items-center ${currentLocation === location 
                      ? 'bg-blue-50 text-blue-900 border-l-4 border-amber-500' 
                      : 'hover:bg-gray-50'}`}
                  >
                    <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                    {location}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile login buttons */}
            <div className="space-y-2 mb-4">
              <Link href={loginRoutes.mainLogin} className="block w-full">
                <button className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition">
                  Sign in / Register
                </button>
              </Link>
              <Link href={loginRoutes.customerLogin} className="block">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition">
                  Customer Login
                </button>
              </Link>
              <Link href={loginRoutes.tailorLogin} className="block">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition">
                  Tailor Login
                </button>
              </Link>
            </div>
            
            <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium py-3 px-4 hover:bg-blue-50 rounded-lg transition">Your Orders</Link>
            <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium py-3 px-4 hover:bg-blue-50 rounded-lg transition">Wishlist</Link>
            <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium py-3 px-4 hover:bg-blue-50 rounded-lg transition">Compare Items</Link>
            <Link href="#" className="block text-gray-700 hover:text-blue-900 font-medium py-3 px-4 hover:bg-blue-50 rounded-lg transition">Account</Link>
            <div className="flex space-x-3 mt-4">
              <select className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="sw">Swahili</option>
              </select>
              <select className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="ngn">NGN</option>
                <option value="usd">USD</option>
                <option value="ghs">GHS</option>
              </select>
            </div>
            <div className="mt-4">
              <Link href={loginRoutes.registerTailor} className="block text-center text-blue-900 font-semibold py-2.5 px-4 hover:bg-blue-50 rounded-lg transition border border-blue-200">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main header component
  const MainHeader = () => (
    <header ref={headerRef} className="relative bg-white shadow-lg border-b border-gray-200">
      {/* Top Navigation - ONLY this has gradient */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-600 text-white py-2 px-4">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <span className="flex items-center">
              <Bell className="w-4 h-4 mr-2 text-amber-300" />
              New: Custom Tailoring in 7 Days!
            </span>
            <span className="hidden md:flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-amber-300" />
              Need help? Chat with us
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href={loginRoutes.sellerLogin}>
              <button className="hover:text-amber-300 transition text-sm font-medium">Sell on DATLEP</button>
            </Link>
            <Link href={loginRoutes.registerTailor}>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded-md transition font-medium">
                Become a Creator
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - First Row */}
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="relative w-12 h-12">
                  <Image
                    src={logo}
                    alt="DATLEP Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link href="/">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-600 bg-clip-text text-transparent">
                    DATLEP
                  </span>
                </Link>
                <span className="text-xs text-gray-500 hidden md:block">Craftsmanship Meets Technology</span>
              </div>
            </div>

            {/* Mode Switch - No gradients */}
            <div className="hidden lg:flex items-center space-x-2 ml-8">
              <button
                onClick={() => setActiveMode('marketplace')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center ${activeMode === 'marketplace' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Marketplace
              </button>
              <Link href={loginRoutes.loginWithMode}>
                <button
                  onClick={() => setActiveMode('bespoke')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center ${activeMode === 'bespoke' 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <BespokeIcon className="w-5 h-5 mr-2" />
                  Bespoke
                </button>
              </Link>
            </div>
          </div>

          {/* Categories Dropdown (Desktop) */}
          <div className="hidden lg:flex mx-6">
            <HeaderCategories activeMode={activeMode} />
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-5 lg:space-x-6">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition p-2">
                  <Tag className="w-4 h-4" />
                  <span>Deals</span>
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="relative group">
              <button className="p-3 rounded-xl hover:bg-blue-50 transition relative border border-transparent hover:border-blue-100">
                <ChartIcon className="w-7 h-7 text-blue-800" />
                {chartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {chartItems}
                  </span>
                )}
              </button>
            </div>

            {/* Wishlist */}
            <div className="relative group hidden lg:block">
              <button className="p-3 rounded-xl hover:bg-blue-50 transition relative border border-transparent hover:border-blue-100">
                <WishlistIcon className="w-7 h-7 text-blue-800" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {wishlistItems}
                  </span>
                )}
              </button>
            </div>

            {/* Cart - Updated without gradient */}
            <div className="relative group">
              <button className="p-3 rounded-xl hover:bg-blue-50 transition relative border border-transparent hover:border-blue-100">
                <ShoppingCart className="w-7 h-7 text-blue-800" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>

            {/* Account - Updated without gradient */}
            <div className="relative group">
              <Link href={loginRoutes.mainLogin}>
                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-blue-50 transition">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-semibold text-blue-900">Hello, Sign in</div>
                    <div className="text-xs text-gray-600">Account & Orders</div>
                  </div>
                </button>
              </Link>
              <AccountDropdown />
            </div>
          </div>
        </div>

        {/* Second Row - Search Bar with Features */}
        <div className="hidden lg:flex items-center justify-between py-3 border-t border-gray-100">
          {/* Features */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Shield className="w-5 h-5 text-blue-700" />
              <span>Verified Tailors</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Truck className="w-5 h-5 text-amber-600" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Tag className="w-5 h-5 text-red-500" />
              <span>Flash Sales</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`Search for ${activeMode === 'bespoke' ? 'tailors, fabrics, measurements...' : 'fashion, thrift stores, repair...'}`}
                className="w-full px-6 py-3.5 pl-14 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-base placeholder-gray-500"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white px-8 py-2.5 rounded-lg hover:bg-blue-800 transition font-medium text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Language/Currency */}
          <div className="flex items-center space-x-4">
            <select className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="sw">SW</option>
            </select>
            <select className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="ngn">₦ NGN</option>
              <option value="usd">$ USD</option>
              <option value="ghs">₵ GHS</option>
              <option value="kes">KSh KES</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar & Location */}
      <div className="lg:hidden px-4 pb-4">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search on DATLEP..."
            className="w-full px-5 py-4 pl-14 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-base"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition font-medium">
            Go
          </button>
        </div>
        
        {/* Mobile Location & Mode */}
        <div className="flex items-center justify-between">
          <div className="relative group">
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition">
              <MapPin className="w-5 h-5 text-blue-700" />
              <span className="font-semibold text-sm text-blue-900">{currentLocation}</span>
              <ChevronDown className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveMode('marketplace')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeMode === 'marketplace' 
                ? 'bg-blue-900 text-white' 
                : 'bg-gray-100 text-gray-700'}`}
            >
              Marketplace
            </button>
            <Link href={loginRoutes.loginWithMode}>
              <button
                onClick={() => setActiveMode('bespoke')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeMode === 'bespoke' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700'}`}
              >
                <BespokeIcon className="w-4 h-4 mr-1" />
                Bespoke
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <MobileMenu />}
    </header>
  );

  // Compact header for desktop
  const DesktopCompactHeader = () => (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 transition-transform duration-300 ${
      isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Mode Switch - Compact */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="relative w-10 h-10">
                <Image
                  src={logo}
                  alt="DATLEP Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-amber-600 bg-clip-text text-transparent">
                DATLEP
              </span>
            </Link>
            
            {/* Categories in Compact Header */}
            <div className="hidden lg:block">
              <HeaderCategories activeMode={activeMode} isCompact={true} />
            </div>
            
            {/* Mode Switch - Compact */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => setActiveMode('marketplace')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center ${activeMode === 'marketplace' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Marketplace
              </button>
              <Link href={loginRoutes.loginWithMode}>
                <button
                  onClick={() => setActiveMode('bespoke')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center ${activeMode === 'bespoke' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <BespokeIcon className="w-4 h-4 mr-1" />
                  Bespoke
                </button>
              </Link>
            </div>
          </div>

          {/* Search Bar - Compact */}
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeMode === 'bespoke' ? 'tailors...' : 'fashion...'}`}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white px-4 py-1.5 rounded-md hover:bg-blue-800 transition text-xs font-medium">
                Search
              </button>
            </div>
          </div>

          {/* Quick Actions - Compact */}
          <div className="flex items-center space-x-4">
            {/* Quick Features */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-xs font-medium text-gray-700">
                <Shield className="w-4 h-4 text-blue-700" />
                <span className="hidden xl:inline">Verified</span>
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-gray-700">
                <Tag className="w-4 h-4 text-red-500" />
                <span className="hidden xl:inline">Deals</span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative group">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition relative">
                <ChartIcon className="w-5 h-5 text-blue-800" />
                {chartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {chartItems}
                  </span>
                )}
              </button>
            </div>

            {/* Wishlist */}
            <div className="relative group">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition relative">
                <WishlistIcon className="w-5 h-5 text-blue-800" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {wishlistItems}
                  </span>
                )}
              </button>
            </div>

            {/* Cart - Updated without gradient */}
            <div className="relative group">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition relative">
                <ShoppingCart className="w-5 h-5 text-blue-800" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>

            {/* Account - Compact with Dropdown */}
            <div className="relative group">
              <Link href={loginRoutes.mainLogin}>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition">
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </Link>
              <AccountDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Mobile Compact Header
  const MobileCompactHeader = () => (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 transition-transform duration-300 ${
      isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="px-4">
        <div className="flex items-center justify-between py-3">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/">
              <div className="relative w-8 h-8">
                <Image
                  src={logo}
                  alt="DATLEP Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </Link>
            <Link href="/">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-900 to-amber-600 bg-clip-text text-transparent">
                DATLEP
              </span>
            </Link>
          </div>

          {/* Mobile Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Mode Indicator */}
            <div className={`px-2 py-1 rounded-md text-xs font-semibold ${activeMode === 'marketplace' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'}`}>
              {activeMode === 'marketplace' ? 'Market' : 'Bespoke'}
            </div>

            {/* Search Button */}
            <button className="p-2 hover:bg-blue-50 rounded-lg transition">
              <Search className="w-5 h-5 text-blue-800" />
            </button>

            {/* Cart - Updated without gradient */}
            <div className="relative">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition relative">
                <ShoppingCart className="w-5 h-5 text-blue-800" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>
            
            {/* Quick login button in compact mobile header */}
            <Link href={loginRoutes.mainLogin}>
              <button className="p-2 hover:bg-blue-50 rounded-lg transition">
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <>
      <MainHeader />
      {showCompactHeader && (
        <>
          {isMobile ? <MobileCompactHeader /> : <DesktopCompactHeader />}
        </>
      )}
    </>
  );
}

export default Header;