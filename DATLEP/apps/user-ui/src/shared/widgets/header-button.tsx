"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Grid, Building, ShoppingBag, Tag } from 'lucide-react';
import BespokeIcon from '../../assets/svgs/BespokeIcon';
import { CATEGORIES, getTypeIcon, getTypeColor} from '../../configs/constants';

interface HeaderCategoriesProps {
  activeMode: 'marketplace' | 'bespoke';
  isCompact?: boolean;
}

function HeaderCategories({ activeMode, isCompact = false }: HeaderCategoriesProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // Desktop Sidebar Component
  const DesktopCategoriesSidebar = () => (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsCategoriesOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="absolute inset-y-0 left-0 w-[600px] bg-white shadow-2xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Browse All Categories</h2>
              <button 
                onClick={() => setIsCategoriesOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${activeMode === 'bespoke' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {activeMode === 'bespoke' ? 'Bespoke Mode' : 'Marketplace Mode'}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>{CATEGORIES.reduce((sum, cat) => sum + cat.totalShops, 0)} shops</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span>{CATEGORIES.reduce((sum, cat) => sum + cat.totalProducts, 0)} products</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span>{CATEGORIES.reduce((sum, cat) => sum + cat.totalOffers, 0)} offers</span>
                  </span>
                </div>
              </div>
              <Link 
                href="/categories"
                className="text-sm text-blue-700 font-medium hover:text-blue-900 transition"
                onClick={() => setIsCategoriesOpen(false)}
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <Link 
                  key={category.id}
                  href={category.mainHref}
                  className={`group relative p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer ${
                    activeCategory === category.id ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setIsCategoriesOpen(false);
                  }}
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
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                          {category.totalShops > 0 && (
                            <span className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{category.totalShops}</span>
                            </span>
                          )}
                          {category.totalProducts > 0 && (
                            <span className="flex items-center space-x-1">
                              <ShoppingBag className="w-3 h-3" />
                              <span>{category.totalProducts}</span>
                            </span>
                          )}
                          {category.totalOffers > 0 && (
                            <span className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>{category.totalOffers}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {category.subcategories.slice(0, 2).map((sub) => {
                            const TypeIcon = getTypeIcon(sub.type);
                            return (
                              <Link 
                                key={sub.id}
                                href={sub.href}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCategoriesOpen(false);
                                }}
                              >
                                <TypeIcon className="w-3 h-3" />
                                <span>{sub.name}</span>
                                {sub.count && sub.count > 0 && (
                                  <span className="text-gray-500">({sub.count})</span>
                                )}
                              </Link>
                            );
                          })}
                          {category.subcategories.length > 2 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{category.subcategories.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer with Custom Orders */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-900 to-amber-600 rounded-xl">
                  <BespokeIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Need something custom?</p>
                  <p className="text-sm text-gray-600">Get anything made to your specifications</p>
                </div>
              </div>
              <Link 
                href="/bespoke/start-order"
                className="px-6 py-3 bg-gradient-to-r from-blue-900 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                onClick={() => setIsCategoriesOpen(false)}
              >
                Start Order
              </Link>
            </div>
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
            {CATEGORIES.map((category) => (
              <div key={category.id} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition">
                <Link 
                  href={category.mainHref}
                  className="flex items-center justify-between"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                        {category.totalShops > 0 && (
                          <span className="flex items-center space-x-1">
                            <Building className="w-3 h-3" />
                            <span>{category.totalShops}</span>
                          </span>
                        )}
                        {category.totalProducts > 0 && (
                          <span className="flex items-center space-x-1">
                            <ShoppingBag className="w-3 h-3" />
                            <span>{category.totalProducts}</span>
                          </span>
                        )}
                        {category.totalOffers > 0 && (
                          <span className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{category.totalOffers}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                
                {category.trending && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full">
                      Trending
                    </span>
                  </div>
                )}
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {category.subcategories.slice(0, 4).map((sub) => {
                    const TypeIcon = getTypeIcon(sub.type);
                    return (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${getTypeColor(sub.type)}`}
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <TypeIcon className="w-3 h-3" />
                        <span>{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
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
            <Link 
              href="/bespoke/start-order"
              className="block w-full py-3 bg-gradient-to-r from-blue-900 to-amber-600 text-white rounded-lg font-semibold text-center"
              onClick={() => setIsCategoriesOpen(false)}
            >
              Start Custom Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Categories Button */}
      {!isCompact && (
        <div className="relative">
          <button 
            onClick={() => setIsCategoriesOpen(true)}
            className="flex items-center space-x-3 px-5 py-3.5 bg-white hover:bg-blue-50 rounded-xl border border-gray-300 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Grid className="w-5 h-5 text-blue-700" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Categories</div>
              <div className="text-xs text-gray-600">Browse all services</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
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
      
      {/* Desktop Sidebar */}
      {isCategoriesOpen && !isCompact && <DesktopCategoriesSidebar />}
      
      {/* Mobile Sidebar */}
      {isCategoriesOpen && isCompact && <MobileCategoriesSidebar />}
    </>
  );
}

export default HeaderCategories;