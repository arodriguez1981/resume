import React, { useState, useEffect } from 'react';
import { X, CreditCard, Clock } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: 'plus' | 'premium' | 'pro';
  id?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, plan: initialPlan, id }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<'plus' | 'premium' | 'pro'>(initialPlan);
  const { refreshSubscription, user } = useAuth();
  const showTestCards = import.meta.env.VITE_SHOW_TEST_CARDS === 'true';

  // Test card details
  const testCard = {
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123'
  };

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  // Check if the plan was changed via data attribute
  useEffect(() => {
    if (id) {
      const modalElement = document.getElementById(id);
      if (modalElement) {
        const dataPlan = modalElement.getAttribute('data-plan') as 'plus' | 'premium' | 'pro';
        if (dataPlan && ['plus', 'premium', 'pro'].includes(dataPlan)) {
          setPlan(dataPlan);
        }
      }
    }
  }, [isOpen, id]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await createCheckoutSession(plan);
      // Note: We don't call onSuccess here since the user will be redirected to Stripe
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const getPlanDetails = () => {
    switch (plan) {
      case 'plus':
        return {
          title: 'Plus',
          amount: 6,
          description: 'Watermark-free downloads and premium templates for 7 days',
          color: 'blue'
        };
      case 'premium':
        return {
          title: 'Premium',
          amount: 10,
          description: 'AI features, cover letter builder, and watermark-free downloads for 7 days',
          color: 'purple'
        };
      case 'pro':
        return {
          title: 'Pro',
          amount: 17,
          description: 'All features including LinkedIn/Indeed import for 15 days',
          color: 'indigo'
        };
      default:
        return {
          title: 'Unknown',
          amount: 0,
          description: '',
          color: 'gray'
        };
    }
  };

  const planDetails = getPlanDetails();
  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-200',
      bgLight: 'bg-blue-50'
    },
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
      border: 'border-purple-200',
      bgLight: 'bg-purple-50'
    },
    indigo: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-700',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      bgLight: 'bg-indigo-50'
    },
    gray: {
      bg: 'bg-gray-600',
      hover: 'hover:bg-gray-700',
      text: 'text-gray-600',
      border: 'border-gray-200',
      bgLight: 'bg-gray-50'
    }
  };

  const colors = colorClasses[planDetails.color];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 45 }} id={id || undefined}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Upgrade to {planDetails.title}</h2>
        <p className="text-gray-600 mb-6">{planDetails.description}</p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Plan Selection */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <button 
            onClick={() => setPlan('plus')}
            className={`p-3 rounded-lg text-center ${plan === 'plus' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 hover:bg-blue-50'}`}
          >
            <div className="font-medium">Plus</div>
            <div className="text-lg font-bold">$6</div>
            <div className="text-xs text-gray-500">7 days</div>
          </button>
          
          <button 
            onClick={() => setPlan('premium')}
            className={`p-3 rounded-lg text-center ${plan === 'premium' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50 hover:bg-purple-50'}`}
          >
            <div className="font-medium">Premium</div>
            <div className="text-lg font-bold">$10</div>
            <div className="text-xs text-gray-500">7 days</div>
          </button>
          
          <button 
            onClick={() => setPlan('pro')}
            className={`p-3 rounded-lg text-center ${plan === 'pro' ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-gray-50 hover:bg-indigo-50'}`}
          >
            <div className="font-medium">Pro</div>
            <div className="text-lg font-bold">$17</div>
            <div className="text-xs text-gray-500">15 days</div>
          </button>
        </div>

        <div className={`p-6 rounded-lg mb-6 ${colors.bgLight} border ${colors.border}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{planDetails.title} Plan</span>
            <span className="text-2xl font-bold">${planDetails.amount}</span>
          </div>
          <p className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {plan === 'plus' || plan === 'premium' 
              ? '7-day access' 
              : '15-day access'}
          </p>
        </div>

        {showTestCards && (
          <div className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <CreditCard className="h-5 w-5" />
              <h3 className="font-medium">Test Card Details</h3>
            </div>
            <div className="space-y-1 text-sm text-blue-600">
              <p>Card Number: {testCard.number}</p>
              <p>Expiry: {testCard.expiry}</p>
              <p>CVC: {testCard.cvc}</p>
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white transition-colors ${colors.bg} ${colors.hover} disabled:opacity-50`}
        >
          {loading ? 'Redirecting to Stripe...' : `Pay $${planDetails.amount}`}
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Secure payment processing by Stripe. One-time payment for {plan === 'pro' ? '15 days' : '7 days'} of access.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;