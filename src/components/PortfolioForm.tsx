import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

interface PortfolioFormProps {
  portfolio: PortfolioItem[];
  onChange: (portfolio: PortfolioItem[]) => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ portfolio = [], onChange }) => {
  const addItem = () => {
    onChange([
      ...portfolio,
      { title: '', description: '', url: '' }
    ]);
  };

  const removeItem = (index: number) => {
    onChange(portfolio.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PortfolioItem, value: string) => {
    const updatedPortfolio = portfolio.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updatedPortfolio);
  };

  return (
    <div className="space-y-6">
      {portfolio.map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeItem(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Personal Website"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="url"
                value={item.url}
                onChange={(e) => updateItem(index, 'url', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Portfolio Item
      </button>
    </div>
  );
};

export default PortfolioForm;