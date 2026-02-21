// app/product/[slug]/components/ProductTabs.tsx
'use client';

import React, { useState } from 'react';
import { Star, Check, X } from 'lucide-react';

interface ProductTabsProps {
  detailedDescription: string;
  specifications: any[];
  reviews: {
    average: number;
    count: number;
    distribution: Record<string, number>;
  };
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  detailedDescription,
  specifications,
  reviews
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'description'
              ? 'text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Description
          {activeTab === 'description' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'specs'
              ? 'text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Specifications
          {activeTab === 'specs' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'reviews'
              ? 'text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Reviews ({reviews.count})
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: detailedDescription }}
          />
        )}

        {activeTab === 'specs' && (
          <div className="space-y-4">
            {specifications.length > 0 ? (
              specifications.map((spec, index) => (
                <div key={index} className="flex py-2 border-b last:border-0">
                  <span className="w-1/3 text-gray-600">{spec.name}</span>
                  <span className="w-2/3 text-gray-900 font-medium">{spec.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No specifications available</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Rating Summary */}
            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {reviews.average.toFixed(1)}
                </div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(reviews.average)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {reviews.count} reviews
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{star} star</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ 
                          width: `${reviews.count > 0 
                            ? (reviews.distribution[star] || 0) / reviews.count * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12">
                      {reviews.distribution[star] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="text-center text-gray-500 py-8">
              No customer reviews yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;