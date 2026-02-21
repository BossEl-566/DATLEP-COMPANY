// app/product/[slug]/components/DeliveryReturns.tsx
'use client';

import React from 'react';
import { Truck, Shield, Clock, CreditCard, RotateCcw, Package } from 'lucide-react';

interface DeliveryReturnsProps {
  cashOnDelivery: boolean;
  shopLocation: string;
}

const DeliveryReturns: React.FC<DeliveryReturnsProps> = ({ 
  cashOnDelivery, 
  shopLocation 
}) => {
  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders over GH₵200',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Clock,
      title: 'Delivery Time',
      description: '2-5 business days',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your data is protected',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7-day return policy',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Delivery Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-start gap-2">
              <div className={`p-2 rounded-lg ${feature.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">{feature.title}</div>
                <div className="text-xs text-gray-500">{feature.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Payment:</span>
          </div>
          <div className="flex items-center gap-2">
            {cashOnDelivery && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Cash on Delivery
              </span>
            )}
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Mobile Money
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
              Card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReturns;