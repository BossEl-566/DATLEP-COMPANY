'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Static hero images for fashion marketplace
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: "New Season Collection",
      subtitle: "Discover the latest fashion trends for 2024",
      cta: "Shop Now",
      color: "from-purple-600 to-pink-600",
      badge: "New Arrivals"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "Summer Sale Up to 50% Off",
      subtitle: "Refresh your wardrobe with amazing discounts",
      cta: "View Deals",
      color: "from-orange-500 to-red-500",
      badge: "Sale"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
      title: "Premium African Fashion",
      subtitle: "Traditional & Contemporary Styles",
      cta: "Explore Collection",
      color: "from-emerald-600 to-teal-600",
      badge: "Featured"
    }
  ];

  // Auto slide every 5 seconds
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

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-[500px] md:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentSlideData.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-lg text-white"
              >
                {/* Badge */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${currentSlideData.color} bg-gradient-to-r mb-6`}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">{currentSlideData.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {currentSlideData.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-200 mb-8">
                  {currentSlideData.subtitle}
                </p>

                {/* CTA Button */}
                <button className={`px-8 py-3 ${currentSlideData.color} bg-gradient-to-r text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg flex items-center`}>
                  {currentSlideData.cta}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Price</h3>
                <p className="text-sm text-gray-600">Price match guarantee</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                <p className="text-sm text-gray-600">Handpicked fashion items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;