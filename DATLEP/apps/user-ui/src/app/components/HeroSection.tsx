// app/components/HeroSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Truck, Shield, Clock, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: "New Season Collection",
      subtitle: "Discover the latest fashion trends",
      cta: "Shop Now",
      link: "/products?sortBy=newest",
      color: "from-purple-600 to-pink-600",
      badge: "NEW ARRIVALS"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "Summer Sale",
      subtitle: "Up to 50% off on selected items",
      cta: "View Deals",
      link: "/products?sale=true",
      color: "from-orange-500 to-red-500",
      badge: "FLASH SALE"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
      title: "African Fashion Week",
      subtitle: "Traditional & Contemporary Styles",
      cta: "Explore",
      link: "/category/african-fashion",
      color: "from-emerald-600 to-teal-600",
      badge: "FEATURED"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative">
      {/* Main Carousel */}
      <div className="relative h-[500px] md:h-[600px] bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-white"
              >
                {/* Badge */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${heroSlides[currentSlide].color} mb-6`}>
                  <Gift className="w-4 h-4 mr-2" />
                  <span className="text-sm font-bold tracking-wider">{heroSlides[currentSlide].badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-200 mb-8">
                  {heroSlides[currentSlide].subtitle}
                </p>

                {/* CTA Button */}
                <Link
                  href={heroSlides[currentSlide].link}
                  className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${heroSlides[currentSlide].color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xl`}
                >
                  {heroSlides[currentSlide].cta}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Links Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-3 gap-6">
            <Link href="/category/women" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Women's Fashion
            </Link>
            <Link href="/category/men" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Men's Fashion
            </Link>
            <Link href="/category/kids" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Kids
            </Link>
            <Link href="/category/shoes" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Shoes
            </Link>
            <Link href="/category/bags" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Bags
            </Link>
            <Link href="/category/accessories" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Accessories
            </Link>
            <Link href="/category/traditional" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              Traditional Wear
            </Link>
            <Link href="/category/african-prints" className="text-sm font-medium text-gray-700 hover:text-purple-600 whitespace-nowrap">
              African Prints
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;