import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, User, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import PaymentModal from './PaymentModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isPremiumUser, isProUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  
  // Check if free premium features are enabled
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedPlan) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    navigate('/coverletter');
  };

  const handleCoverLetterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user && !freePremiumFeatures) {
      setSelectedPlan('premium');
      setShowAuthModal(true);
      return;
    }

    if (!isPremiumUser && !isProUser && !freePremiumFeatures) {
      setSelectedPlan('premium');
      setShowPaymentModal(true);
      return;
    }

    navigate('/coverletter');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-[97%] mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                <span className="text-blue-600">Workinfi</span> Resume
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/editor" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Resume
            </Link>
            <a 
              href="/coverletter"
              onClick={handleCoverLetterClick}
              className="inline-flex items-center gap-1 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cover Letter
              {!isPremiumUser && !isProUser && !freePremiumFeatures && (
                <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  <Crown className="h-3 w-3" />
                </span>
              )}
            </a>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">
                  {user.email}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        plan={selectedPlan || 'premium'}
      />
    </nav>
  );
};

export default Navbar;