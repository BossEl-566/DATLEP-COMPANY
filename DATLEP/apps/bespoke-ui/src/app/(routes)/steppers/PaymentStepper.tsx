'use client';

import React from 'react';
import PaymentForm from '../components/PaymentForm';
import { BespokeFormData } from '../components/types';

interface PaymentStepperProps {
  onSubmit?: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
  sellerId?: string;
  shopId?: string;
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({
  onSubmit = () => {},
  isSubmitting = false,
  sellerId,
  shopId
}) => {
  return (
    <PaymentForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      sellerId={sellerId}
      shopId={shopId}
    />
  );
};

export default PaymentStepper;