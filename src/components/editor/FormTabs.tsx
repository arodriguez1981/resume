import React from 'react';

interface FormTabsProps {
  activeTab: 'main' | 'additional';
  setActiveTab: (tab: 'main' | 'additional') => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6 bg-white sticky top-0 z-10">
      <button
        onClick={() => setActiveTab('main')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'main'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Main Info
      </button>
      <button
        onClick={() => setActiveTab('additional')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'additional'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Additional Info
      </button>
    </div>
  );
};