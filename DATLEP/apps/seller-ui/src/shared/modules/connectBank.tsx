"use client";

import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  X,
  Loader2,
  Shield,
  Globe,
  Smartphone,
  SkipForward,
  ExternalLink
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
  supportedCountries: string[];
  features: string[];
  setupUrl: string;
}

const paymentProviders: PaymentProvider[] = [
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Popular payment gateway across Africa with multi-currency support',
    icon: Wallet,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ'],
    features: ['Multi-currency', 'Card & Mobile Money', 'Bank Transfers', 'Fast Payouts'],
    setupUrl: '/api/setup/flutterwave'
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Leading payment processor in Nigeria with extensive bank integration',
    icon: CreditCard,
    color: 'bg-green-50 border-green-200 text-green-700',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA'],
    features: ['Nigerian Banks', 'Card Payments', 'USSD', 'Bank Transfers'],
    setupUrl: '/api/setup/paystack'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment platform with international card support',
    icon: Banknote,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA', 'US', 'GB', 'CA', 'AU'],
    features: ['International Cards', 'Recurring Payments', 'Advanced Fraud Protection', 'Global Payouts'],
    setupUrl: '/api/setup/stripe'
  },
  {
    id: 'manual',
    name: 'Manual Setup',
    description: 'Enter your bank details manually (payouts may take longer)',
    icon: Shield,
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    supportedCountries: ['ALL'],
    features: ['Direct Bank Transfer', 'Local Bank Account', 'Manual Verification', 'Traditional Banking'],
    setupUrl: '/api/setup/manual'
  }
];

interface BankFormData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  currency: string;
  provider: 'flutterwave' | 'paystack' | 'stripe' | 'manual';
  country: string;
}

const ConnectBank: React.FC<ConnectBankProps> = ({ sellerId, shopId, onBankConnected }) => {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider['id'] | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [manualForm, setManualForm] = useState<BankFormData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    currency: 'NGN',
    provider: 'manual',
    country: 'NG'
  });

  // Check if seller already has payment setup
  const checkPaymentStatus = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/seller/${sellerId}/payment-status`);
      return response.data;
    }
  });

  // Setup payment provider
  const setupPaymentMutation = useMutation({
    mutationFn: async (providerId: PaymentProvider['id']) => {
      const response = await axios.post(`${API_BASE_URL}/api/setup-payment`, {
        sellerId,
        shopId,
        provider: providerId,
        ...(providerId === 'manual' && manualForm)
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.redirectUrl) {
        // For OAuth flows (Stripe, Paystack Connect)
        window.location.href = data.redirectUrl;
      } else {
        setConnectionSuccess(true);
        setTimeout(() => {
          onBankConnected();
        }, 2000);
      }
    },
    onError: (error: any) => {
      setConnectionError(error.response?.data?.message || 'Failed to connect payment provider');
      setIsConnecting(false);
    }
  });

  // Skip payment setup
  const skipPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/api/skip-payment-setup`, {
        sellerId,
        shopId
      });
      return response.data;
    },
    onSuccess: () => {
      onBankConnected();
    },
    onError: (error: any) => {
      setConnectionError(error.response?.data?.message || 'Failed to skip payment setup');
    }
  });

  useEffect(() => {
    if (sellerId) {
      checkPaymentStatus.mutate();
    }
  }, [sellerId]);

  const handleProviderSelect = (providerId: PaymentProvider['id']) => {
    setSelectedProvider(providerId);
    setConnectionError('');
    setConnectionSuccess(false);
  };

  const handleConnect = async () => {
    if (!selectedProvider || !sellerId) return;
    
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      await setupPaymentMutation.mutateAsync(selectedProvider);
    } catch (error) {
      // Error handled in mutation onError
    }
  };

  const handleSkip = async () => {
    if (!sellerId) return;
    
    setConnectionError('');
    
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

  // Mock banks for Nigeria (in a real app, you'd fetch this from an API)
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

  if (checkPaymentStatus.isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (checkPaymentStatus.data?.isPaymentSetup) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Payment Already Setup</h3>
        <p className="text-sm text-gray-600">
          Your payment account is already connected and ready to receive payments.
        </p>
        <button
          onClick={onBankConnected}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Bank Account</h3>
        <p className="text-sm text-gray-600">
          Connect a payment provider to receive payments from customers. You can skip and set it up later.
        </p>
      </div>

      {/* Connection Status */}
      {connectionSuccess && (
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Successfully Connected!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your payment account has been connected. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {connectionError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
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
          return (
            <button
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                selectedProvider === provider.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'border-gray-200'
              } ${provider.color}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{provider.description}</p>
                  </div>
                </div>
                {selectedProvider === provider.id && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
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
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white text-gray-600 border border-gray-200"
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

      {/* Manual Bank Form (shown when manual is selected) */}
      {selectedProvider === 'manual' && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-4">Enter Your Bank Details</h4>
          
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
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
                  onChange={(e) => handleManualFormChange('accountNumber', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="10-digit account number"
                  required
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
                  onChange={(e) => handleManualFormChange('accountName', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name on bank account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  value={manualForm.currency}
                  onChange={(e) => handleManualFormChange('currency', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
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

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-blue-800">
                  Your bank details are encrypted and stored securely. We only use this information to process your payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleConnect}
          disabled={!selectedProvider || isConnecting}
          className={`flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            !selectedProvider || isConnecting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              Connect {selectedProvider ? paymentProviders.find(p => p.id === selectedProvider)?.name : 'Provider'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          disabled={isConnecting || skipPaymentMutation.isPending}
          className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

      {/* Additional Information */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Secure & Encrypted</h4>
            <p className="text-xs text-gray-600 mt-1">
              Your financial information is protected with bank-level security
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mb-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Fast Payouts</h4>
            <p className="text-xs text-gray-600 mt-1">
              Receive payments within 1-3 business days after order delivery
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 mb-2">
              <ExternalLink className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Easy to Update</h4>
            <p className="text-xs text-gray-600 mt-1">
              You can change or update your payment method anytime in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectBank;