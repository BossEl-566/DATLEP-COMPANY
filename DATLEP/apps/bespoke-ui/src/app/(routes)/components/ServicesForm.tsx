'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Trash2, DollarSign, Clock, Check, X, Settings, Package, Target, Zap, Users, Globe } from 'lucide-react';
import { BespokeFormData, Service, ShippingOption } from './types';

interface ServicesFormProps {
  onSubmit: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
}

const customizationOptions = [
  { id: "measurements", label: "Custom Measurements", icon: Target },
  { id: "fabricSelection", label: "Fabric Selection", icon: Package },
  { id: "designConsultation", label: "Design Consultation", icon: Users },
  { id: "multipleRevisions", label: "Multiple Revisions", icon: Settings },
  { id: "rushOrders", label: "Rush Orders", icon: Zap },
] as const;


const ServicesForm: React.FC<ServicesFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const [services, setServices] = useState<Service[]>([
    { 
      name: '', 
      description: '', 
      basePrice: 0, 
      timeRequired: '1-2 weeks', 
      isAvailable: true 
    }
  ]);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([
    { destination: 'Local', cost: 0, estimatedTime: '3-5 days' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Partial<BespokeFormData>>({
    mode: 'onChange',
    defaultValues: {
      pricingModel: 'fixed',
      minimumOrderValue: 0,
      depositPercentage: 50,
      responseTime: 'within-day',
      customizationOptions: {
        measurements: true,
        fabricSelection: true,
        designConsultation: true,
        multipleRevisions: false,
        rushOrders: false
      },
      fittingOptions: ['virtual', 'in-person'],
      paymentMethods: ['bank-transfer', 'mobile-money'],
      preferredCurrency: 'NGN',
      workshopLocation: {
        city: '',
        country: '',
        acceptsLocalClients: true,
        acceptsInternationalClients: false
      }
    },
  });

  const onFormSubmit: SubmitHandler<Partial<BespokeFormData>> = (data) => {
    const formData = {
      ...data,
      services: services.filter(s => s.name.trim() !== ''),
      languages,
      shippingOptions: shippingOptions.filter(so => so.destination.trim() !== ''),
    };
    onSubmit(formData);
  };

  const addService = () => {
    setServices([...services, { 
      name: '', 
      description: '', 
      basePrice: 0, 
      timeRequired: '1-2 weeks', 
      isAvailable: true 
    }]);
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, '']);
  };

  const updateLanguage = (index: number, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;
    setLanguages(updatedLanguages);
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const addShippingOption = () => {
    setShippingOptions([...shippingOptions, { 
      destination: '', 
      cost: 0, 
      estimatedTime: '1-2 weeks' 
    }]);
  };

  const updateShippingOption = (index: number, field: keyof ShippingOption, value: any) => {
    const updatedOptions = [...shippingOptions];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setShippingOptions(updatedOptions);
  };

  const removeShippingOption = (index: number) => {
    if (shippingOptions.length > 1) {
      setShippingOptions(shippingOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Settings className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Step 3: Define Your Services & Pricing</h4>
              <p className="text-sm text-green-700 mt-1">
                Set up your services, pricing structure, and how clients can work with you.
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Services Offered *
            </label>
            <button
              type="button"
              onClick={addService}
              className="text-sm text-green-600 hover:text-green-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </button>
          </div>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Service #{index + 1}</h4>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="E.g., Custom Suit, Wedding Dress, Leather Bag"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Describe this service in detail..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Base Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.basePrice}
                        onChange={(e) => updateService(index, 'basePrice', parseFloat(e.target.value))}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Time Required *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={service.timeRequired}
                        onChange={(e) => updateService(index, 'timeRequired', e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="E.g., 1-2 weeks, 3-5 days"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={service.isAvailable}
                    onChange={(e) => updateService(index, 'isAvailable', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    This service is currently available
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pricing Model *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'fixed', label: 'Fixed Price', description: 'Set price per project' },
              { id: 'hourly', label: 'Hourly Rate', description: 'Charge per hour worked' },
              { id: 'project-based', label: 'Project Based', description: 'Custom quote per project' },
              { id: 'custom', label: 'Custom', description: 'Flexible pricing structure' }
            ].map((model) => (
              <label
                key={model.id}
                className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                  watch('pricingModel') === model.id
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('pricingModel', { required: true })}
                  value={model.id}
                  className="sr-only"
                />
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="font-medium text-gray-900">{model.label}</p>
                <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                {watch('pricingModel') === model.id && (
                  <Check className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Pricing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minimumOrderValue" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Order Value *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="minimumOrderValue"
                type="number"
                min="0"
                step="0.01"
                {...register('minimumOrderValue', {
                  required: 'Minimum order value is required',
                  min: { value: 0, message: 'Must be 0 or more' },
                })}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                  errors.minimumOrderValue ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum amount for accepting projects</p>
            {errors.minimumOrderValue && (
              <p className="mt-2 text-sm text-red-600">{errors.minimumOrderValue.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="depositPercentage" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit Percentage *
            </label>
            <div className="relative">
              <input
                id="depositPercentage"
                type="number"
                min="0"
                max="100"
                {...register('depositPercentage', {
                  required: 'Deposit percentage is required',
                  min: { value: 0, message: 'Must be between 0-100' },
                  max: { value: 100, message: 'Must be between 0-100' },
                })}
                className={`block w-full pl-3 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                  errors.depositPercentage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="50"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Percentage required upfront to start project</p>
            {errors.depositPercentage && (
              <p className="mt-2 text-sm text-red-600">{errors.depositPercentage.message}</p>
            )}
          </div>
        </div>

        {/* Customization Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Customization Options
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customizationOptions.map(option => (
  <label
    key={option.id}
    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
      watch(`customizationOptions.${option.id}`)
        ? "border-green-500 bg-green-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <input
      type="checkbox"
      {...register(`customizationOptions.${option.id}`)}
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
    />
    <div className="flex items-center ml-3">
      <option.icon className="h-4 w-4 text-gray-600 mr-2" />
      <span className="text-sm font-medium text-gray-900">
        {option.label}
      </span>
    </div>
  </label>
))}

          </div>
        </div>

        {/* Response Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Average Response Time *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'within-hours', label: 'Within Hours', description: 'Quick responder' },
              { id: 'within-day', label: 'Within a Day', description: 'Same day response' },
              { id: '1-2-days', label: '1-2 Days', description: 'Within 48 hours' },
              { id: '3-plus-days', label: '3+ Days', description: 'Takes longer' }
            ].map((time) => (
              <label
                key={time.id}
                className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${
                  watch('responseTime') === time.id
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('responseTime', { required: true })}
                  value={time.id}
                  className="sr-only"
                />
                <p className="font-medium text-gray-900">{time.label}</p>
                <p className="text-xs text-gray-500 mt-1">{time.description}</p>
                {watch('responseTime') === time.id && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-green-600" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Languages Spoken
            </label>
            <button
              type="button"
              onClick={addLanguage}
              className="text-sm text-green-600 hover:text-green-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Language
            </button>
          </div>
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => updateLanguage(index, e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="E.g., English, French, Arabic"
                  />
                </div>
                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Options */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Shipping Options
            </label>
            <button
              type="button"
              onClick={addShippingOption}
              className="text-sm text-green-600 hover:text-green-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Shipping Option
            </button>
          </div>
          <div className="space-y-3">
            {shippingOptions.map((option, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Option #{index + 1}</span>
                  {shippingOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShippingOption(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={option.destination}
                    onChange={(e) => updateShippingOption(index, 'destination', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="E.g., Local, International"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={option.cost}
                      onChange={(e) => updateShippingOption(index, 'cost', parseFloat(e.target.value))}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={option.estimatedTime}
                    onChange={(e) => updateShippingOption(index, 'estimatedTime', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="E.g., 1-2 weeks, 3-5 days"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
            !isValid || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Continue to Payment Setup'
          )}
        </button>
      </div>
    </form>
  );
};

export default ServicesForm;