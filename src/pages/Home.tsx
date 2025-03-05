import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  FileText as FileText2, 
  Wand2,
  ChevronDown,
  ChevronUp,
  Upload,
  Clock,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isProUser, isPremiumUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative w-[97%] mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Create Your Professional Resume
              <span className="block text-blue-300">in Minutes</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200">
              Build and download your resume for free with <span className="font-semibold">Workinfi</span>. Upgrade to unlock premium features and AI-powered tools.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/editor"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:text-lg transition-colors"
              >
                Create Resume
              </Link>
              <Link
                to={isPremiumUser || isProUser ? "/coverletter" : "/pricing"}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:text-lg transition-colors"
              >
                Create Cover Letter
                {!isPremiumUser && !isProUser && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-400 text-white">
                    <Crown className="h-3 w-3" />
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="w-[97%] mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose <span className="text-blue-600">Workinfi</span> Resume?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to create a professional resume and cover letter
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={<FileText className="h-6 w-6" />}
                title="Free Resume Builder"
                description="Create and customize your resume with our easy-to-use builder. Basic templates included."
                image="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              <Feature
                icon={<Download className="h-6 w-6" />}
                title="Plus Plan"
                description="Get watermark-free PDF downloads with premium templates for just $6 for 7 days."
                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              <Feature
                icon={<Wand2 className="h-6 w-6" />}
                title="Premium Plan"
                description="Access AI suggestions, cover letter builder, and job match analysis for $10 for 7 days."
                image="https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              <Feature
                icon={<Sparkles className="h-6 w-6" />}
                title="Pro Plan"
                description="Get all features including LinkedIn/Indeed imports for $17 every 3 weeks."
                image="https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pro Features Section */}
      <div className="py-16">
        <div className="w-[97%] mx-auto px-4">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Premium & Pro Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Unlock advanced features with our Premium and Pro plans
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <div className="h-64 bg-blue-600 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="AI Writing Assistant"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center text-white">
                      <Wand2 className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">AI Writing Assistant</h3>
                      <p className="mt-2">Get smart suggestions for your resume content</p>
                      <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium & Pro
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="h-64 bg-purple-600 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1586297098710-0382a496c814?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Cover Letter Builder"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center text-white">
                      <FileText2 className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Cover Letter Builder</h3>
                      <p className="mt-2">Create matching cover letters with AI assistance</p>
                      <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium & Pro
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="h-64 bg-indigo-600 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="File Import"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center text-white">
                      <Upload className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">File & Social Imports</h3>
                      <p className="mt-2">Import resumes from PDF/DOCX files, LinkedIn and Indeed profiles</p>
                      <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500 text-white">
                        <Lock className="h-3 w-3 mr-1" />
                        Pro Only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="py-16 bg-gray-50">
        <div className="w-[97%] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  Free
                </h3>
                <p className="mt-4 text-4xl font-extrabold">$0</p>
                <p className="text-gray-500">Forever</p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Basic resume builder</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Watermarked downloads</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link
                  to="/editor"
                  className="block w-full py-2 px-4 text-center font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Plus Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-blue-600 flex items-center">
                  Plus
                </h3>
                <p className="mt-4 text-4xl font-extrabold">$6</p>
                <p className="text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  7 days access
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Watermark-free downloads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Premium templates</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link
                  to="/pricing"
                  className="block w-full py-2 px-4 text-center font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Choose Plus
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative flex flex-col">
              <div className="absolute top-0 inset-x-0">
                <div className="h-1 w-full bg-purple-600"></div>
                <div className="flex justify-center">
                  <span className="px-4 py-1 text-xs font-medium tracking-wider uppercase bg-purple-600 text-white rounded-b-md">
                    Popular
                  </span>
                </div>
              </div>
              <div className="p-6 pt-8 flex-grow">
                <h3 className="text-xl font-bold text-purple-600 flex items-center">
                  Premium
                </h3>
                <p className="mt-4 text-4xl font-extrabold">$10</p>
                <p className="text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  7 days access
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Everything in Plus</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">AI writing assistant</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Cover letter builder</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link
                  to="/pricing"
                  className="block w-full py-2 px-4 text-center font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
                >
                  Choose Premium
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-indigo-600 flex items-center">
                  Pro
                </h3>
                <p className="mt-4 text-4xl font-extrabold">$17</p>
                <p className="text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Every 3 weeks
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Everything in Premium</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">File & LinkedIn imports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-gray-600">Subscription renews automatically</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link
                  to="/pricing"
                  className="block w-full py-2 px-4 text-center font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Choose Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="w-[97%] mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                question: "Is it really free to create a resume?",
                answer: "Yes! You can create and edit your resume completely free. The free version includes a watermark. For watermark-free downloads and access to premium features, consider our Plus, Premium, or Pro plans."
              },
              {
                question: "What's the difference between Premium and Pro plans?",
                answer: "Premium includes AI-powered content suggestions, cover letter builder, and job match analysis for $10 with 7 days access. Pro includes everything in Premium plus file uploads and LinkedIn/Indeed imports for $17 every 3 weeks as a subscription."
              },
              {
                question: "Do I need to renew my subscription?",
                answer: "For Plus and Premium plans, these are one-time payments that give you access for a specific period (7 days). The Pro plan is a subscription that automatically renews every 3 weeks until you cancel."
              },
              {
                question: "How do I remove the watermark from my resume?",
                answer: "You can remove the watermark by purchasing our Plus plan ($6), Premium plan ($10), or Pro plan ($17). All paid plans give you access to watermark-free downloads."
              },
              {
                question: "Are my resume and data secure?",
                answer: "Yes, we take security seriously. All your data is encrypted and stored securely. We never share your personal information with third parties without your consent."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="w-[97%] mx-auto py-12 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to create your professional resume?
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Start building your career with our easy-to-use resume builder
            </p>
            <Link
              to="/editor"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description, image }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div className="h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
        <div className="absolute bottom-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;