// shared/components/StepperProgress.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepperProgressProps {
  currentStep: number;
  steps: string[];
  icons: LucideIcon[];
  maxSteps: number;
}

const StepperProgress: React.FC<StepperProgressProps> = ({
  currentStep,
  steps,
  icons,
  maxSteps
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const Icon = icons[index];
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === stepNumber
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : currentStep > stepNumber
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {currentStep > stepNumber ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              {stepNumber < maxSteps && (
                <div
                  className={`w-32 h-1 mx-4 ${
                    currentStep > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm font-medium">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          return (
            <span
              key={step}
              className={
                currentStep === stepNumber
                  ? 'text-blue-700'
                  : currentStep > stepNumber
                  ? 'text-green-600'
                  : 'text-gray-500'
              }
            >
              {step}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StepperProgress;