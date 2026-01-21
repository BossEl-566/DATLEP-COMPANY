'use client';

import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface SelectColorsProps {
  onColorsChange: (colors: string[]) => void;
  initialColors?: string[];
}

export default function SelectColors({
  onColorsChange,
  initialColors = ['#000000', '#FFFFFF', '#FF6B35', '#004E89'],
}: SelectColorsProps) {
  const [colors, setColors] = useState<string[]>(initialColors);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');

  const handleColorSelect = (color: string) => {
    const newSelected = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(newSelected);
    onColorsChange(newSelected);
  };

  const addCustomColor = () => {
    if (!colors.includes(customColor)) {
      const newColors = [...colors, customColor];
      setColors(newColors);
    }
    setShowColorPicker(false);
    setCustomColor('#000000');
  };

  const removeColor = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newColors = colors.filter(c => c !== color);
    setColors(newColors);
    
    const newSelected = selectedColors.filter(c => c !== color);
    setSelectedColors(newSelected);
    onColorsChange(newSelected);
  };

  const colorNames: Record<string, string> = {
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#FF6B35': 'Orange',
    '#004E89': 'Blue',
    '#FFD700': 'Gold',
    '#800020': 'Burgundy',
    '#228B22': 'Green',
    '#8B4513': 'Brown',
    '#FF69B4': 'Pink',
    '#9400D3': 'Purple',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Select Colors</h2>
          <p className="text-gray-600 text-sm mt-1">
            Choose available colors for this product
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedColors.length} selected
        </div>
      </div>

      <div className="space-y-6">
        {/* Available Colors */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Available Colors
          </h3>
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <div
                key={color}
                className="flex flex-col items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`relative w-16 h-16 rounded-full border-4 transition-all hover:scale-105 ${
                    selectedColors.includes(color)
                      ? 'border-blue-500 ring-4 ring-blue-100'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColors.includes(color) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="text-white drop-shadow-lg" size={24} />
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => removeColor(color, e)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </button>
                
                <span className="text-xs font-medium text-gray-700">
                  {colorNames[color] || color}
                </span>
              </div>
            ))}
            
            {/* Add Color Button */}
            <button
              type="button"
              onClick={() => setShowColorPicker(true)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors">
                <Plus className="text-gray-400 group-hover:text-blue-500" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Add Color
              </span>
            </button>
          </div>
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Custom Color
                </h3>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Color
                  </label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full h-12 cursor-pointer"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-mono">{customColor}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Color
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Colors Preview */}
        {selectedColors.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Selected Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {colorNames[color] || color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}