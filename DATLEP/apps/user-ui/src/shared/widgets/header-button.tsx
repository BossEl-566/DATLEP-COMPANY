"use client";

import React, { useState } from 'react';
import { Menu, X, ChevronRight, Grid, Scissors, Shirt, Footprints, RollerCoaster, Store, Wrench, Ruler, Sparkles, TrendingUp } from 'lucide-react';
import BespokeIcon from '../../assets/svgs/BespokeIcon';

interface HeaderCategoriesProps {
  activeMode: 'marketplace' | 'bespoke';
  isCompact?: boolean;
}

function HeaderCategories({ activeMode, isCompact = false }: HeaderCategoriesProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // Categories data
  const categories = [
    {
      id: 'fashion',
      name: 'Fashion',
      icon: Shirt,
      subcategories: ['Clothing', 'Accessories', 'Jewelry', 'Bags & Purses'],
      color: 'from-blue-500 to-cyan-400',
      trending: true
    },
    {
      id: 'tailors',
      name: 'Tailors',
      icon: Scissors,
      subcategories: ['Bespoke Tailors', 'Alterations', 'Traditional', 'Modern'],
      color: 'from-amber-500 to-orange-400',
      featured: true
    },
    {
      id: 'shoemakers',
      name: 'Shoemakers',
      icon: Footprints,
      subcategories: ['Leather Shoes', 'Sneakers', 'Sandals', 'Repairs'],
      color: 'from-emerald-500 to-green-400'
    },
    {
      id: 'fabrics',
      name: 'Fabrics',
      icon: RollerCoaster,
      subcategories: ['African Prints', 'Silk & Satin', 'Cotton', 'Designer'],
      color: 'from-purple-500 to-pink-400',
      trending: true
    },
    {
      id: 'thrift',
      name: 'Thrift Stores',
      icon: Store,
      subcategories: ['Vintage', 'Designer', 'Budget', 'Luxury'],
      color: 'from-gray-600 to-gray-400',
      sustainable: true
    },
    {
      id: 'repair',
      name: 'Repair Services',
      icon: Wrench,
      subcategories: ['Clothing Repair', 'Shoe Repair', 'Zipper Fix', 'Button Replacement'],
      color: 'from-red-500 to-rose-400'
    },
    {
      id: 'measurements',
      name: 'Measurements',
      icon: Ruler,
      subcategories: ['Virtual Fitting', 'Size Guide', 'Custom Forms', 'History'],
      color: 'from-indigo-500 to-blue-400',
      bespoke: true
    },
    {
      id: 'trending',
      name: 'Trending Now',
      icon: TrendingUp,
      subcategories: ['Seasonal', 'Popular', 'Limited Edition', 'Sale'],
      color: 'from-rose-500 to-red-400',
      hot: true
    }
  ];

  // Category Dropdown Component
  const CategoryDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Browse Categories</h3>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${activeMode === 'bespoke' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
              {activeMode === 'bespoke' ? 'Bespoke Mode' : 'Marketplace Mode'}
            </div>
            <button className="text-sm text-blue-700 font-medium hover:text-blue-900 transition">
              View All →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`group relative p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer ${
                activeCategory === category.id ? 'bg-blue-50 border-blue-300' : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      {category.trending && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full">
                          Hot
                        </span>
                      )}
                      {category.bespoke && activeMode === 'bespoke' && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Bespoke
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.subcategories.slice(0, 2).map((sub, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 2 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">+{category.subcategories.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-900 to-amber-600 rounded-lg">
                <BespokeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Custom Orders</p>
                <p className="text-sm text-gray-600">Get anything made to your specifications</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
              Start Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Categories Sidebar
  const MobileCategoriesSidebar = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
            <button 
              onClick={() => setIsCategoriesOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${activeMode === 'bespoke' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
              {activeMode === 'bespoke' ? 'Bespoke Mode' : 'Marketplace Mode'}
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                {category.trending && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full">
                      Trending
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Custom Orders Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <BespokeIcon className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-bold text-gray-900">Custom Orders</p>
                <p className="text-sm text-gray-600">Tailored just for you</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-blue-900 to-amber-600 text-white rounded-lg font-semibold">
              Start Custom Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Categories Button */}
      {!isCompact && (
        <div className="relative group">
          <button className="flex items-center space-x-3 px-5 py-3.5 bg-white hover:bg-blue-50 rounded-xl border border-gray-300 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md">
            <Grid className="w-5 h-5 text-blue-700" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Categories</div>
              <div className="text-xs text-gray-600">Browse all services</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:rotate-90 transition-transform" />
          </button>
          <CategoryDropdown />
        </div>
      )}
      
      {/* Mobile Categories Button */}
      {isCompact && (
        <button 
          onClick={() => setIsCategoriesOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-blue-50 rounded-lg border border-gray-300 transition"
        >
          <Menu className="w-5 h-5 text-blue-700" />
          <span className="font-medium text-gray-900">Categories</span>
        </button>
      )}
      
      {/* Mobile Sidebar */}
      {isCategoriesOpen && <MobileCategoriesSidebar />}
    </>
  );
}

export default HeaderCategories;