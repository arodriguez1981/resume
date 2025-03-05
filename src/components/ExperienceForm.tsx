import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Crown, X, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import PaymentModal from './PaymentModal';

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences = [], onChange }) => {
  const { user, isPremiumUser, isProUser } = useAuth();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);

  const addExperience = () => {
    onChange([
      ...experiences,
      { company: '', position: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const handleWritingAssistant = (index: number) => {
    if (!user) {
      setSelectedPlan('premium');
      setShowAuthModal(true);
      return;
    }

    if (!isPremiumUser && !isProUser) {
      setSelectedPlan('premium');
      setShowPaymentModal(true);
      return;
    }

    if (!experiences[index].position || !experiences[index].company) {
      alert('Please fill in both position and company fields first');
      return;
    }

    setActiveIndex(index);
    setSelectedSuggestions(new Set());
    setShowAIDialog(true);
    generateDescriptions(index);
  };

  const generateDescriptions = async (index: number) => {
    const { position, company } = experiences[index];
    
    setLoading(true);
    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate descriptions based on position and company
      const descriptions = [
        `Led and executed key ${position.toLowerCase()} initiatives at ${company}, driving significant improvements in system performance and team productivity.`,
        `Collaborated with cross-functional teams at ${company} to deliver high-quality solutions while maintaining best practices and code standards.`,
        `Spearheaded the development of innovative solutions as ${position} at ${company}, resulting in improved user experience and system reliability.`,
        `Managed end-to-end development lifecycle of critical projects at ${company}, consistently meeting deadlines and exceeding quality expectations.`,
        `Contributed to the growth of ${company}'s ${position.toLowerCase()} capabilities through technical leadership and implementation of modern practices.`
      ];

      setAiSuggestions(descriptions);
    } catch (error) {
      console.error('Error generating descriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedPlan) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (activeIndex !== null) {
      setShowAIDialog(true);
      generateDescriptions(activeIndex);
    }
  };

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const applySuggestions = () => {
    if (activeIndex === null) return;

    const selectedDescriptions = Array.from(selectedSuggestions)
      .sort((a, b) => a - b)
      .map(index => aiSuggestions[index])
      .join('\n');

    updateExperience(activeIndex, 'description', selectedDescriptions);
    setShowAIDialog(false);
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <button
              onClick={() => handleWritingAssistant(index)}
              className={`absolute right-0 top-0 inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                isPremiumUser || isProUser 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Wand2 className="h-4 w-4" />
              Writing Assistant
              {!isPremiumUser && !isProUser && (
                <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  <Crown className="h-3 w-3" />
                </span>
              )}
            </button>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </button>

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

      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">AI Writing Assistant</h2>
              </div>
              <button
                onClick={() => setShowAIDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Generating suggestions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSuggestion(index)}
                    className={`p-4 rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                      selectedSuggestions.has(index)
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSuggestions.has(index)
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedSuggestions.has(index) && <Check className="h-3 w-3" />}
                    </div>
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAIDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applySuggestions}
                disabled={selectedSuggestions.size === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Selected ({selectedSuggestions.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;