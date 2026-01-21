'use client';

import { useState } from 'react';
import { Check, Ruler } from 'lucide-react';

/* ✅ 1. Define allowed size keys */
type SizeKey =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL'
  | 'Custom';

/* ✅ 2. Strongly typed size chart */
const sizeChart: Record<SizeKey, string> = {
  XS: 'Extra Small (32-34)',
  S: 'Small (34-36)',
  M: 'Medium (36-38)',
  L: 'Large (38-40)',
  XL: 'Extra Large (40-42)',
  XXL: '2X Large (42-44)',
  XXXL: '3X Large (44-46)',
  Custom: 'Custom Measurements',
};

interface SelectSizesProps {
  onSizesChange: (sizes: SizeKey[]) => void;
  availableSizes: SizeKey[];
}

export default function SelectSizes({
  onSizesChange,
  availableSizes,
}: SelectSizesProps) {
  const [selectedSizes, setSelectedSizes] = useState<SizeKey[]>([]);
  const [customSize, setCustomSize] = useState('');
  const [showCustomSize, setShowCustomSize] = useState(false);

  const handleSizeSelect = (size: SizeKey) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    onSizesChange(newSizes);
  };

  const addCustomSize = () => {
    if (customSize.trim()) {
      const custom = customSize.trim() as SizeKey;

      if (!selectedSizes.includes(custom)) {
        const newSizes = [...selectedSizes, custom];
        setSelectedSizes(newSizes);
        onSizesChange(newSizes);
      }

      setCustomSize('');
      setShowCustomSize(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Ruler className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Select Sizes
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Choose available sizes for this product
            </p>
          </div>
        </div>

        <div className="text-sm font-medium text-gray-700">
          {selectedSizes.length} sizes selected
        </div>
      </div>

      {/* ✅ Standard Sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {availableSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSizeSelect(size)}
            className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedSizes.includes(size)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold">{size}</span>
              <span className="text-xs opacity-75 text-center">
                {sizeChart[size]}
              </span>
            </div>

            {selectedSizes.includes(size) && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ✅ Custom Size */}
      <div className="pt-6 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={() => setShowCustomSize(!showCustomSize)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showCustomSize ? 'Cancel' : '+ Add Custom Size'}
        </button>

        {showCustomSize && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="e.g., XL-Tall, 28W x 32L"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCustomSize}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Custom Size
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
