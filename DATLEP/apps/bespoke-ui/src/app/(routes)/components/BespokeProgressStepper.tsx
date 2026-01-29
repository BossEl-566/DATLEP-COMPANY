'use client';

import React from 'react';
import { Check, Clock, User, Briefcase, CreditCard, Settings } from 'lucide-react';

interface BespokeProgressStepperProps {
  currentStep: number;
  signupStep: 'form' | 'otp' | 'profile' | 'services' | 'payment';
}

const BespokeProgressStepper: React.FC<BespokeProgressStepperProps> = ({
  currentStep,
  signupStep
}) => {
  const steps = [
    { id: 1, name: 'Account', icon: User, description: 'Basic Information' },
    { id: 2, name: 'Profile', icon: Briefcase, description: 'Creator Profile' },
    { id: 3, name: 'Services', icon: Settings, description: 'Services & Pricing' },
    { id: 4, name: 'Payment', icon: CreditCard, description: 'Bank & Payments' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isOtpStep = signupStep === 'otp' && step.id === 1;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isActive
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : isOtpStep ? (
                    <Clock className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm font-medium">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="text-center w-24">
              <span className={`block ${isActive ? 'text-purple-700 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                {step.name}
              </span>
              <span className="text-xs text-gray-500 mt-1 hidden md:block">
                {step.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BespokeProgressStepper;