// bespoke/components/PortfolioUpload.tsx
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { PortfolioItem } from '../types/bespoke';

interface PortfolioUploadProps {
  portfolio: PortfolioItem[];
  onChange: (portfolio: PortfolioItem[]) => void;
}

const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ portfolio, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const newItems: PortfolioItem[] = [];
    
    // Convert files to base64 (simplified - in production use cloud storage)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newItems.push({
          title: `Work ${portfolio.length + newItems.length + 1}`,
          description: 'Add description...',
          images: [base64String],
          category: '',
          createdAt: new Date()
        });
        
        if (newItems.length === files.length) {
          onChange([...portfolio, ...newItems]);
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (index: number, updates: Partial<PortfolioItem>) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Portfolio *</h3>
        <div className="text-sm text-gray-500">
          {portfolio.length} item{portfolio.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Upload Card */}
        <label className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload Images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        </label>

        {/* Portfolio Items */}
        {portfolio.map((item, index) => (
          <div key={index} className="relative group">
            {item.images[0] && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mt-2 space-y-1">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                className="w-full text-sm font-medium border-0 focus:ring-0 p-0"
                placeholder="Work title"
              />
              <textarea
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                className="w-full text-xs text-gray-600 border-0 focus:ring-0 p-0 resize-none"
                placeholder="Add description..."
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload images of your best work</p>
          <p className="text-xs text-gray-500 mt-1">
            Showcase 3-5 of your best creations to attract clients
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioUpload;