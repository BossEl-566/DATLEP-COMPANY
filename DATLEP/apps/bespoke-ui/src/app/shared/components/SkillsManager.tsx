// bespoke/components/SkillsManager.tsx
import React from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { Skill, ProficiencyLevel } from '../types/bespoke';

interface SkillsManagerProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  proficiencyLevels: Array<{ id: ProficiencyLevel; label: string }>;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ 
  skills, 
  onChange, 
  proficiencyLevels 
}) => {
  const updateSkill = (index: number, updates: Partial<Skill>) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const addSkill = () => {
    onChange([
      ...skills,
      {
        name: '',
        proficiency: 'basic',
        yearsOfExperience: undefined
      }
    ]);
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Skills & Expertise *</h3>
        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, { name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Pattern Making, Hand Stitching"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Proficiency Level *
                  </label>
                  <select
                    value={skill.proficiency}
                    onChange={(e) => updateSkill(index, { 
                      proficiency: e.target.value as ProficiencyLevel 
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={skill.yearsOfExperience || ''}
                    onChange={(e) => updateSkill(index, { 
                      yearsOfExperience: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Optional"
                  />
                </div>
              </div>
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No skills added yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Add your key skills to showcase your expertise
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;