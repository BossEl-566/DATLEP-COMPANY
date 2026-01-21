'use client';

import { useState, useRef } from 'react';
import { Upload, X, Edit2, AlertCircle, Check } from 'lucide-react';
import Image from 'next/image';

interface SelectImageProps {
  onImagesChange: (images: string[]) => void;
  maxImages: number;
  requiredRatio: string;
  onImageEdit: (image: string) => void;
}

export default function SelectImage({
  onImagesChange,
  maxImages,
  requiredRatio,
  onImageEdit,
}: SelectImageProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        
        if (newImages.length === Math.min(files.length, remainingSlots)) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileChange({ target: { files: dataTransfer.files } } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const openEditModal = (image: string) => {
    setSelectedImage(image);
    setShowEditModal(true);
    onImageEdit(image);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle size={16} />
          <span>Max {maxImages} images</span>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <Check className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="text-sm text-gray-700 font-medium">
              Image Requirements
            </p>
            <p className="text-sm text-gray-600">
              Please upload images with ratio {requiredRatio}. Recommended size: 765x850px
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="text-blue-600" size={24} />
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to upload
            </button>
            <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
          </div>
          
          <p className="text-gray-400 text-sm">
            PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({images.length}/{maxImages})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  
                  {/* Image Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEditModal(image)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit/Enhance"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Image Position Badge */}
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {index === 0 ? 'Main' : index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}