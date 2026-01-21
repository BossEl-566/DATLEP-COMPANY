'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Save, Plus, Upload, AlertCircle, Check } from 'lucide-react';
import SelectImage from '../../../../shared/components/product/SelectImage';
import SelectColors from '../../../../shared/components/product/SelectColors';
import DetailedDescription from '../../../../shared/components/product/DetailedDescription';
import SelectSizes from '../../../../shared/components/product/SelectSizes';
import CustomSpecifications from '../../../../shared/components/product/CustomSpecifications';
import { createProduct } from '../../../actions/product.actions';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type FormData = {
  title: string;
  shortDescription: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  warranty: string;
  tags: string[];
  regularPrice: number;
  sellPrice: number;
  stock: number;
  discountCode: string;
  youtubeLink: string;
  images: string[];
  colors: string[];
  sizes: string[];
  specifications: Record<string, string>;
  description: string;
};

export default function CreateProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      warranty: 'none',
      tags: [],
      images: [],
      colors: [],
      sizes: [],
      specifications: {},
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [title, setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/api/get-category`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = watch('category');

  // Update subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/product/api/get-category`);
        const subCats = response.data.subCategories[selectedCategory] || [];
        setSubCategories(subCats);
        setValue('subCategory', ''); // Reset subcategory when category changes
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    
    fetchSubCategories();
  }, [selectedCategory, setValue]);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      alert('Product created successfully!');
      // Reset form or redirect
    },
    onError: (error) => {
      alert(`Error creating product: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  const saveAsDraft = () => {
    // Handle draft save logic
    alert('Saved as draft');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Product
          </h1>
          <p className="text-gray-600">
            Fill in the details to add a new product to DATLEP marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1 space-y-8">
              <SelectImage
                onImagesChange={(images) => setValue('images', images)}
                maxImages={5}
                requiredRatio="765x850"
                onImageEdit={(image) => {
                  // Open edit modal
                }}
              />
            </div>

            {/* Middle Column - Basic Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Title */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Product Information
                </h2>
                
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      {...register('title', { required: 'Product title is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Premium Cotton Ankara Dress"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">datlep.com/products/</span>
                      <input
                        {...register('slug', { required: 'Slug is required' })}
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="premium-cotton-ankara-dress"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Auto-generated from title. You can edit if needed.
                    </p>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                      <span className="text-gray-400 text-sm font-normal ml-2">
                        (Max 150 words)
                      </span>
                    </label>
                    <textarea
                      {...register('shortDescription', {
                        required: 'Short description is required',
                        maxLength: {
                          value: 1500,
                          message: 'Maximum 150 words allowed',
                        },
                      })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your product..."
                    />
                    {errors.shortDescription && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.shortDescription.message}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add tags (press Enter after each)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (value && !field.value.includes(value)) {
                                  field.onChange([...field.value, value]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(
                                      field.value.filter((_, i) => i !== index)
                                    );
                                  }}
                                  className="hover:text-blue-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Category & Brand
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory *
                    </label>
                    <select
                      {...register('subCategory', { required: 'Subcategory is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedCategory}
                    >
                      <option value="">Select a subcategory</option>
                      {subCategories.map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                    </select>
                    {errors.subCategory && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.subCategory.message}
                      </p>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      {...register('brand', { required: 'Brand is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter brand name"
                    />
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  {/* Warranty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warranty
                    </label>
                    <select
                      {...register('warranty')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="none">No Warranty</option>
                      <option value="1-month">1 Month</option>
                      <option value="3-months">3 Months</option>
                      <option value="6-months">6 Months</option>
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colors Component */}
          <SelectColors
            onColorsChange={(colors) => setValue('colors', colors)}
            initialColors={['#000000', '#FFFFFF', '#FF6B35', '#004E89']}
          />

          {/* Custom Specifications */}
          <CustomSpecifications
            onSpecificationsChange={(specs) => setValue('specifications', specs)}
          />

          {/* Detailed Description */}
          <DetailedDescription
            onDescriptionChange={(desc) => setValue('description', desc)}
            minWords={100}
          />

          {/* YouTube Video Embed */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Video Demonstration
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video Link
              </label>
              <input
                {...register('youtubeLink', {
                  pattern: {
                    value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'Please enter a valid YouTube URL',
                  },
                })}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.youtubeLink && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.youtubeLink.message}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Regular Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    {...register('regularPrice', {
                      required: 'Regular price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {errors.regularPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.regularPrice.message}
                  </p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    {...register('sellPrice', {
                      required: 'Selling price is required',
                      min: { value: 0, message: 'Price must be positive' },
                      validate: (value) => {
                        const regularPrice = watch('regularPrice');
                        return value <= regularPrice || 'Selling price cannot exceed regular price';
                      },
                    })}
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {errors.sellPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.sellPrice.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  {...register('stock', {
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Discount Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code
                </label>
                <input
                  {...register('discountCode')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SUMMER20"
                />
              </div>
            </div>
          </div>

          {/* Sizes Component */}
          <SelectSizes
            onSizesChange={(sizes) => setValue('sizes', sizes)}
            availableSizes={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom']}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={saveAsDraft}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}