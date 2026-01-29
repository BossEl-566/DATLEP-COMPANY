'use client';

import React from 'react';
import ServicesForm from '../components/ServicesForm';
import { BespokeFormData } from '../components/types';

interface ServicesStepperProps {
  onSubmit?: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
}

const ServicesStepper: React.FC<ServicesStepperProps> = ({
  onSubmit = () => {},
  isSubmitting = false
}) => {
  return (
    <ServicesForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default ServicesStepper;