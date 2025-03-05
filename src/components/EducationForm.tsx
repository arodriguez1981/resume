import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education = [], onChange }) => {
  const addEducation = () => {
    onChange([
      ...education,
      { school: '', degree: '', field: '', startDate: '', endDate: '' }
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updatedEducation);
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">School</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Field of Study</label>
            <input
              type="text"
              value={edu.field}
              onChange={(e) => updateEducation(index, 'field', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;