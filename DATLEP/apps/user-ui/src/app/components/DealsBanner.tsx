// app/components/DealsBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Tag, Zap } from 'lucide-react';

const DealsBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-12">
      <Link
        href="/products?sortBy=discount"
        className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-xl"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-24 translate-y-24"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Flash Sale</h3>
                <p className="text-white/90">Up to 70% off on selected items</p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Ends in:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white font-bold text-xl">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-white/80 text-sm ml-1">h</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white font-bold text-xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-white/80 text-sm ml-1">m</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white font-bold text-xl">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-white/80 text-sm ml-1">s</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <Tag className="w-5 h-5" />
              <span>Shop Deals</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DealsBanner;