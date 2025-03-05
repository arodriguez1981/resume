import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Award {
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface AwardsFormProps {
  awards: Award[];
  onChange: (awards: Award[]) => void;
}

const AwardsForm: React.FC<AwardsFormProps> = ({ awards = [], onChange }) => {
  const addAward = () => {
    onChange([
      ...awards,
      { name: '', issuer: '', date: '', description: '' }
    ]);
  };

  const removeAward = (index: number) => {
    onChange(awards.filter((_, i) => i !== index));
  };

  const updateAward = (index: number, field: keyof Award, value: string) => {
    const updatedAwards = awards.map((award, i) => {
      if (i === index) {
        return { ...award, [field]: value };
      }
      return award;
    });
    onChange(updatedAwards);
  };

  return (
    <div className="space-y-6">
      {awards.map((award, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeAward(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Award Name
              </label>
              <input
                type="text"
                value={award.name}
                onChange={(e) => updateAward(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Outstanding Achievement Award"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuing Organization
              </label>
              <input
                type="text"
                value={award.issuer}
                onChange={(e) => updateAward(index, 'issuer', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Tech Industry Association"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Received
              </label>
              <input
                type="month"
                value={award.date}
                onChange={(e) => updateAward(index, 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={award.description}
                onChange={(e) => updateAward(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the significance of this award..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAward}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Award
      </button>
    </div>
  );
};

export default AwardsForm;