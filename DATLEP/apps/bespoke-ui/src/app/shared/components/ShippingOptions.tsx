// bespoke/components/ShippingOptions.tsx
import React from 'react';
import { Plus, Trash2, Truck, Globe } from 'lucide-react';
import { ShippingOption } from '../types/bespoke';

interface ShippingOptionsProps {
  options: ShippingOption[];
  onChange: (options: ShippingOption[]) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ options, onChange }) => {
  const updateOption = (index: number, updates: Partial<ShippingOption>) => {
    const updated = [...options];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const addOption = () => {
    onChange([
      ...options,
      {
        destination: '',
        cost: 0,
        estimatedTime: ''
      }
    ]);
  };

  const removeOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Shipping Options</h3>
        <button
          type="button"
          onClick={addOption}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Option
        </button>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Destination *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={option.destination}
                      onChange={(e) => updateOption(index, { destination: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Lagos, Nigeria"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cost (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={option.cost}
                    onChange={(e) => updateOption(index, { cost: parseFloat(e.target.value) || 0 })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estimated Time *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={option.estimatedTime}
                      onChange={(e) => updateOption(index, { estimatedTime: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 3-5 business days"
                      required
                    />
                  </div>
                </div>
              </div>
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No shipping options added</p>
          <p className="text-xs text-gray-500 mt-1">
            Add shipping options for different locations
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingOptions;