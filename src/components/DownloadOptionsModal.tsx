import React from 'react';
import { X, Download, Crown, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadFree: () => void;
  onDownloadPlus: () => void;
  onDownloadPremium: () => void;
  onDownloadPro: () => void;
  onUpgradePlus: () => void;
  onUpgradePremium: () => void;
  onUpgradePro: () => void;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({
  isOpen,
  onClose,
  onDownloadFree,
  onDownloadPlus,
  onDownloadPremium,
  onDownloadPro,
  onUpgradePlus,
  onUpgradePremium,
  onUpgradePro,
}) => {
  const { isPlusUser, isPremiumUser, isProUser } = useAuth();
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';

  // If modal is not open, return null immediately
  if (!isOpen) return null;

  // If free premium features are enabled, handle pro download and close
  if (freePremiumFeatures) {
    onDownloadPro();
    onClose();
    return null;
  }

  // If user is Pro, handle premium download and close
  if (isProUser) {
    onDownloadPro();
    onClose();
    return null;
  }

  // If user is Premium, handle premium download and close
  if (isPremiumUser) {
    onDownloadPremium();
    onClose();
    return null;
  }

  // If user is Plus, handle plus download and close
  if (isPlusUser) {
    onDownloadPlus();
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 40 }}>
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Download Options</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Option */}
          <div className="border rounded-lg flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Free</h3>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
              <ul className="space-y-2 mb-4 text-sm text-gray-600">
                <li>• Basic PDF format</li>
                <li>• Includes watermark</li>
                <li>• Instant download</li>
              </ul>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={onDownloadFree}
                className="w-full py-2 px-4 text-center font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Download Free
              </button>
            </div>
          </div>

          {/* Plus Option */}
          <div className="border rounded-lg flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Plus</h3>
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <ul className="space-y-2 mb-4 text-sm text-gray-600">
                <li>• No watermark</li>
                <li>• Premium templates</li>
                <li>• 7-day access</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                $6 one-time payment
              </p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={onUpgradePlus}
                className="w-full py-2 px-4 text-center font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Upgrade to Plus
              </button>
            </div>
          </div>

          {/* Premium Option */}
          <div className="border-2 border-purple-200 rounded-lg flex flex-col hover:shadow-md transition-shadow bg-purple-50">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Premium</h3>
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <ul className="space-y-2 mb-4 text-sm text-gray-600">
                <li>• Everything in Plus</li>
                <li>• AI writing assistant</li>
                <li>• Cover letter builder</li>
                <li>• 7-day access</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                $10 one-time payment
              </p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={onUpgradePremium}
                className="w-full py-2 px-4 text-center font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>

          {/* Pro Option */}
          <div className="border rounded-lg flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Pro</h3>
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <ul className="space-y-2 mb-4 text-sm text-gray-600">
                <li>• Everything in Premium</li>
                <li>• Import from PDF/DOCX</li>
                <li>• Import from LinkedIn</li>
                <li>• Import from Indeed</li>
                <li>• Subscription service</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                $17 every 3 weeks
              </p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={onUpgradePro}
                className="w-full py-2 px-4 text-center font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Subscribe to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptionsModal;