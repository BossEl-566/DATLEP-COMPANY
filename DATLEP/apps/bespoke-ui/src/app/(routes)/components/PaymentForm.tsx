'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  CreditCard,  
  Smartphone, 
  Wallet, 
  Check, 
  Globe, 
  Shield,
  Upload,
  FileText,
} from 'lucide-react';
import { BespokeFormData, FittingOption, PaymentMethod } from './types';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface PaymentFormProps {
  onSubmit: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
  sellerId?: string;
  shopId?: string;
  creatorId?: string; // Add creatorId prop to identify the creator
  token?: string; // Add token prop for authentication
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  isSubmitting = false,
  sellerId,
  shopId,
  creatorId,
  token
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile-money'>('bank');
  const [connectingBank, setConnectingBank] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  const [mobileMoneyConnected, setMobileMoneyConnected] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);

  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Mutation for updating creator profile
  const updateCreatorMutation = useMutation({
    mutationFn: async (data: Partial<BespokeFormData> & { creatorId?: string }) => {
      if (!creatorId) {
        throw new Error('Creator ID is required');
      }
      
      const response = await api.put('/update-bespoke-creator', {
        creatorId,
        ...data
      });
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to update creator profile');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Partial<BespokeFormData>>({
    mode: 'onChange',
    defaultValues: {
      fittingOptions: ['virtual', 'in-person'],
      paymentMethods: ['bank-transfer', 'mobile-money'],
      preferredCurrency: 'NGN',
      workshopLocation: {
        city: '',
        country: 'NG',
        acceptsLocalClients: true,
        acceptsInternationalClients: false
      }
    },
  });

  const onFormSubmit: SubmitHandler<Partial<BespokeFormData>> = async (data) => {
    if (!bankConnected && !mobileMoneyConnected) {
      alert('Please connect at least one payment method');
      return;
    }

    const connectedPaymentMethods: PaymentMethod[] = [
      ...(bankConnected ? (['bank-transfer'] as PaymentMethod[]) : []),
      ...(mobileMoneyConnected ? (['mobile-money'] as PaymentMethod[]) : []),
    ];

    const formData = {
      ...data,
      paymentMethods: connectedPaymentMethods,
    };

    try {
      setApiError('');
      
      // First, update the creator profile via API
      if (creatorId) {
        const updateData = {
          workshopLocation: formData.workshopLocation,
          fittingOptions: formData.fittingOptions,
          paymentMethods: formData.paymentMethods,
          preferredCurrency: formData.preferredCurrency,
          // Add other fields you want to update
          verificationDocs: verificationDocs.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          })),
          isPaymentSetupComplete: true,
          bankConnected,
          mobileMoneyConnected,
          setupStep: 'completed' // Add a field to track setup completion
        };

        const result = await updateCreatorMutation.mutateAsync({
          creatorId,
          ...updateData
        });

        if (result.success) {
          setApiSuccess(true);
          
          // Then call the original onSubmit with the form data
          onSubmit(formData);
          
          // Optional: Show success message
          setTimeout(() => {
            alert('Profile updated successfully! Your account is now fully set up.');
          }, 500);
        }
      } else {
        // If no creatorId, just submit normally
        onSubmit(formData);
      }
    } catch (error: any) {
      setApiError(error.message);
      console.error('Failed to update creator profile:', error);
    }
  };

  // Function to upload verification documents
  const uploadVerificationDocs = async (files: File[]) => {
    if (!creatorId || files.length === 0) return;

    const formData = new FormData();
    formData.append('creatorId', creatorId);
    files.forEach(file => {
      formData.append('documents', file);
    });

    try {
      const response = await api.post('/upload-verification-docs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload verification documents:', error);
      throw error;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVerificationDocs(prev => [...prev, ...files]);
      
      // Optional: Upload files immediately
      if (creatorId) {
        uploadVerificationDocs(files).catch(error => {
          console.error('Upload failed:', error);
        });
      }
    }
  };

  const removeDocument = (index: number) => {
    setVerificationDocs(prev => prev.filter((_, i) => i !== index));
  };

  const connectBankAccount = () => {
    setConnectingBank(true);
    // This would trigger Paystack popup
    setTimeout(() => {
      // Simulate successful bank connection
      setBankConnected(true);
      setConnectingBank(false);
      
      // Optional: Update creator profile with bank connection status
      if (creatorId) {
        api.put('/update-bespoke-creator', {
          creatorId,
          bankConnected: true,
          bankConnectedAt: new Date().toISOString()
        }).catch(error => {
          console.error('Failed to update bank connection status:', error);
        });
      }
    }, 2000);
  };

  const connectMobileMoney = () => {
    // This would trigger Paystack mobile money popup
    setTimeout(() => {
      setMobileMoneyConnected(true);
      
      // Optional: Update creator profile with mobile money connection status
      if (creatorId) {
        api.put('/update-bespoke-creator', {
          creatorId,
          mobileMoneyConnected: true,
          mobileMoneyConnectedAt: new Date().toISOString()
        }).catch(error => {
          console.error('Failed to update mobile money connection status:', error);
        });
      }
    }, 2000);
  };

  // Ghana-specific mobile money providers
  const ghanaMobileMoneyProviders = [
    { id: 'mtn', name: 'MTN Mobile Money', code: 'MTN' },
    { id: 'vodafone', name: 'Vodafone Cash', code: 'VOD' },
    { id: 'airteltigo', name: 'AirtelTigo Money', code: 'ATL' },
  ];

  const fittingOptions = [
    { id: 'virtual', label: 'Virtual Fitting', description: 'Video consultation and measurements' },
    { id: 'in-person', label: 'In-Person Fitting', description: 'Studio or client location' },
    { id: 'send-garment', label: 'Send Garment', description: 'Client sends existing garment' },
    { id: 'standard-size', label: 'Standard Sizes', description: 'Use standard size charts' },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">Step 4: Payment & Verification Setup</h4>
              <p className="text-sm text-purple-700 mt-1">
                Connect your payment methods and complete your profile setup.
              </p>
            </div>
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <div className="h-5 w-5 text-red-400 mr-2">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Update Failed</h3>
                <p className="mt-1 text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* API Success Message */}
        {apiSuccess && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Profile Updated</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your creator profile has been successfully updated!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Workshop Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Workshop Location *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                {...register('workshopLocation.city', { required: 'City is required' })}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.workshopLocation?.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your workshop city"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                {...register('workshopLocation.country', { required: 'Country is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Your country"
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('workshopLocation.acceptsLocalClients')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Accept local clients</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('workshopLocation.acceptsInternationalClients')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Accept international clients</span>
            </label>
          </div>
        </div>

        {/* Fitting Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fitting Options *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fittingOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                  watch('fittingOptions')?.includes(option.id as FittingOption)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.id}
                  {...register('fittingOptions')}
                  className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Methods *
          </label>
          
          <div className="space-y-4">
            {/* Bank Account Connection */}
            <div className={`p-4 border rounded-lg ${
              bankConnected ? 'border-green-300 bg-green-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Wallet className={`h-5 w-5 mr-2 ${bankConnected ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">Bank Account</h4>
                    <p className="text-xs text-gray-500">Connect your bank for direct transfers</p>
                  </div>
                </div>
                {bankConnected ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={connectBankAccount}
                    disabled={connectingBank}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      connectingBank
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {connectingBank ? 'Connecting...' : 'Connect Bank'}
                  </button>
                )}
              </div>
              
              {!bankConnected && (
                <div className="text-sm text-gray-600">
                  <p className="mb-2">We use Paystack for secure bank connections. You'll be redirected to verify your account.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Secure and encrypted connection</li>
                    <li>Supports all major banks</li>
                    <li>Receive payments directly to your account</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Money Connection - Show for Ghana */}
            {watch('workshopLocation.country') === 'GH' && (
              <div className={`p-4 border rounded-lg ${
                mobileMoneyConnected ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Smartphone className={`h-5 w-5 mr-2 ${mobileMoneyConnected ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-medium text-gray-900">Mobile Money (Ghana)</h4>
                      <p className="text-xs text-gray-500">Connect your mobile money account</p>
                    </div>
                  </div>
                  {mobileMoneyConnected ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectMobileMoney}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Connect Mobile Money
                    </button>
                  )}
                </div>
                
                {!mobileMoneyConnected && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Select your mobile money provider:</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {ghanaMobileMoneyProviders.map((provider) => (
                        <label
                          key={provider.id}
                          className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300"
                        >
                          <input
                            type="radio"
                            name="mobileMoneyProvider"
                            value={provider.id}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm">{provider.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other Payment Methods */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <Wallet className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Other Payment Methods</h4>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center opacity-50">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-gray-400 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <CreditCard className="h-4 w-4 ml-2 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Credit/Debit Cards</span>
                </label>
                <label className="flex items-center opacity-50">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-gray-400 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <Shield className="h-4 w-4 ml-2 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Platform Wallet</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Documents */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Verification Documents (Optional)
          </label>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Upload Documents</h4>
                <p className="text-xs text-gray-500">Get verified faster with these documents</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag & drop files or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer"
                >
                  Browse Files
                </label>
                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG up to 5MB each</p>
              </div>
              
              {verificationDocs.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Uploaded Documents:</h5>
                  {verificationDocs.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Recommended documents:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Business registration certificate</li>
                  <li>Portfolio photos of your work</li>
                  <li>Government-issued ID</li>
                  <li>Workshop/shop photos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Currency *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('preferredCurrency', { required: 'Currency is required' })}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="NGN">Nigerian Naira (₦)</option>
              <option value="GHS">Ghanaian Cedi (GH₵)</option>
              <option value="KES">Kenyan Shilling (KSh)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Prices will be shown in this currency. You can add other currencies later.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={!isValid || isSubmitting || (!bankConnected && !mobileMoneyConnected) || updateCreatorMutation.isPending}
          className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
            !isValid || isSubmitting || (!bankConnected && !mobileMoneyConnected) || updateCreatorMutation.isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isSubmitting || updateCreatorMutation.isPending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {updateCreatorMutation.isPending ? 'Updating Profile...' : 'Completing Setup...'}
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;