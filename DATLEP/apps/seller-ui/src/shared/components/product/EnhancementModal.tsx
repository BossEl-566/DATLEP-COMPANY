import { useState } from 'react';
import { X, RotateCw, Contrast, Droplets, Zap, Sparkles, Check, Sliders, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface EnhancementModalProps {
  image: { url: string; fileId: string };
  onClose: () => void;
  onSave: (enhancedUrl: string) => void;
}

type EnhancementState = {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpen: number;
  blur: number;
  pixelate: number;
  rotate: number;
  grayscale: boolean;
  sepia: boolean;
  upscale: boolean;
  retouch: boolean;
  removeBg: boolean;
};

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export default function EnhancementModal({ image, onClose, onSave }: EnhancementModalProps) {
  const [enhancements, setEnhancements] = useState<EnhancementState>({
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

  const [activeTab, setActiveTab] = useState<'basic' | 'effects' | 'ai'>('basic');
  const [previewUrl, setPreviewUrl] = useState(image.url);
  const [processingStates, setProcessingStates] = useState<Record<string, ProcessingState>>({
    upscale: 'idle',
    retouch: 'idle',
    removeBg: 'idle',
  });
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

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
    { 
      name: 'Upscale Resolution', 
      key: 'upscale', 
      description: 'Increase image resolution (takes 3-5 seconds)',
      processingTime: 3000
    },
    { 
      name: 'AI Retouch', 
      key: 'retouch', 
      description: 'Improve image quality (takes 2-4 seconds)',
      processingTime: 2000
    },
    { 
      name: 'Remove Background', 
      key: 'removeBg', 
      description: 'Remove image background (takes 4-6 seconds)',
      processingTime: 4000
    },
  ];

  // Simulate AI processing delay
  const simulateAIProcessing = async (key: string, value: boolean, processingTime: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, processingTime);
    });
  };

  const generateEnhancedUrl = (state: EnhancementState = enhancements) => {
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

    // Only add AI enhancements if they're done processing
    if (state.upscale && processingStates.upscale === 'success') tr.push('e-upscale');
    if (state.retouch && processingStates.retouch === 'success') tr.push('e-retouch');
    if (state.removeBg && processingStates.removeBg === 'success') tr.push('e-bgremove');

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

  const updateAIEnhancement = async (key: string, value: boolean, processingTime: number) => {
    if (!value) {
      // If turning off, just update immediately
      setProcessingStates(prev => ({ ...prev, [key]: 'idle' }));
      updateEnhancement(key, value);
      return;
    }

    // Show loading state
    setProcessingStates(prev => ({ ...prev, [key]: 'processing' }));
    
    // Simulate processing delay
    try {
      await simulateAIProcessing(key, value, processingTime);
      
      // Update to success state
      setProcessingStates(prev => ({ ...prev, [key]: 'success' }));
      
      // Update the enhancement value
      setEnhancements(prev => {
        const updated = { ...prev, [key]: value };
        setIsPreviewLoading(true);
        // Add a small delay to show loading state
        setTimeout(() => {
          setPreviewUrl(generateEnhancedUrl(updated));
          setIsPreviewLoading(false);
        }, 500);
        return updated;
      });
    } catch (error) {
      setProcessingStates(prev => ({ ...prev, [key]: 'error' }));
      // Revert the checkbox
      updateEnhancement(key, false);
    }
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
    setProcessingStates({
      upscale: 'idle',
      retouch: 'idle',
      removeBg: 'idle',
    });
    setPreviewUrl(image.url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl lg:max-w-6xl flex flex-col max-h-[98vh] sm:max-h-[95vh] mx-2">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Enhance Image</h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base truncate">Apply ImageKit transformations</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
          >
            <X size={18} className="sm:size-5 md:size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Preview Panel */}
          <div className="lg:w-2/3 p-3 sm:p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-auto">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2">Preview</h3>
              <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-gray-300 bg-gray-50">
                {isPreviewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                )}
                <Image
                  src={`${previewUrl}&v=${Date.now()}`}
                  alt="Enhanced preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                  unoptimized
                  onLoad={() => setIsPreviewLoading(false)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Original</p>
                <div className="relative h-14 sm:h-20 md:h-24 rounded-lg overflow-hidden border">
                  <Image
                    src={image.url}
                    alt="Original"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Enhanced</p>
                <div className="relative h-14 sm:h-20 md:h-24 rounded-lg overflow-hidden border border-blue-500">
                  {isPreviewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    </div>
                  )}
                  <Image
                    src={`${previewUrl}&v=${Date.now()}`}
                    alt="Enhanced preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:w-1/3 flex flex-col overflow-hidden min-w-0">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2 truncate">
                  <Sliders size={14} className="sm:size-4" />
                  <span className="truncate">Adjust</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('effects')}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'effects'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="truncate">Effects</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'ai'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2 truncate">
                  <Zap size={14} className="sm:size-4" />
                  <span className="truncate">AI</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 min-h-0">
              {activeTab === 'basic' && (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">Basic Adjustments</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {enhancementTools.map((tool) => (
                      <div key={tool.param} className="min-w-0">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                            {tool.name}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap ml-2">
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
                          className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">Effects</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => updateEnhancement('grayscale', !enhancements.grayscale)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                        enhancements.grayscale
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium text-center">Grayscale</span>
                    </button>
                    <button
                      onClick={() => updateEnhancement('sepia', !enhancements.sepia)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                        enhancements.sepia
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium text-center">Sepia</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">AI Enhancements</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {aiEnhancements.map((tool) => {
                      const isProcessing = processingStates[tool.key] === 'processing';
                      const isSuccess = processingStates[tool.key] === 'success';
                      
                      return (
                        <label
                          key={tool.key}
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-w-0 ${
                            enhancements[tool.key as keyof EnhancementState]
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${isProcessing ? 'opacity-75 cursor-wait' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">
                                {tool.name}
                              </p>
                              {isProcessing && (
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 animate-spin flex-shrink-0" />
                              )}
                              {isSuccess && (
                                <span className="text-xs text-green-600 flex-shrink-0">✓ Done</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">{tool.description}</p>
                          </div>
                          <div className="flex items-center ml-2">
                            <input
                              type="checkbox"
                              checked={enhancements[tool.key as keyof EnhancementState] as boolean}
                              onChange={(e) => updateAIEnhancement(tool.key, e.target.checked, tool.processingTime)}
                              disabled={isProcessing}
                              className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 sm:pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Note: AI enhancements may take a few seconds to process
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={resetEnhancements}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Reset All
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                <Check size={14} className="sm:size-4 md:size-5" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}