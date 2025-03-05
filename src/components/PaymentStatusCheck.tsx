import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { checkPaymentStatus } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';

const PaymentStatusCheck: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSubscription } = useAuth();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Checking payment status...');

  useEffect(() => {
    const checkStatus = async () => {
      // Get session_id from URL query parameters
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      
      if (!sessionId) {
        return; // No session ID to check
      }
      
      try {
        // Check payment status
        const result = await checkPaymentStatus(sessionId);
        
        if (result.success) {
          setStatus('success');
          setMessage('Payment successful! Your account has been updated.');
          
          // Refresh subscription status
          await refreshSubscription();
          
          // Remove query parameters after a delay
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Payment verification failed. Please contact support.');
        }
      } catch (error: any) {
        console.error('Error checking payment status:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred while checking payment status.');
      }
    };
    
    checkStatus();
  }, [location, navigate, refreshSubscription]);

  // If no session_id in URL, don't render anything
  if (!new URLSearchParams(location.search).get('session_id')) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        {status === 'checking' && (
          <>
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Issue</h2>
          </>
        )}
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {status !== 'checking' && (
          <button
            onClick={() => navigate('/profile', { replace: true })}
            className={`px-4 py-2 rounded-md text-white ${
              status === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Go to Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusCheck;