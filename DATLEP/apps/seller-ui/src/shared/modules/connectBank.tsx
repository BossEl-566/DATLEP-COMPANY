"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  CreditCard,
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
  BadgeCheck,
  Wallet
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
interface ConnectBankProps {
  sellerId: string | null;
  shopId: string | null;
  onBankConnected: () => void;
}

interface PaymentProvider {
  id: 'paystack';
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
    id: 'paystack',
    name: 'Paystack',
    description: 'Leading payment processor in Africa with extensive bank integration',
    icon: CreditCard,
    color: 'text-green-700',
    borderColor: 'border-green-300 hover:border-green-400',
    bgColor: 'bg-green-50',
    supportedCountries: ['NG', 'GH', 'KE', 'ZA'],
    features: ['Nigerian Banks', 'Card Payments', 'USSD', 'Bank Transfers', 'Fast Payouts']
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
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider['id'] | null>('paystack');
  const [connectionError, setConnectionError] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup payment provider mutation (Paystack)
  const setupPaymentMutation = useMutation({
    mutationFn: async ({ provider }: { provider: string }) => {
      console.log('Setting up payment with:', { sellerId, provider });
      
      const payload = {
        sellerId,
        shopId,
        provider
      };

      const response = await axios.post(`${API_BASE_URL}/api/paystack-webhook`, payload, {
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
        // For Paystack onboarding flow
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
      const response = await axios.post(`${API_BASE_URL}/api/skip-seller-payment`, {
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

  const handleConnect = async () => {
    if (!sellerId) {
      setConnectionError('Seller ID is required');
      return;
    }

    setIsProcessing(true);
    setConnectionError('');
    
    try {
      await setupPaymentMutation.mutateAsync({
        provider: 'paystack'
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

  if (connectionSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Paystack Connected!</h3>
          <p className="text-sm text-gray-600">
            Your Paystack account has been connected. You can now receive payments from customers.
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Step 3: Connect Paystack Account</h3>
        <p className="text-sm text-gray-600">
          Connect Paystack to receive payments from customers. You can skip and set it up later.
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

      {/* Paystack Option */}
      <div className="space-y-6">
        {paymentProviders.map((provider) => {
          const Icon = provider.icon;
          const isSelected = selectedProvider === provider.id;
          
          return (
            <div
              key={provider.id}
              className={`p-6 border-2 rounded-lg transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${
                provider.borderColor
              } ${provider.bgColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-white shadow' : 'bg-white/80'}`}>
                    <Icon className={`h-8 w-8 ${provider.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-lg font-semibold ${provider.color}`}>{provider.name}</h4>
                      {isSelected && (
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{provider.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Available in {provider.supportedCountries.join(', ')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-white text-gray-700 border border-gray-200 shadow-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Security:</strong> Paystack is PCI-DSS compliant. Your financial information is encrypted and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Paystack Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h5 className="text-sm font-medium text-gray-900">PCI-DSS Compliant</h5>
            </div>
            <p className="text-xs text-gray-600">
              Highest level of security certification for payment processors
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center mb-3">
              <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
              <h5 className="text-sm font-medium text-gray-900">Multi-Channel</h5>
            </div>
            <p className="text-xs text-gray-600">
              Accept cards, bank transfers, USSD, and mobile money
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center mb-3">
              <ExternalLink className="h-5 w-5 text-purple-600 mr-2" />
              <h5 className="text-sm font-medium text-gray-900">Easy Integration</h5>
            </div>
            <p className="text-xs text-gray-600">
              Simple setup with automatic payouts to your bank account
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleConnect}
          disabled={isProcessing}
          className={`flex-1 flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-3" />
              Connecting to Paystack...
            </>
          ) : (
            <>
              <CreditCard className="mr-3 h-5 w-5" />
              Connect Paystack Account
              <ArrowRight className="ml-3 h-5 w-5" />
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          disabled={isProcessing || skipPaymentMutation.isPending}
          className="flex-1 flex justify-center items-center py-4 px-6 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow"
        >
          {skipPaymentMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-3" />
              Skipping...
            </>
          ) : (
            <>
              <SkipForward className="mr-3 h-5 w-5" />
              Skip for Now
            </>
          )}
        </button>
      </div>

      {/* Additional Information */}
      <div className="border-t border-gray-200 pt-8">
        <h4 className="text-sm font-medium text-gray-900 mb-4">What happens next?</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Connect Paystack:</strong> You'll be redirected to Paystack to complete the account connection process. This takes about 2 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Start Selling:</strong> Once connected, you can list your products and start accepting payments immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Receive Payments:</strong> Payments from customers will be automatically deposited to your connected bank account within 1-3 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> If you skip now, you can still connect Paystack later from your seller dashboard. However, you won't be able to receive customer payments until you do.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectBank;