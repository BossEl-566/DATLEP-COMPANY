// shared/components/SkillInput.tsx
import React, { useState } from 'react';
import { Plus, X, Star } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

interface SkillInputProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  proficiencyLevels: Array<{ id: string; label: string }>;
}

const SkillInput: React.FC<SkillInputProps> = ({
  skills,
  onChange,
  proficiencyLevels
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('basic');
  const [years, setYears] = useState<number | ''>('');

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        name: newSkill.trim(),
        proficiency: selectedProficiency as Skill['proficiency'],
        yearsOfExperience: years ? Number(years) : undefined
      };
      onChange([...skills, skill]);
      setNewSkill('');
      setYears('');
      setSelectedProficiency('basic');
    }
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Expertise
        </label>
        
        {/* Add new skill form */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Pattern Making, Hand Stitching"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <select
            value={selectedProficiency}
            onChange={(e) => setSelectedProficiency(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {proficiencyLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
            placeholder="Years"
            min="0"
            max="50"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={addSkill}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      {/* Skills list */}
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-gray-900">{skill.name}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                skill.proficiency === 'basic' ? 'bg-blue-100 text-blue-800' :
                skill.proficiency === 'intermediate' ? 'bg-green-100 text-green-800' :
                skill.proficiency === 'advanced' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {skill.proficiency}
              </span>
              {skill.yearsOfExperience && (
                <span className="text-sm text-gray-600">
                  {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
          <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No skills added yet</p>
          <p className="text-xs text-gray-500">Add your skills to showcase your expertise</p>
        </div>
      )}
    </div>
  );
};

export default SkillInput;