import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Publication {
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

interface PublicationsFormProps {
  publications: Publication[];
  onChange: (publications: Publication[]) => void;
}

const PublicationsForm: React.FC<PublicationsFormProps> = ({ publications = [], onChange }) => {
  const addPublication = () => {
    onChange([
      ...publications,
      { title: '', publisher: '', date: '', url: '' }
    ]);
  };

  const removePublication = (index: number) => {
    onChange(publications.filter((_, i) => i !== index));
  };

  const updatePublication = (index: number, field: keyof Publication, value: string) => {
    const updatedPublications = publications.map((pub, i) => {
      if (i === index) {
        return { ...pub, [field]: value };
      }
      return pub;
    });
    onChange(updatedPublications);
  };

  return (
    <div className="space-y-6">
      {publications.map((pub, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removePublication(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publication Title
              </label>
              <input
                type="text"
                value={pub.title}
                onChange={(e) => updatePublication(index, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Machine Learning in Practice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publisher
              </label>
              <input
                type="text"
                value={pub.publisher}
                onChange={(e) => updatePublication(index, 'publisher', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., IEEE Journal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publication Date
              </label>
              <input
                type="month"
                value={pub.date}
                onChange={(e) => updatePublication(index, 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL (optional)
              </label>
              <input
                type="url"
                value={pub.url}
                onChange={(e) => updatePublication(index, 'url', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPublication}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Publication
      </button>
    </div>
  );
};

export default PublicationsForm;