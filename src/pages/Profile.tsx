import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Crown, Sparkles, Calendar, CreditCard, LogOut, FileText, Download, Wand2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import PaymentHistoryRefresh from '../components/PaymentHistoryRefresh';

interface PaymentHistory {
  id: string;
  amount: number;
  plan: 'plus' | 'premium' | 'pro';
  status: string;
  created_at: string;
  stripe_session_id?: string;
  stripe_payment_intent?: string;
  stripe_subscription_id?: string;
  next_billing_date?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isPlusUser, isPremiumUser, isProUser, signOut, refreshSubscription } = useAuth();
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<{id: string, nextBillingDate?: string} | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('user_payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Fetched payments:', data);
        
        // Find active Pro subscription
        const proSubscription = data?.find(payment => 
          payment.plan === 'pro' && 
          payment.status === 'completed' && 
          payment.stripe_subscription_id
        );
        
        if (proSubscription) {
          setActiveSubscription({
            id: proSubscription.stripe_subscription_id || '',
            nextBillingDate: proSubscription.next_billing_date
          });
        } else {
          setActiveSubscription(null);
        }
        
        setPayments(data || []);
      } catch (err: any) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, navigate]);

  const handleSignOut = async () => {
    if (signingOut) return;
    
    try {
      setSigningOut(true);
      await signOut();
      // The redirect is handled in the signOut function
    } catch (error) {
      console.error('Error signing out:', error);
      setSigningOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getExpiryDate = (createdAt: string, plan: string) => {
    const date = new Date(createdAt);
    if (plan === 'plus' || plan === 'premium') {
      date.setDate(date.getDate() + 7); // 7 days for Plus and Premium
    } else if (plan === 'pro') {
      date.setDate(date.getDate() + 21); // 21 days (3 weeks) for Pro
    }
    return formatDate(date.toISOString());
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'plus':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <Download className="h-4 w-4" />
            Plus
          </span>
        );
      case 'premium':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
            <Crown className="h-4 w-4" />
            Premium
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Pro
          </span>
        );
      default:
        return null;
    }
  };

  const handleCancelSuccess = async () => {
    setShowCancelModal(false);
    
    // Show success message
    setError('Your subscription has been canceled successfully. You will still have access until the end of your current billing period.');
    
    // Refresh subscription status
    await refreshSubscription();
    
    // Refresh payment history
    try {
      const { data, error } = await supabase
        .from('user_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Error refreshing payment data:', err);
    }
  };

  const handlePaymentsRefresh = (refreshedPayments: PaymentHistory[]) => {
    setPayments(refreshedPayments);
    
    // Update active subscription if needed
    const proSubscription = refreshedPayments.find(payment => 
      payment.plan === 'pro' && 
      payment.status === 'completed' && 
      payment.stripe_subscription_id
    );
    
    if (proSubscription) {
      setActiveSubscription({
        id: proSubscription.stripe_subscription_id || '',
        nextBillingDate: proSubscription.next_billing_date
      });
    } else {
      setActiveSubscription(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700"></div>

      <div className="relative z-10 w-[97%] mx-auto px-4 py-12">
        {/* Profile Overview */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <User className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
              <div className="flex gap-3">
                {isPlusUser && !isPremiumUser && !isProUser && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    <Download className="h-4 w-4" />
                    Plus
                  </span>
                )}
                {isPremiumUser && !isProUser && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                    <Crown className="h-4 w-4" />
                    Premium
                  </span>
                )}
                {isProUser && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                    <Sparkles className="h-4 w-4" />
                    Pro
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Resume Builder</h3>
            </div>
            <p className="text-gray-600 mb-4">Create and customize your professional resume with our easy-to-use builder.</p>
            <button
              onClick={() => navigate('/editor')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create Resume →
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Downloads</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {isPlusUser || isPremiumUser || isProUser 
                ? 'Download watermark-free PDFs of your resumes.'
                : 'Upgrade to Plus for watermark-free downloads.'}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {isPlusUser || isPremiumUser || isProUser ? 'Download Resume →' : 'Upgrade Now →'}
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Wand2 className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold">AI Features</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {isPremiumUser || isProUser 
                ? 'Access AI-powered content suggestions and improvements.'
                : 'Upgrade to Premium for AI-powered features.'}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {isPremiumUser || isProUser ? 'Use AI Features →' : 'Upgrade to Premium →'}
            </button>
          </div>
        </div>

        {/* Subscription Management */}
        {isProUser && activeSubscription && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Subscription Management</h2>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Pro Plan
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-700 font-medium">Your Pro subscription renews every 3 weeks</p>
                {activeSubscription.nextBillingDate && (
                  <p className="text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Next billing date: {formatDate(activeSubscription.nextBillingDate)}
                  </p>
                )}
                <p className="text-gray-500 mt-1 text-sm">
                  Cancel at least 24 hours before the next billing date to avoid charges
                </p>
              </div>
              
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <PaymentHistoryRefresh onRefresh={handlePaymentsRefresh} />
          
          {error && (
            <div className={`mb-6 p-4 ${error.includes('canceled successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded-lg`}>
              {error}
              {!error.includes('canceled successfully') && (
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-2 underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading payment history...</p>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div>
                      {getPlanBadge(payment.plan)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.plan === 'plus' ? 'Plus Plan' : 
                         payment.plan === 'premium' ? 'Premium Plan' : 'Pro Plan'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(payment.created_at)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4" />
                        {payment.plan === 'pro' ? (
                          <span>Subscription - Renews every 3 weeks</span>
                        ) : (
                          <span>Valid until: {getExpiryDate(payment.created_at, payment.plan)}</span>
                        )}
                      </div>
                      {payment.stripe_session_id && (
                        <div className="text-xs text-gray-400 mt-1">
                          Session ID: {payment.stripe_session_id.substring(0, 10)}...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatAmount(payment.amount)}
                      </div>
                      <div className={`text-sm ${
                        payment.status === 'completed' 
                          ? 'text-green-600' 
                          : payment.status === 'canceled_at_period_end'
                          ? 'text-orange-600'
                          : 'text-gray-500'
                      }`}>
                        {payment.status === 'completed' ? 'Paid' : 
                         payment.status === 'canceled_at_period_end' ? 'Canceling' : 
                         'Pending'}
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment history found. If you recently made a payment, click the Refresh button above.
            </div>
          )}
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={handleCancelSuccess}
        subscriptionId={activeSubscription?.id}
        nextBillingDate={activeSubscription?.nextBillingDate}
      />
    </div>
  );
};

export default Profile;