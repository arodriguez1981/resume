import React from 'react';
import { Settings2 } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/20 rounded-full">
            <Settings2 className="h-12 w-12 animate-spin-slow" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          We're Upgrading Our Services
        </h1>
        
        <p className="text-lg text-white/90 mb-6">
          We're currently performing scheduled maintenance to improve your resume building experience. We'll be back shortly with new features and improvements.
        </p>
        
        <div className="bg-white/20 rounded-lg p-4 mb-6">
          <p className="font-medium">Expected completion: Within 24 hours</p>
        </div>
        
        <div className="text-sm text-white/80">
          Questions? Contact us at{' '}
          <a href="mailto:support@workinfo_resume.com" className="underline hover:text-white">
            support@workinfo_resume.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;