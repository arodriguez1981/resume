import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Affiliation {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
}

interface ProfessionalAffiliationsFormProps {
  affiliations: Affiliation[];
  onChange: (affiliations: Affiliation[]) => void;
}

const ProfessionalAffiliationsForm: React.FC<ProfessionalAffiliationsFormProps> = ({ affiliations = [], onChange }) => {
  const addAffiliation = () => {
    onChange([
      ...affiliations,
      { organization: '', role: '', startDate: '', endDate: '' }
    ]);
  };

  const removeAffiliation = (index: number) => {
    onChange(affiliations.filter((_, i) => i !== index));
  };

  const updateAffiliation = (index: number, field: keyof Affiliation, value: string) => {
    const updatedAffiliations = affiliations.map((affiliation, i) => {
      if (i === index) {
        return { ...affiliation, [field]: value };
      }
      return affiliation;
    });
    onChange(updatedAffiliations);
  };

  return (
    <div className="space-y-6">
      {affiliations.map((affiliation, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeAffiliation(index)}
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
                value={affiliation.organization}
                onChange={(e) => updateAffiliation(index, 'organization', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Project Management Institute"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role/Membership Level
              </label>
              <input
                type="text"
                value={affiliation.role}
                onChange={(e) => updateAffiliation(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Member, Board Member"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="month"
                  value={affiliation.startDate}
                  onChange={(e) => updateAffiliation(index, 'startDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  value={affiliation.endDate}
                  onChange={(e) => updateAffiliation(index, 'endDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAffiliation}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Affiliation
      </button>
    </div>
  );
};

export default ProfessionalAffiliationsForm;