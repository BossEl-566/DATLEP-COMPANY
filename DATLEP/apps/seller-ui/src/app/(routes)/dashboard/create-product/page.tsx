'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertCircle, Check, Percent, ArrowRight, Tag, DollarSign, Calendar, Hash } from 'lucide-react';
import SelectImage from '../../../../shared/components/product/SelectImage';
import SelectColors from '../../../../shared/components/product/SelectColors';
import DetailedDescription from '../../../../shared/components/product/DetailedDescription';
import SelectSizes from '../../../../shared/components/product/SelectSizes';
import CustomSpecifications from '../../../../shared/components/product/CustomSpecifications';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProduct } from '../../../actions/product.actions';



const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type ProductImage = {
  url: string;
  fileId: string;
  format?: string;
  size?: number;
};

type FormData = {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  warranty: {
    duration: string;
    type: string;
    details?: string;
  };
  tags: string[];
  regularPrice: number;
  salePrice: number;
  stock: number;
  discountCode: string;
  youtubeLink: string;
  image: ProductImage; // Main image as object
  gallery: ProductImage[]; // Gallery images as array of objects
  colors: string[];
  sizes: string[];
  specifications: Record<string, string>;
  customProperties: Array<{ key: string; value: string; label?: string }>;
  cashOnDelivery: boolean;
  
  // New fields from model
  startingDate?: string;
  endingDate?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch' | 'm';
  };
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    requiresShipping: boolean;
    shippingClass?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  featured: boolean;
  featuredUntil?: string;
};

interface DiscountCode {
  _id: string;
  public_name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountCode: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(null);
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [showSEODetails, setShowSEODetails] = useState(false);
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    // getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      warranty: { duration: 'none', type: 'none' },
      tags: [],
      gallery: [],
      colors: [],
      sizes: [],
      specifications: {},
      customProperties: [],
      discountCode: '',
      regularPrice: 0,
      salePrice: 0,
      cashOnDelivery: true,
      featured: false,
      shipping: {
        requiresShipping: true,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
      },
      dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
    },
  });

  // Handle images from SelectImage component
  const handleImagesChange = (images: ProductImage[]) => {
    if (images.length > 0) {
      // First image is the main image
      const mainImg = images[0];
      setMainImage(mainImg);
      setValue('image', mainImg);
      
      // Rest are gallery images
      const gallery = images.slice(1);
      setGalleryImages(gallery);
      setValue('gallery', gallery);
    } else {
      setMainImage(null);
      setGalleryImages([]);
      setValue('image', null as any);
      setValue('gallery', []);
    }
  };

  // Fetch active discount codes
  const { 
    data: discounts = [], 
    isLoading: discountsLoading,
    error: discountsError 
  } = useQuery<DiscountCode[]>({
    queryKey: ['activeDiscountCodes'],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/product/api/get-discount-code`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Filter only active and non-expired discounts
        const now = new Date();
        return response.data.filter((discount: DiscountCode) => {
          const isExpired = discount.expiresAt ? new Date(discount.expiresAt) < now : false;
          return discount.isActive && !isExpired;
        });
      } catch (error) {
        console.error('Error fetching discount codes:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
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
  const regularPrice = watch('regularPrice') || 0;
  const salePrice = watch('salePrice') || 0;
  const discountCodeValue = watch('discountCode');
  // const startingDate = watch('startingDate');
  // const endingDate = watch('endingDate');
  const imageValue = watch('image');

  // Update sale price when discount is applied
  useEffect(() => {
    if (selectedDiscount && regularPrice > 0) {
      let discountedPrice = parseFloat(regularPrice.toString());
      
      if (selectedDiscount.discountType === 'percentage') {
        discountedPrice = regularPrice * (1 - selectedDiscount.discountValue / 100);
      } else if (selectedDiscount.discountType === 'fixed') {
        discountedPrice = Math.max(0, regularPrice - selectedDiscount.discountValue);
      }
      
      setValue('salePrice', parseFloat(discountedPrice.toFixed(2)));
    }
  }, [selectedDiscount, regularPrice, setValue]);

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
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
    },
    onError: (error) => {
      alert(`Error creating product: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Transform data to match backend expectations
      const productData = {
        ...data,
        // Ensure image is an object with fileId and url
        image: data.image,
        // Ensure gallery is array of objects with fileId and url
        gallery: data.gallery || [],
        // Transform sizes array to match model
        sizes: data.sizes.map(size => ({
          size,
          description: size,
          available: true,
          stock: data.stock
        })),
        // Transform colors array to match model
        colors: data.colors.map(color => ({
          name: color,
          hexCode: color,
          available: true
        })),
        // Set default ratings
        ratings: {
          average: 0,
          count: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      };

      await mutation.mutateAsync(productData);
    } finally {
      setLoading(false);
    }
  };

  const saveAsDraft = () => {
    // Handle draft save logic
    alert('Saved as draft');
  };

  const handleDiscountSelect = (discount: DiscountCode) => {
    setSelectedDiscount(discount);
    setValue('discountCode', discount.discountCode);
  };

  const clearDiscount = () => {
    setSelectedDiscount(null);
    setValue('discountCode', '');
    if (regularPrice > 0) {
      setValue('salePrice', regularPrice);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format price
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Calculate savings
  const calculateSavings = () => {
    const regular = parseFloat(regularPrice.toString()) || 0;
    const sale = parseFloat(salePrice.toString()) || 0;
    return regular - sale;
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
                onImagesChange={handleImagesChange}
                maxImages={5}
                requiredRatio="765x850"
                onImageEdit={(image) => {
                  // Open edit modal
                }}
              />
              
              {/* Image Preview Section */}
              {mainImage && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Image Preview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Main Image</p>
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={mainImage.url} 
                          alt="Main product" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>File ID: {mainImage.fileId}</p>
                        {mainImage.format && <p>Format: {mainImage.format}</p>}
                        {mainImage.size && <p>Size: {Math.round(mainImage.size / 1024)} KB</p>}
                      </div>
                    </div>
                    
                    {galleryImages.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Gallery Images ({galleryImages.length})
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {galleryImages.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded overflow-hidden border border-gray-200">
                              <img 
                                src={img.url} 
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                {index + 2}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            onDescriptionChange={(desc) => setValue('detailedDescription', desc)}
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

          {/* Inventory & Product Codes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Inventory & Product Codes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('sku')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PROD-001"
                  />
                </div>
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode / ISBN
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('barcode')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789012"
                  />
                </div>
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
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  defaultValue={0}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    {...register('weight', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pricing
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
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    defaultValue={0}
                  />
                </div>
                {errors.regularPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.regularPrice.message}
                  </p>
                )}
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    {...register('salePrice', {
                      min: { value: 0, message: 'Price must be positive' },
                      valueAsNumber: true,
                      validate: (value) => {
                        if (value && value > 0) {
                          const regularPriceVal = parseFloat(regularPrice.toString()) || 0;
                          const salePriceVal = parseFloat(value.toString()) || 0;
                          return salePriceVal <= regularPriceVal || 'Sale price cannot exceed regular price';
                        }
                        return true;
                      },
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    defaultValue={0}
                  />
                </div>
                {errors.salePrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.salePrice.message}
                  </p>
                )}
              </div>

              {/* Discount Code */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply Discount Code
                </label>
                
                {discountsLoading ? (
                  <div className="flex items-center justify-center py-3 border border-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading discounts...</span>
                  </div>
                ) : discountsError ? (
                  <div className="text-center py-3 border border-red-300 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">Failed to load discounts</p>
                  </div>
                ) : discounts.length === 0 ? (
                  <div className="text-center py-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Percent size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">No active discounts</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Create discounts to apply to your products
                    </p>
                    <a
                      href="/dashboard/discount-code"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Go to Discounts
                      <ArrowRight size={14} />
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <select
                          {...register('discountCode')}
                          onChange={(e) => {
                            const selected = discounts.find(d => d.discountCode === e.target.value);
                            if (selected) {
                              handleDiscountSelect(selected);
                            } else {
                              clearDiscount();
                            }
                          }}
                          value={discountCodeValue || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">No discount</option>
                          {discounts.map((discount) => (
                            <option key={discount._id} value={discount.discountCode}>
                              {discount.public_name} ({discount.discountCode})
                            </option>
                          ))}
                        </select>
                        {selectedDiscount && (
                          <button
                            type="button"
                            onClick={clearDiscount}
                            className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove discount"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      
                      {selectedDiscount && (
                        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Tag size={16} className="text-blue-600" />
                              <span className="font-medium text-blue-800">
                                {selectedDiscount.public_name}
                              </span>
                            </div>
                            <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono">
                              {selectedDiscount.discountCode}
                            </code>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Discount Type:</span>
                              <div className="flex items-center gap-1 mt-1">
                                {selectedDiscount.discountType === 'percentage' ? (
                                  <>
                                    <Percent size={12} className="text-blue-500" />
                                    <span className="font-medium">
                                      {selectedDiscount.discountValue}% off
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <DollarSign size={12} className="text-green-500" />
                                    <span className="font-medium">
                                      ₦{selectedDiscount.discountValue} off
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-600">Expires:</span>
                              <p className="font-medium mt-1">
                                {formatDate(selectedDiscount.expiresAt)}
                              </p>
                            </div>
                          </div>
                          
                          {regularPrice > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Regular Price:</span>
                                <span className="font-medium">₦{formatPrice(regularPrice)}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-gray-600">Discounted Price:</span>
                                <span className="font-medium text-green-600">
                                  ₦{formatPrice(salePrice)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-gray-600">You Save:</span>
                                <span className="font-medium text-red-600">
                                  ₦{formatPrice(calculateSavings())}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-2 text-xs text-gray-500">
                      Only active, non-expired discounts are shown
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Availability Dates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Availability Dates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('startingDate')}
                    type="datetime-local"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for immediate availability
                </p>
              </div>

              {/* Ending Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Until
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('endingDate')}
                    type="datetime-local"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for indefinite availability
                </p>
              </div>
            </div>
          </div>

          {/* Sizes Component */}
          <SelectSizes
            onSizesChange={(sizes) => setValue('sizes', sizes)}
            availableSizes={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom']}
          />

          {/* Warranty & Policies */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Warranty & Policies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Warranty Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Duration
                </label>
                <select
                  {...register('warranty.duration')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">No Warranty</option>
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year</option>
                  <option value="2-years">2 Years</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              {/* Warranty Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Type
                </label>
                <select
                  {...register('warranty.type')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">Select Type</option>
                  <option value="manufacturer">Manufacturer Warranty</option>
                  <option value="seller">Seller Warranty</option>
                  <option value="extended">Extended Warranty</option>
                  <option value="limited">Limited Warranty</option>
                </select>
              </div>

              {/* Cash on Delivery */}
              <div className="flex items-center pt-6">
                <input
                  {...register('cashOnDelivery')}
                  type="checkbox"
                  id="cashOnDelivery"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="cashOnDelivery" className="ml-2 text-sm font-medium text-gray-700">
                  Accept Cash on Delivery
                </label>
              </div>
            </div>

            {/* Warranty Details */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Details (Optional)
              </label>
              <textarea
                {...register('warranty.details')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide additional warranty details, terms, and conditions..."
              />
            </div>
          </div>

          {/* Product Dimensions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Dimensions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <div className="relative">
                  <input
                    {...register('dimensions.length', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {watch('dimensions.unit') || 'cm'}
                  </span>
                </div>
              </div>

              {/* Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width
                </label>
                <div className="relative">
                  <input
                    {...register('dimensions.width', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {watch('dimensions.unit') || 'cm'}
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <div className="relative">
                  <input
                    {...register('dimensions.height', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {watch('dimensions.unit') || 'cm'}
                  </span>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  {...register('dimensions.unit')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="inch">Inches (in)</option>
                  <option value="m">Meters (m)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Shipping Information
              </h2>
              <button
                type="button"
                onClick={() => setShowShippingDetails(!showShippingDetails)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showShippingDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  {...register('shipping.requiresShipping')}
                  type="checkbox"
                  id="requiresShipping"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="requiresShipping" className="ml-2 text-sm font-medium text-gray-700">
                  This product requires shipping
                </label>
              </div>

              {showShippingDetails && (
                <div className="mt-6 space-y-6 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Shipping Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Weight (kg)
                      </label>
                      <div className="relative">
                        <input
                          {...register('shipping.weight', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.5"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                      </div>
                    </div>

                    {/* Shipping Class */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Class
                      </label>
                      <input
                        {...register('shipping.shippingClass')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Standard, Express, etc."
                      />
                    </div>

                    {/* Shipping Dimensions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Dimensions
                      </label>
                      <div className="flex gap-2">
                        <input
                          {...register('shipping.dimensions.length', { valueAsNumber: true })}
                          type="number"
                          placeholder="L"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          {...register('shipping.dimensions.width', { valueAsNumber: true })}
                          type="number"
                          placeholder="W"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          {...register('shipping.dimensions.height', { valueAsNumber: true })}
                          type="number"
                          placeholder="H"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO & Featured Product */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                SEO & Featured Settings
              </h2>
              <button
                type="button"
                onClick={() => setShowSEODetails(!showSEODetails)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showSEODetails ? 'Hide SEO' : 'Show SEO'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Featured Product */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Mark as Featured Product
                  </label>
                </div>

                {watch('featured') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Until
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        {...register('featuredUntil')}
                        type="datetime-local"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to feature indefinitely
                    </p>
                  </div>
                )}
              </div>

              {/* SEO Fields */}
              {showSEODetails && (
                <div className="mt-6 space-y-6 border-t pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      {...register('seo.metaTitle')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      {...register('seo.metaDescription')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO description for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <Controller
                      name="seo.keywords"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add keywords (press Enter after each)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (value && !field.value?.includes(value)) {
                                  field.onChange([...(field.value || []), value]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <div className="flex flex-wrap gap-2">
                            {field.value?.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                              >
                                {keyword}
                                <button
  type="button"
  onClick={() => {
    field.onChange(
      (field.value ?? []).filter((_, i) => i !== index)
    );
  }}
  className="hover:text-green-600"
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
              )}
            </div>
          </div>

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
              disabled={loading || !imageValue}
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