'use client';

import { useState } from 'react';
import { Plus, X, Info } from 'lucide-react';

interface Specification {
  key: string;
  value: string;
}

interface CustomSpecificationsProps {
  onSpecificationsChange: (specs: Record<string, string>) => void;
}

export default function CustomSpecifications({
  onSpecificationsChange,
}: CustomSpecificationsProps) {
  const [specifications, setSpecifications] = useState<Specification[]>([
    { key: 'Material', value: '100% Premium Cotton' },
    { key: 'Fabric Type', value: 'Ankara Print' },
    { key: 'Care Instructions', value: 'Machine Wash Cold' },
  ]);

  const [newSpec, setNewSpec] = useState<Specification>({ key: '', value: '' });

  const handleAddSpec = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      const updatedSpecs = [...specifications, { ...newSpec }];
      setSpecifications(updatedSpecs);
      updateParent(updatedSpecs);
      setNewSpec({ key: '', value: '' });
    }
  };

  const handleRemoveSpec = (index: number) => {
    const updatedSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecs);
    updateParent(updatedSpecs);
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
    updateParent(updatedSpecs);
  };

  const updateParent = (specs: Specification[]) => {
    const specObject: Record<string, string> = {};
    specs.forEach(spec => {
      specObject[spec.key] = spec.value;
    });
    onSpecificationsChange(specObject);
  };

  const examples = [
    { key: 'Pattern', value: 'Floral, Geometric, Abstract' },
    { key: 'Closure', value: 'Zipper, Buttons, Velcro' },
    { key: 'Weight', value: '450 GSM' },
    { key: 'Origin', value: 'Made in Nigeria' },
    { key: 'Season', value: 'All Season' },
    { key: 'Fit', value: 'Regular Fit, Slim Fit, Loose Fit' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Custom Specifications
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Add detailed specifications about your product
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info size={16} />
          <span>{specifications.length} specifications</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Specifications */}
        <div className="space-y-4">
          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(index, 'key', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Specification name"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Specification value"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSpec(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Specification */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Add New Specification
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newSpec.key}
                onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Fabric Type"
              />
              <input
                type="text"
                value={newSpec.value}
                onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cotton, Silk, Linen"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSpec}
              disabled={!newSpec.key.trim() || !newSpec.value.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Info size={16} />
            Examples of Specifications:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg border border-gray-200"
              >
                <div className="text-sm font-medium text-gray-700">
                  {example.key}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {example.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}