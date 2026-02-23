// app/components/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 mb-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay in the Loop</h2>
            <p className="text-purple-100">
              Subscribe to get updates on new arrivals, exclusive offers, and fashion tips
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Success Message */}
        {subscribed && (
          <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Successfully subscribed to newsletter!</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;