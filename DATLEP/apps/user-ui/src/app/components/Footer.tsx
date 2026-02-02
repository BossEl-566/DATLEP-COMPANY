"use client";

import React from 'react';
import { Heart, Shield, Truck, Headphones } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Features */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Secure Shopping</h3>
              <p className="text-gray-400 text-sm">100% secure payments</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Free Delivery</h3>
              <p className="text-gray-400 text-sm">Over $50 order value</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm">Dedicated customer service</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Wishlist</h3>
              <p className="text-gray-400 text-sm">Save your favorite items</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              DATLEP
            </span>
            <p className="text-gray-400 text-sm mt-2">Craftsmanship Meets Technology</p>
          </div>
          
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DATLEP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;