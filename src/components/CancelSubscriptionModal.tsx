import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscriptionId?: string;
  nextBillingDate?: string;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  subscriptionId,
  nextBillingDate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancel = async () => {
    if (!confirmed) {
      setError('Please confirm that you understand the cancellation policy');
      return;
    }

    if (!subscriptionId) {
      setError('Subscription ID is missing. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the Supabase Edge Function to cancel the subscription
      const { error: cancelError } = await supabase.functions.invoke('cancel-subscription', {
        body: { 
          subscriptionId,
          reason: reason || 'No reason provided'
        }
      });

      if (cancelError) throw new Error(cancelError.message);
      
      // If successful, call onSuccess
      onSuccess();
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      setError(err.message || 'Failed to cancel subscription. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Cancel Pro Subscription</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Your Pro subscription will remain active until the end of your current billing period. After that, you will lose access to Pro features.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Current billing period ends:</span>
            </div>
            <p className="text-gray-700 ml-7">{formatDate(nextBillingDate)}</p>
            
            <div className="flex items-center gap-2 mt-3 mb-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Cancellation deadline:</span>
            </div>
            <p className="text-gray-700 ml-7">
              One day before the billing date to avoid charges
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you canceling? (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Select a reason</option>
              <option value="too_expensive">Too expensive</option>
              <option value="not_using">Not using the service enough</option>
              <option value="missing_features">Missing features I need</option>
              <option value="found_alternative">Found an alternative</option>
              <option value="temporary_pause">Temporarily pausing my subscription</option>
              <option value="other">Other reason</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">
                I understand that my subscription will remain active until the end of the current billing period, and I will be charged if I cancel less than 24 hours before the next billing date.
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;