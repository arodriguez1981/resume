import React from 'react';
import { Printer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DownloadMenuProps {
  onExport: () => void;
  onShowOptions: () => void;
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({ 
  onExport, 
  onShowOptions 
}) => {
  const { isPlusUser, isPremiumUser, isProUser } = useAuth();
  
  // Check if free premium features are enabled
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';
  
  // Determine if user has premium access
  const hasPremiumAccess = isPlusUser || isPremiumUser || isProUser || freePremiumFeatures;

  const handleExportClick = () => {
    if (hasPremiumAccess) {
      onExport();
    } else {
      onShowOptions();
    }
  };

  return (
    <button
      onClick={handleExportClick}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      <Printer className="h-4 w-4 mr-2" />
      Export
    </button>
  );
};

export default DownloadMenu;