import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Sparkles, FileText, Download, Wand2, Upload, Clock, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { user, isPlusUser, isPremiumUser, isProUser } = useAuth();

  const handlePlanSelection = (plan: 'free' | 'plus' | 'premium' | 'pro') => {
    if (plan === 'free') {
      navigate('/editor');
      return;
    }

    // For paid plans, navigate to editor with plan selection
    navigate('/editor', { 
      state: { selectedPlan: plan },
      replace: true // Replace current history entry to prevent back button issues
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700"></div>

      <div className="relative z-10 w-[97%] mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Choose Your Perfect Plan
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto">
            From free basics to premium features, we have options for every need and budget.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
          {/* Free Plan */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-visible transition-transform hover:scale-105 flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Free</h2>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-500">Perfect for trying out our resume builder</p>
              <div className="mt-8">
                <p className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">$0</span>
                  <span className="ml-2 text-gray-500">/forever</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <Feature>Create unlimited resumes</Feature>
                <Feature>Basic templates (Classic, Split & Executive)</Feature>
                <Feature>Download with watermark</Feature>
                <Feature>Standard support</Feature>
              </ul>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={() => handlePlanSelection('free')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-visible transition-transform hover:scale-105 flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Plus</h2>
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <p className="mt-4 text-gray-500">For clean, professional downloads</p>
              <div className="mt-8">
                <p className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-blue-600">$6</span>
                  <span className="ml-2 text-gray-500">/one-time</span>
                </p>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Valid for 7 days
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <Feature>Everything in Free, plus:</Feature>
                <Feature>Watermark-free PDF downloads</Feature>
                <Feature>Premium templates (Creative, Minimalist, Professional, Modern)</Feature>
                <Feature>Priority support</Feature>
              </ul>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={() => handlePlanSelection('plus')}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isPlusUser
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPlusUser ? 'Access Plus' : 'Buy Now'}
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-visible transition-transform hover:scale-105 flex flex-col">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-8 py-2 rounded-full text-sm font-medium shadow-lg">
                Most Popular
              </span>
            </div>
            <div className="p-8 mt-2 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Premium</h2>
                <Wand2 className="h-8 w-8 text-purple-600" />
              </div>
              <p className="mt-4 text-gray-500">AI-powered resume enhancement</p>
              <div className="mt-8">
                <p className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-purple-600">$10</span>
                  <span className="ml-2 text-gray-500">/one-time</span>
                </p>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Valid for 7 days
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <Feature>Everything in Plus, plus:</Feature>
                <Feature>AI writing assistant</Feature>
                <Feature>Cover letter builder</Feature>
                <Feature>Smart content suggestions</Feature>
                <Feature>Job match analysis</Feature>
              </ul>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={() => handlePlanSelection('premium')}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isPremiumUser
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isPremiumUser ? 'Access Premium' : 'Buy Now'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-visible transition-transform hover:scale-105 flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Pro</h2>
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="mt-4 text-gray-500">Complete professional toolkit</p>
              <div className="mt-8">
                <p className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-indigo-600">$17</span>
                  <span className="ml-2 text-gray-500">/3 weeks</span>
                </p>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Subscription renews every 3 weeks
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <Feature>Everything in Premium, plus:</Feature>
                <Feature>Import from PDF/DOCX</Feature>
                <Feature>Import from LinkedIn</Feature>
                <Feature>Import from Indeed</Feature>
                <Feature>Automatic renewal</Feature>
                <Feature>Priority support</Feature>
              </ul>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={() => handlePlanSelection('pro')}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isProUser
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProUser ? 'Access Pro Features' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Compare Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold">Free</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Create unlimited resumes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Classic, Split & Executive layouts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Watermarked downloads
                </li>
              </ul>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Plus</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Clean PDF downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  All premium templates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  7-day access
                </li>
              </ul>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Premium</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  AI writing assistant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Cover letter builder
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Job match analysis
                </li>
              </ul>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">Pro</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  File uploads (PDF/DOCX)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  LinkedIn/Indeed import
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  3-week subscription
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0">
      <Check className="h-5 w-5 text-green-500" />
    </div>
    <p className="ml-3 text-base text-gray-500">{children}</p>
  </li>
);

export default Pricing;