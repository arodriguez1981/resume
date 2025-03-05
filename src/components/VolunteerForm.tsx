import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Volunteer {
  organization: string;
  role: string;
  description: string;
}

interface VolunteerFormProps {
  volunteer: Volunteer[];
  onChange: (volunteer: Volunteer[]) => void;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ volunteer = [], onChange }) => {
  const addVolunteer = () => {
    onChange([
      ...volunteer,
      { organization: '', role: '', description: '' }
    ]);
  };

  const removeVolunteer = (index: number) => {
    onChange(volunteer.filter((_, i) => i !== index));
  };

  const updateVolunteer = (index: number, field: keyof Volunteer, value: string) => {
    const updatedVolunteer = volunteer.map((vol, i) => {
      if (i === index) {
        return { ...vol, [field]: value };
      }
      return vol;
    });
    onChange(updatedVolunteer);
  };

  return (
    <div className="space-y-6">
      {volunteer.map((vol, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeVolunteer(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization
              </label>
              <input
                type="text"
                value={vol.organization}
                onChange={(e) => updateVolunteer(index, 'organization', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={vol.role}
                onChange={(e) => updateVolunteer(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={vol.description}
                onChange={(e) => updateVolunteer(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addVolunteer}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Volunteer Experience
      </button>
    </div>
  );
};

export default VolunteerForm;