'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Trash2, Award, Target, Star, Briefcase } from 'lucide-react';
import { BespokeFormData, Skill, ExperienceLevel } from './types';

interface ProfileFormProps {
  experienceLevels: Array<{
    id: ExperienceLevel;
    label: string;
    description: string;
  }>;
  onSubmit: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  experienceLevels,
  onSubmit,
  isSubmitting = false
}) => {
  const [skills, setSkills] = useState<Skill[]>([
    { name: '', proficiency: 'intermediate', yearsOfExperience: 0 }
  ]);
  const [techniques, setTechniques] = useState<string[]>(['']);
  const [materials, setMaterials] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Partial<BespokeFormData>>({
    mode: 'onChange',
    defaultValues: {
      businessName: '',
      tagline: '',
      bio: '',
      experience: 'intermediate',
      yearsOfExperience: 1,
      skills: [],
      techniques: [],
      materialsExpertise: [],
    },
  });

  const onFormSubmit: SubmitHandler<Partial<BespokeFormData>> = (data) => {
    const formData = {
      ...data,
      skills,
      techniques: techniques.filter(t => t.trim() !== ''),
      materialsExpertise: materials.filter(m => m.trim() !== ''),
    };
    onSubmit(formData);
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', proficiency: 'intermediate', yearsOfExperience: 0 }]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const addTechnique = () => {
    setTechniques([...techniques, '']);
  };

  const updateTechnique = (index: number, value: string) => {
    const updatedTechniques = [...techniques];
    updatedTechniques[index] = value;
    setTechniques(updatedTechniques);
  };

  const removeTechnique = (index: number) => {
    if (techniques.length > 1) {
      setTechniques(techniques.filter((_, i) => i !== index));
    }
  };

  const addMaterial = () => {
    setMaterials([...materials, '']);
  };

  const updateMaterial = (index: number, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = value;
    setMaterials(updatedMaterials);
  };

  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 2: Build Your Creator Profile</h4>
              <p className="text-sm text-blue-700 mt-1">
                Showcase your expertise and craftsmanship to attract clients.
              </p>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business/Studio Name *
            </label>
            <input
              id="businessName"
              type="text"
              {...register('businessName', {
                required: 'Business name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.businessName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="E.g., Stitched Perfection Studio"
            />
            {errors.businessName && (
              <p className="mt-2 text-sm text-red-600">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
              Tagline *
            </label>
            <input
              id="tagline"
              type="text"
              {...register('tagline', {
                required: 'Tagline is required',
                maxLength: { value: 200, message: 'Tagline cannot exceed 200 characters' },
              })}
              className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.tagline ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="E.g., Crafting bespoke elegance"
            />
            {errors.tagline && (
              <p className="mt-2 text-sm text-red-600">{errors.tagline.message}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biography *
          </label>
          <textarea
            id="bio"
            {...register('bio', {
              required: 'Biography is required',
              minLength: { value: 50, message: 'Please provide at least 50 characters' },
              maxLength: { value: 1000, message: 'Biography cannot exceed 1000 characters' },
            })}
            rows={4}
            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.bio ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Tell your story, your passion for craftsmanship, your journey, and what makes your work unique..."
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              {watch('bio')?.length || 0}/1000 characters
            </p>
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Experience Level *
            </label>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <label
                  key={level.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    watch('experience') === level.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('experience', { required: true })}
                    value={level.id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">{level.label}</span>
                    <p className="text-xs text-gray-500">{level.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience *
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              min="0"
              max="50"
              {...register('yearsOfExperience', {
                required: 'Years of experience is required',
                min: { value: 0, message: 'Must be 0 or more' },
                max: { value: 50, message: 'Must be 50 or less' },
              })}
              className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="5"
            />
            {errors.yearsOfExperience && (
              <p className="mt-2 text-sm text-red-600">{errors.yearsOfExperience.message}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Skills *
            </label>
            <button
              type="button"
              onClick={addSkill}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="E.g., Pattern Making, Embroidery, Leather Crafting"
                  />
                </div>
                <select
                  value={skill.proficiency}
                  onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={skill.yearsOfExperience || 0}
                  onChange={(e) => updateSkill(index, 'yearsOfExperience', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Years"
                />
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Techniques & Methods
            </label>
            <button
              type="button"
              onClick={addTechnique}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Technique
            </button>
          </div>
          <div className="space-y-2">
            {techniques.map((technique, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={technique}
                  onChange={(e) => updateTechnique(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E.g., French Seam, Hand Quilting, 3D Printing"
                />
                {techniques.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTechnique(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Materials Expertise */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Materials Expertise
            </label>
            <button
              type="button"
              onClick={addMaterial}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Material
            </button>
          </div>
          <div className="space-y-2">
            {materials.map((material, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => updateMaterial(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E.g., Silk, Leather, Ankara, Lace"
                />
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            !isValid || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Continue to Services'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;