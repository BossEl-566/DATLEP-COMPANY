'use client';

import React from 'react';
import ProfileForm from '../components/ProfileForm';
import { BespokeFormData, ExperienceLevel } from '../components/types';

interface ProfileStepperProps {
  specializations?: Array<{
    id: string;
    label: string;
    icon: any;
    description: string;
  }>;
  experienceLevels?: Array<{
    id: ExperienceLevel;
    label: string;
    description: string;
  }>;
  africanCountries?: Array<{
    code: string;
    name: string;
    phoneCode: string;
  }>;
  selectedCountry?: string;
  onCountryChange?: (countryCode: string) => void;
  onSubmit?: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
}

const ProfileStepper: React.FC<ProfileStepperProps> = ({
  experienceLevels = [],
  onSubmit = () => {},
  isSubmitting = false
}) => {
  return (
    <ProfileForm
      experienceLevels={experienceLevels}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default ProfileStepper;