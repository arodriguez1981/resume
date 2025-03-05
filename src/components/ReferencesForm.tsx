import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Reference {
  name: string;
  position: string;
  company: string;
  contact: string;
}

interface ReferencesFormProps {
  references: Reference[];
  onChange: (references: Reference[]) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ references = [], onChange }) => {
  const addReference = () => {
    onChange([
      ...references,
      { name: '', position: '', company: '', contact: '' }
    ]);
  };

  const removeReference = (index: number) => {
    onChange(references.filter((_, i) => i !== index));
  };

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const updatedReferences = references.map((ref, i) => {
      if (i === index) {
        return { ...ref, [field]: value };
      }
      return ref;
    });
    onChange(updatedReferences);
  };

  return (
    <div className="space-y-6">
      {references.map((ref, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeReference(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference Name
              </label>
              <input
                type="text"
                value={ref.name}
                onChange={(e) => updateReference(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                value={ref.position}
                onChange={(e) => updateReference(index, 'position', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={ref.company}
                onChange={(e) => updateReference(index, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <input
                type="text"
                value={ref.contact}
                onChange={(e) => updateReference(index, 'contact', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Email or phone number"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addReference}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Reference
      </button>
    </div>
  );
};

export default ReferencesForm;