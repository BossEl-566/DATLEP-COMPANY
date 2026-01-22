import { useState } from 'react';
import { X, RotateCw, Contrast, Droplets, Zap, Sparkles, Check } from 'lucide-react';
import Image from 'next/image';

interface EnhancementModalProps {
  image: { url: string; fileId: string };
  onClose: () => void;
  onSave: (enhancedUrl: string) => void;
}

export default function EnhancementModal({ image, onClose, onSave }: EnhancementModalProps) {
  const [enhancements, setEnhancements] = useState({
    // Basic effects
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpen: 0,
    
    // Advanced effects from ImageKit docs
    blur: 0,
    pixelate: 0,
    rotate: 0,
    grayscale: false,
    sepia: false,
    
    // AI enhancements
    upscale: false,
    retouch: false,
    removeBg: false,
  });

  const [previewUrl, setPreviewUrl] = useState(image.url);

  const enhancementTools = [
    {
      name: 'Brightness',
      icon: Sparkles,
      param: 'brightness',
      min: -100,
      max: 100,
      step: 10,
      value: enhancements.brightness,
    },
    {
      name: 'Contrast',
      icon: Contrast,
      param: 'contrast',
      min: -100,
      max: 100,
      step: 10,
      value: enhancements.contrast,
    },
    {
      name: 'Saturation',
      icon: Droplets,
      param: 'saturation',
      min: -100,
      max: 100,
      step: 10,
      value: enhancements.saturation,
    },
    {
      name: 'Sharpen',
      icon: Zap,
      param: 'sharpen',
      min: 0,
      max: 100,
      step: 10,
      value: enhancements.sharpen,
    },
    {
      name: 'Blur',
      param: 'blur',
      min: 0,
      max: 100,
      step: 10,
      value: enhancements.blur,
    },
    {
      name: 'Rotate',
      icon: RotateCw,
      param: 'rotate',
      min: 0,
      max: 360,
      step: 90,
      value: enhancements.rotate,
    },
  ];

  const aiEnhancements = [
    { name: 'Upscale Resolution', key: 'upscale', description: 'Increase image resolution' },
    { name: 'AI Retouch', key: 'retouch', description: 'Improve image quality' },
    { name: 'Remove Background', key: 'removeBg', description: 'Remove image background' },
  ];

  const generateEnhancedUrl = (state = enhancements) => {
  const url = new URL(image.url);
  const tr: string[] = [];

  if (state.brightness !== 0) tr.push(`b-${state.brightness}`);
  if (state.contrast !== 0) tr.push(`c-${state.contrast}`);
  if (state.saturation !== 0) tr.push(`s-${state.saturation}`);
  if (state.sharpen > 0) tr.push(`sh-${state.sharpen}`);
  if (state.blur > 0) tr.push(`bl-${state.blur}`);
  if (state.rotate !== 0) tr.push(`r-${state.rotate}`);

  if (state.grayscale) tr.push('e-grayscale');
  if (state.sepia) tr.push('e-sepia');

  if (state.upscale) tr.push('e-upscale');
  if (state.retouch) tr.push('e-retouch');
  if (state.removeBg) tr.push('e-bgremove');

  if (tr.length > 0) {
    url.searchParams.set('tr', tr.join(','));
  } else {
    url.searchParams.delete('tr');
  }

  return url.toString();
};


 const updateEnhancement = (key: string, value: any) => {
  setEnhancements(prev => {
    const updated = { ...prev, [key]: value };
    setPreviewUrl(generateEnhancedUrl(updated));
    return updated;
  });
};


  const handleSave = () => {
    const enhancedUrl = generateEnhancedUrl();
    onSave(enhancedUrl);
    onClose();
  };

  const resetEnhancements = () => {
    setEnhancements({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpen: 0,
      blur: 0,
      pixelate: 0,
      rotate: 0,
      grayscale: false,
      sepia: false,
      upscale: false,
      retouch: false,
      removeBg: false,
    });
    setPreviewUrl(image.url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Enhance Image</h2>
            <p className="text-gray-600 mt-1">Apply ImageKit transformations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
          {/* Preview Panel */}
          <div className="lg:w-2/3 p-6 border-r border-gray-200 overflow-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview</h3>
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-300">
                <Image
                  src={previewUrl}
                  alt="Enhanced preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Original</p>
                <div className="relative h-24 rounded-lg overflow-hidden border">
                  <Image
                    src={image.url}
                    alt="Original"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Enhanced</p>
                <div className="relative h-24 rounded-lg overflow-hidden border border-blue-500">
                  <Image
                        src={`${previewUrl}&v=${Date.now()}`}
                        alt="Enhanced preview"
                        fill
                        unoptimized
                        className="object-contain"
                        />

                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:w-1/3 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Enhancement Tools</h3>

            {/* Basic Adjustments */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Basic Adjustments</h4>
              <div className="space-y-4">
                {enhancementTools.map((tool) => (
                  <div key={tool.param}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {tool.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {tool.value > 0 ? '+' : ''}{tool.value}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={tool.min}
                      max={tool.max}
                      step={tool.step}
                      value={tool.value}
                      onChange={(e) => updateEnhancement(tool.param, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Effects</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateEnhancement('grayscale', !enhancements.grayscale)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    enhancements.grayscale
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">Grayscale</span>
                </button>
                <button
                  onClick={() => updateEnhancement('sepia', !enhancements.sepia)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    enhancements.sepia
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">Sepia</span>
                </button>
              </div>
            </div>

            {/* AI Enhancements */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">AI Enhancements</h4>
              <div className="space-y-3">
                {aiEnhancements.map((tool) => (
                  <label
                    key={tool.key}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      enhancements[tool.key as keyof typeof enhancements]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{tool.name}</p>
                      <p className="text-xs text-gray-500">{tool.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enhancements[tool.key as keyof typeof enhancements] as boolean}
                      onChange={(e) => updateEnhancement(tool.key, e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={resetEnhancements}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Apply Enhancements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}