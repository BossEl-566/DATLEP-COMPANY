"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Shield,
  Globe,
  Smartphone,
  SkipForward,
  ExternalLink,
  Lock,
  BadgeCheck
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
interface ConnectBankProps {
  sellerId: string | null;
  shopId: string | null;
  onBankConnected: () => void;
}

interface PaymentProvider {
  id: 'flutterwave' | 'paystack' | 'stripe' | 'manual';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  bgColor: string;
  supportedCountries: string[];
  features: string[];
}

const paymentProviders: PaymentProvider[] = [
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Popular payment gateway across Africa with multi-currency support',
    icon: Wallet,
    color: 'text-purple-700',
    borderColor: 'border-purple-300 hover:border-purple-400',
    bgColor: 'bg-purple-50',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ'],
    features: ['Multi-currency', 'Card & Mobile Money', 'Bank Transfers', 'Fast Payouts']
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Leading payment processor in Nigeria with extensive bank integration',
    icon: CreditCard,
    color: 'text-green-700',
    borderColor: 'border-green-300 hover:border-green-400',
    bgColor: 'bg-green-50',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA'],
    features: ['Nigerian Banks', 'Card Payments', 'USSD', 'Bank Transfers']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment platform with international card support',
    icon: Banknote,
    color: 'text-blue-700',
    borderColor: 'border-blue-300 hover:border-blue-400',
    bgColor: 'bg-blue-50',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA', 'US', 'GB', 'CA', 'AU'],
    features: ['International Cards', 'Recurring Payments', 'Advanced Fraud Protection', 'Global Payouts']
  },
  {
    id: 'manual',
    name: 'Manual Bank Setup',
    description: 'Enter your bank details manually (payouts may take longer)',
    icon: Shield,
    color: 'text-gray-700',
    borderColor: 'border-gray-300 hover:border-gray-400',
    bgColor: 'bg-gray-50',
    supportedCountries: ['ALL'],
    features: ['Direct Bank Transfer', 'Local Bank Account', 'Manual Verification', 'Traditional Banking']
  }
];

interface BankFormData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  currency: string;
}

const ConnectBank: React.FC<ConnectBankProps> = ({ sellerId, shopId, onBankConnected }) => {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider['id'] | null>(null);
  const [manualForm, setManualForm] = useState<BankFormData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    currency: 'NGN'
  });
  const [connectionError, setConnectionError] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup payment provider mutation
  const setupPaymentMutation = useMutation({
    mutationFn: async ({ provider, formData }: { provider: string; formData?: BankFormData }) => {
      console.log('Setting up payment with:', { sellerId, provider, formData });
      
      const payload: any = {
        sellerId,
        shopId,
        provider
      };

      if (provider === 'manual' && formData) {
        payload.bankDetails = formData;
      }

      const response = await axios.post(`${API_BASE_URL}/api/seller/setup-payment`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seller_token') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Payment setup successful:', data);
      
      if (data.redirectUrl) {
        // For OAuth flows like Stripe Connect, redirect to external URL
        window.location.href = data.redirectUrl;
        return;
      }
      
      setConnectionSuccess(true);
      setIsProcessing(false);
      
      // Show success message for 2 seconds, then proceed
      setTimeout(() => {
        onBankConnected();
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Payment setup error:', error);
      setIsProcessing(false);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to connect payment provider';
      
      setConnectionError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setConnectionError('');
      }, 5000);
    }
  });

  // Skip payment setup mutation
  const skipPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/api/seller/skip-payment`, {
        sellerId,
        shopId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seller_token') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      console.log('Payment setup skipped');
      onBankConnected();
    },
    onError: (error: any) => {
      console.error('Skip payment error:', error);
      setConnectionError(error.response?.data?.message || 'Failed to skip payment setup');
    }
  });

  const handleProviderSelect = (providerId: PaymentProvider['id']) => {
    setSelectedProvider(providerId);
    setConnectionError('');
    setConnectionSuccess(false);
  };

  const handleConnect = async () => {
    if (!selectedProvider || !sellerId) {
      setConnectionError('Please select a payment provider');
      return;
    }

    // Validate manual form if manual provider is selected
    if (selectedProvider === 'manual') {
      if (!manualForm.bankName || !manualForm.accountNumber || !manualForm.accountName) {
        setConnectionError('Please fill in all required bank details');
        return;
      }
      
      if (manualForm.accountNumber.length < 10) {
        setConnectionError('Please enter a valid 10-digit account number');
        return;
      }
    }

    setIsProcessing(true);
    setConnectionError('');
    
    try {
      await setupPaymentMutation.mutateAsync({
        provider: selectedProvider,
        formData: selectedProvider === 'manual' ? manualForm : undefined
      });
    } catch (error) {
      // Error is handled in mutation onError
    }
  };

  const handleSkip = async () => {
    if (!sellerId) {
      setConnectionError('Seller ID is required');
      return;
    }
    
    const confirmSkip = window.confirm(
      'Are you sure you want to skip payment setup? You can set it up later in your dashboard, but you won\'t be able to receive payments until you do.'
    );
    
    if (confirmSkip) {
      await skipPaymentMutation.mutateAsync();
    }
  };

  const handleManualFormChange = (field: keyof BankFormData, value: string) => {
    setManualForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mock banks for Nigeria
  const nigerianBanks = [
    { name: 'Access Bank', code: '044' },
    { name: 'First Bank of Nigeria', code: '011' },
    { name: 'Guaranty Trust Bank', code: '058' },
    { name: 'Zenith Bank', code: '057' },
    { name: 'United Bank for Africa', code: '033' },
    { name: 'Stanbic IBTC Bank', code: '221' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'Union Bank of Nigeria', code: '032' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Polaris Bank', code: '076' },
  ];

  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'ZAR', name: 'South African Rand' },
  ];

  if (connectionSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Provider Connected!</h3>
          <p className="text-sm text-gray-600">
            {selectedProvider === 'manual' 
              ? 'Your bank details have been saved securely.' 
              : `Your ${paymentProviders.find(p => p.id === selectedProvider)?.name} account has been connected.`}
          </p>
        </div>
        <div className="pt-4">
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <Wallet className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Step 3: Connect Payment Account</h3>
        <p className="text-sm text-gray-600">
          Connect a payment provider to receive payments from customers. You can skip and set it up later.
        </p>
      </div>

      {/* Error Message */}
      {connectionError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 animate-in slide-in-from-top duration-300">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{connectionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentProviders.map((provider) => {
          const Icon = provider.icon;
          const isSelected = selectedProvider === provider.id;
          
          return (
            <button
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              disabled={isProcessing}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${
                provider.borderColor
              } ${provider.bgColor} ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow' : 'bg-white/80'}`}>
                    <Icon className={`h-6 w-6 ${provider.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${provider.color}`}>{provider.name}</h4>
                      {isSelected && (
                        <BadgeCheck className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{provider.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Available in {provider.supportedCountries.length} countries</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {provider.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/70 text-gray-600 border border-gray-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Manual Bank Form */}
      {selectedProvider === 'manual' && (
        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">Enter Your Bank Details</h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <select
                  value={manualForm.bankName}
                  onChange={(e) => {
                    handleManualFormChange('bankName', e.target.value);
                    const selectedBank = nigerianBanks.find(bank => bank.name === e.target.value);
                    if (selectedBank) {
                      handleManualFormChange('bankCode', selectedBank.code);
                    }
                  }}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  required
                  disabled={isProcessing}
                >
                  <option value="">Select a bank</option>
                  {nigerianBanks.map((bank) => (
                    <option key={bank.code} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={manualForm.accountNumber}
                  onChange={(e) => handleManualFormChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="10-digit account number"
                  required
                  disabled={isProcessing}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={manualForm.accountName}
                  onChange={(e) => handleManualFormChange('accountName', e.target.value.toUpperCase())}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name as it appears on bank account"
                  required
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  value={manualForm.currency}
                  onChange={(e) => handleManualFormChange('currency', e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  required
                  disabled={isProcessing}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Security Note:</strong> Your bank details are encrypted and stored securely using bank-level encryption. We only use this information to process your payments and never share it with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleConnect}
          disabled={!selectedProvider || isProcessing}
          className={`flex-1 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
            !selectedProvider || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              {selectedProvider === 'manual' ? 'Save Bank Details' : `Connect with ${selectedProvider ? paymentProviders.find(p => p.id === selectedProvider)?.name : 'Provider'}`}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          disabled={isProcessing || skipPaymentMutation.isPending}
          className="flex-1 flex justify-center items-center py-3.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow"
        >
          {skipPaymentMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Skipping...
            </>
          ) : (
            <>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip for Now
            </>
          )}
        </button>
      </div>

      {/* Information Section */}
      <div className="border-t border-gray-200 pt-8">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Why Connect Payment Now?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm mb-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Start Earning Immediately</h5>
            <p className="text-xs text-gray-600">
              Connect now to receive payments as soon as you make your first sale
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-white">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm mb-3">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Secure & Verified</h5>
            <p className="text-xs text-gray-600">
              All payment providers are PCI-DSS compliant and bank-level secure
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm mb-3">
              <ExternalLink className="h-5 w-5 text-purple-600" />
            </div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Easy to Change</h5>
            <p className="text-xs text-gray-600">
              You can update or change your payment method anytime in your seller dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectBank;