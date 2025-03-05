import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  suggestions: string[];
  onApply: (suggestion: string) => void;
}

const AIDialog: React.FC<AIDialogProps> = ({ isOpen, onClose, title, suggestions, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700">{suggestion}</p>
                <button
                  onClick={() => onApply(suggestion)}
                  className="flex-shrink-0 text-blue-600 hover:text-blue-700"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIDialog;