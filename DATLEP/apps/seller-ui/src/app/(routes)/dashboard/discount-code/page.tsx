'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Calendar,
  Percent,
  DollarSign,
  Zap
} from 'lucide-react';
import CreateDiscountModal from '../../../../shared/components/discount/CreateDiscountModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

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

interface CreateDiscountData {
  public_name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountCode: string;
  expiresAt?: string;
}

export default function DiscountCodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch discount codes
  const { 
    data: discounts = [], 
    isLoading, 
    error 
  } = useQuery<DiscountCode[]>({
    queryKey: ['discountCodes'],
    queryFn: async () => {
      const token = localStorage.getItem('token'); // or your auth method
      const response = await axios.get(
        `${API_BASE_URL}/product/api/get-discount-code`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    }
  });

  // Delete discount mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/product/api/delete-discount-code/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    },
    onSuccess: () => {
      toast.success('Discount code deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['discountCodes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete discount code');
    }
  });

  // Toggle discount status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/product/api/update-discount-code/${id}`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discountCodes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update discount status');
    }
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  // Filter discounts
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch = 
      discount.public_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.discountCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? discount.isActive && !isExpired(discount.expiresAt) :
      filter === 'expired' ? isExpired(discount.expiresAt) : true;
    
    return matchesSearch && matchesFilter;
  });

  const activeDiscounts = discounts.filter(d => d.isActive && !isExpired(d.expiresAt));
  const expiredDiscounts = discounts.filter(d => isExpired(d.expiresAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Discount Codes
              </h1>
              <p className="text-gray-600">
                Manage discount codes for your products
              </p>
            </div>
            
            {/* Create Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create Discount
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Discounts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {discounts.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Percent className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Discounts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeDiscounts.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired Discounts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {expiredDiscounts.length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Calendar className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search discount codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('expired')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'expired'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Discount Codes Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading discount codes...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <X className="text-red-600" size={24} />
              </div>
              <p className="mt-4 text-gray-600">Failed to load discount codes</p>
            </div>
          ) : filteredDiscounts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <Percent className="text-blue-600" size={24} />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No discount codes found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm ? 'Try a different search term' : 'Create your first discount code'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create Discount Code
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDiscounts.map((discount) => (
                    <tr key={discount._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {discount.public_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created {new Date(discount.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg font-mono">
                            {discount.discountCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(discount.discountCode)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === discount.discountCode ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {discount.discountType === 'percentage' ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              <Percent size={12} />
                              {discount.discountValue}%
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              <DollarSign size={12} />
                              ₦{discount.discountValue}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            discount.isActive && !isExpired(discount.expiresAt)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              discount.isActive && !isExpired(discount.expiresAt)
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`} />
                            {discount.isActive && !isExpired(discount.expiresAt) ? 'Active' : 
                             isExpired(discount.expiresAt) ? 'Expired' : 'Inactive'}
                          </div>
                          <button
                            onClick={() => toggleStatusMutation.mutate({ 
                              id: discount._id, 
                              isActive: discount.isActive 
                            })}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              discount.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            disabled={toggleStatusMutation.isPending}
                          >
                            {toggleStatusMutation.isPending ? '...' : 
                             discount.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className={`${
                            isExpired(discount.expiresAt)
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}>
                            {formatDate(discount.expiresAt)}
                          </span>
                          {isExpired(discount.expiresAt) && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Implement edit functionality
                              toast.error('Edit functionality coming soon!');
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this discount code?')) {
                                deleteMutation.mutate(discount._id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Discount Modal */}
        <CreateDiscountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}