// bespoke/components/ServicesManager.tsx
import React from 'react';
import { Plus, Trash2, DollarSign, Clock } from 'lucide-react';
import { Service } from '../types/bespoke';

interface ServicesManagerProps {
  services: Service[];
  onChange: (services: Service[]) => void;
  currencies: Array<{ id: string; label: string; symbol: string }>;
}

const ServicesManager: React.FC<ServicesManagerProps> = ({ 
  services, 
  onChange, 
  currencies 
}) => {
  const updateService = (index: number, updates: Partial<Service>) => {
    const updated = [...services];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const addService = () => {
    onChange([
      ...services,
      {
        name: '',
        description: '',
        basePrice: 0,
        timeRequired: '',
        isAvailable: true
      }
    ]);
  };

  const removeService = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Services Offered *</h3>
        <button
          type="button"
          onClick={addService}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(index, { name: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Custom Suit Tailoring"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Base Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.basePrice}
                        onChange={(e) => updateService(index, { basePrice: parseFloat(e.target.value) || 0 })}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, { description: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe the service in detail..."
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Time Required *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={service.timeRequired}
                        onChange={(e) => updateService(index, { timeRequired: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 2-3 weeks, 5 business days"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={service.isAvailable}
                        onChange={(e) => updateService(index, { isAvailable: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                  </div>
                </div>
              </div>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No services added yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Add the services you offer to potential clients
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;