import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PaymentHistoryRefreshProps {
  onRefresh: (payments: any[]) => void;
}

const PaymentHistoryRefresh: React.FC<PaymentHistoryRefreshProps> = ({ onRefresh }) => {
  const { user, refreshSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleRefresh = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // First refresh subscription status
      await refreshSubscription();
      
      // Then fetch latest payment data
      const { data, error } = await supabase
        .from('user_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Update parent component with new data
      onRefresh(data || []);
      
      setMessage({
        text: data && data.length > 0 
          ? `Successfully refreshed payment history. Found ${data.length} payments.` 
          : 'No payments found. If you recently made a payment, it may take a few minutes to appear.',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error refreshing payment data:', err);
      setMessage({
        text: err.message || 'Failed to refresh payment history',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {message && (
        <div className={`mt-4 p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded-lg`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryRefresh;