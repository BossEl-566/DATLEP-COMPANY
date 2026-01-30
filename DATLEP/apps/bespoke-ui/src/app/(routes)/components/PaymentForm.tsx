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
import dynamic from 'next/dynamic';

// Dynamically import Paystack inline component to avoid SSR issues
// const PaystackButton = dynamic(() => import('react-paystack').then(mod => mod.PaystackButton), {
//   ssr: false,
//   loading: () => <div>Loading payment options...</div>
// });

interface PaymentFormProps {
  onSubmit: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
  sellerId?: string;
  shopId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  isSubmitting = false,
  sellerId,
  shopId
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile-money'>('bank');
  const [connectingBank, setConnectingBank] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  const [mobileMoneyConnected, setMobileMoneyConnected] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);

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

  // Paystack Configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: sellerId ? `${sellerId}@datlep.com` : 'creator@datlep.com',
    amount: 1000, // 10 NGN verification fee
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key',
    currency: 'NGN',
  };

const onFormSubmit: SubmitHandler<Partial<BespokeFormData>> = (data) => {
  if (!bankConnected && !mobileMoneyConnected) {
    alert('Please connect at least one payment method');
    return;
  }

  const connectedPaymentMethods: PaymentMethod[] = [
  ...(bankConnected ? (['bank-transfer'] as PaymentMethod[]) : []),
  ...(mobileMoneyConnected ? (['mobile-money'] as PaymentMethod[]) : []),
];


  onSubmit({
    ...data,
    paymentMethods: connectedPaymentMethods,
  });
};


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVerificationDocs(prev => [...prev, ...files]);
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
    }, 2000);
  };

  const connectMobileMoney = () => {
    // This would trigger Paystack mobile money popup
    setTimeout(() => {
      setMobileMoneyConnected(true);
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
          disabled={!isValid || isSubmitting || (!bankConnected && !mobileMoneyConnected)}
          className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
            !isValid || isSubmitting || (!bankConnected && !mobileMoneyConnected)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Completing Setup...
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>

      {/* Paystack Popup Component (Hidden) */}
      <div className="hidden">
        {/* <PaystackButton
          {...paystackConfig}
          text="Connect Bank"
          onSuccess={(reference: any) => {
            console.log('Payment successful:', reference);
            setBankConnected(true);
          }}
          onClose={() => {
            console.log('Payment modal closed');
            setConnectingBank(false);
          }}
        /> */}
      </div>
    </form>
  );
};

export default PaymentForm;