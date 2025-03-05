import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 50 }}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Reset Form Data
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to reset all form data? This action cannot be undone and you will lose all your current progress.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDialog;