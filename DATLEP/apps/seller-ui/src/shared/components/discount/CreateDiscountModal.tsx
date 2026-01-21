'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Calendar, Percent, DollarSign, Key, Tag } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface CreateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateDiscountData {
  public_name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountCode: string;
  expiresAt?: Date;
}

export default function CreateDiscountModal({ isOpen, onClose }: CreateDiscountModalProps) {
  const [formData, setFormData] = useState<CreateDiscountData>({
    public_name: '',
    discountType: 'percentage',
    discountValue: 0,
    discountCode: '',
    expiresAt: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateDiscountData) => {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/seller/create-discount-code`,
        {
          ...data,
          expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Discount code created successfully!');
      queryClient.invalidateQueries({ queryKey: ['discountCodes'] });
      onClose();
      setFormData({
        public_name: '',
        discountType: 'percentage',
        discountValue: 0,
        discountCode: '',
        expiresAt: undefined,
      });
      setErrors({});
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create discount code';
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const newErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          newErrors[err.path] = err.msg;
        });
        setErrors(newErrors);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountValue' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.public_name.trim()) {
      newErrors.public_name = 'Discount name is required';
    }

    if (!formData.discountCode.trim()) {
      newErrors.discountCode = 'Discount code is required';
    } else if (formData.discountCode.length < 8) {
      newErrors.discountCode = 'Discount code must be at least 8 characters';
    } else if (formData.discountCode.length > 10) {
      newErrors.discountCode = 'Discount code cannot exceed 10 characters';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    if (formData.expiresAt && new Date(formData.expiresAt) < new Date()) {
      newErrors.expiresAt = 'Expiry date cannot be in the past';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, discountCode: code }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Discount Code</h2>
              <p className="text-sm text-gray-600 mt-1">
                Create a new discount for your customers
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Discount Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                Discount Name *
              </div>
            </label>
            <input
              type="text"
              name="public_name"
              value={formData.public_name}
              onChange={handleChange}
              placeholder="e.g., Flash Sale, Summer Discount, Black Friday"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.public_name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.public_name && (
              <p className="mt-1 text-sm text-red-600">{errors.public_name}</p>
            )}
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, discountType: 'percentage' }))}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                  formData.discountType === 'percentage'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Percent className="text-blue-600" size={20} />
                </div>
                <span className="font-medium">Percentage</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, discountType: 'fixed' }))}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                  formData.discountType === 'fixed'
                    ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Fixed Amount</span>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <div className="relative">
              {formData.discountType === 'percentage' ? (
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              ) : (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              )}
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                step="0.01"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.discountValue ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={formData.discountType === 'percentage' ? '0-100' : '0.00'}
              />
            </div>
            {errors.discountValue && (
              <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.discountType === 'percentage' 
                ? 'Enter percentage value (0-100%)'
                : 'Enter fixed amount in Naira'}
            </p>
          </div>

          {/* Discount Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  Discount Code *
                </div>
              </label>
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Generate Random
              </button>
            </div>
            <input
              type="text"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleChange}
              placeholder="e.g., FLASH50, SUMMER20"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                errors.discountCode ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={10}
            />
            {errors.discountCode && (
              <p className="mt-1 text-sm text-red-600">{errors.discountCode}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {formData.discountCode.length}/10 characters
              </p>
              <p className="text-sm text-gray-500">
                Minimum 8 characters required
              </p>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Expiry Date (Optional)
              </div>
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.expiresAt}
                onChange={(date: any) => setFormData(prev => ({ ...prev, expiresAt: date || undefined }))}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select expiry date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.expiresAt ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.expiresAt && (
              <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Leave empty for no expiry date
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                'Create Discount'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}