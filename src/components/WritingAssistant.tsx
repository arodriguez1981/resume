import React, { useState } from 'react';
import { Sparkles, Wand2, Crown, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from './PaymentModal';
import AuthModal from './AuthModal';
import { WritingAssistantContext } from '../types/language';

interface WritingAssistantProps {
  content: string;
  onUpdate: (content: string) => void;
  type: 'summary' | 'skill' | 'coverletter';
  context?: WritingAssistantContext;
}

const WritingAssistant: React.FC<WritingAssistantProps> = ({ content, onUpdate, type, context }) => {
  const { user, isPremiumUser, isProUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [companyName, setCompanyName] = useState(context?.companyName || '');
  const [jobTitle, setJobTitle] = useState(context?.jobTitle || '');
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  
  // Check if free premium features are enabled
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';

  const handleButtonClick = () => {
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

    if (type === 'coverletter' && (!context?.jobTitle || !context?.companyName)) {
      setJobTitle(context?.jobTitle || '');
      setCompanyName(context?.companyName || '');
    }
    
    setIsOpen(true);
    setSelectedSuggestions(new Set());
  };

  const generateSuggestions = async () => {
    if (type === 'coverletter' && (!jobTitle || !companyName)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (type === 'coverletter') {
        const suggestions = [
          `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in software development and proven track record of delivering high-quality solutions, I am confident in my ability to contribute to your team's success.`,
          
          `As a passionate ${jobTitle.toLowerCase()}, I was excited to learn about the opportunity at ${companyName}. Your company's commitment to innovation and excellence aligns perfectly with my professional goals and values.`,
          
          `Through my experience as ${context?.experience?.[0]?.position} at ${context?.experience?.[0]?.company}, I have developed strong skills in ${context?.experience?.[0]?.description}. These experiences have prepared me well for the challenges and opportunities at ${companyName}.`,
          
          `I am particularly drawn to ${companyName}'s focus on [company values/projects]. My experience in [relevant skills/projects] would allow me to make immediate contributions to your team.`,
          
          `Thank you for considering my application. I am excited about the possibility of joining ${companyName} and would welcome the opportunity to discuss how I can contribute to your team's success.`
        ];
        setAiSuggestions(suggestions);
      } else if (type === 'summary') {
        const summaries = [
          `• ${experienceLevel} ${role} with a proven track record in building scalable solutions. Skilled in modern technologies and best practices.`,
          `• Results-driven ${role} with ${experienceLevel === 'Senior' ? '5+ years' : '2+ years'} of experience. Passionate about creating efficient, user-friendly solutions.`,
          `• Innovative ${role} specializing in ${additionalInfo || 'software development'} with expertise in modern frameworks and design principles.`,
          `• Detail-oriented professional with a strong foundation in ${role.toLowerCase()} principles and methodologies.`,
          `• Collaborative team player with excellent communication skills and a track record of successful project delivery.`
        ];
        setAiSuggestions(summaries);
      } else {
        const skillsByRole: Record<string, string[]> = {
          'frontend developer': [
            'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass',
            'Webpack', 'Redux', 'REST APIs', 'Responsive Design', 'UI/UX', 'Web Performance',
            'Jest', 'Cypress', 'Git', 'Agile'
          ],
          'backend developer': [
            'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
            'RESTful APIs', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Microservices',
            'System Design', 'CI/CD', 'Unit Testing', 'Git', 'Agile'
          ],
          'full stack developer': [
            'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'MongoDB', 'PostgreSQL',
            'RESTful APIs', 'HTML5', 'CSS3', 'Docker', 'AWS', 'Git', 'Agile',
            'System Design', 'Web Security', 'CI/CD', 'Testing'
          ],
          'devops engineer': [
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Ansible',
            'Linux', 'Shell Scripting', 'Python', 'CI/CD', 'Monitoring', 'Logging',
            'Security', 'Git', 'Agile', 'Infrastructure as Code'
          ],
          'data scientist': [
            'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow',
            'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Visualization',
            'Statistical Analysis', 'Big Data', 'Jupyter', 'Git'
          ],
          'mobile developer': [
            'Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS Development',
            'Android Development', 'Mobile UI Design', 'RESTful APIs', 'Git',
            'Mobile Security', 'App Store Deployment', 'Testing', 'Agile'
          ],
          'ui ux designer': [
            'Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing',
            'Prototyping', 'UI Design', 'UX Design', 'Design Systems',
            'User Testing', 'Accessibility', 'Typography', 'Color Theory'
          ]
        };

        const roleKey = role.toLowerCase();
        let relevantSkills: string[] = [];

        const matchingRole = Object.keys(skillsByRole).find(key => roleKey.includes(key));
        if (matchingRole) {
          relevantSkills = skillsByRole[matchingRole];
        } else {
          relevantSkills = [
            'Problem Solving',
            'Communication',
            'Project Management',
            'Team Collaboration',
            'Git',
            'Agile Methodologies',
            'Documentation',
            'Critical Thinking'
          ];
        }

        const numSkills = Math.floor(Math.random() * 5) + 8;
        const shuffled = relevantSkills.sort(() => 0.5 - Math.random());
        setAiSuggestions(shuffled.slice(0, numSkills));
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
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
    setIsOpen(true);
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
    if (type === 'summary') {
      const selectedSummaries = Array.from(selectedSuggestions)
        .sort((a, b) => a - b)
        .map(index => aiSuggestions[index])
        .join('\n');
      onUpdate(selectedSummaries);
    } else {
      const selectedSkills = Array.from(selectedSuggestions)
        .map(index => aiSuggestions[index])
        .join(', ');
      onUpdate(content ? `${content}, ${selectedSkills}` : selectedSkills);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={`absolute right-0 top-0 inline-flex items-center gap-1 px-3 py-2 text-sm rounded-tr-lg transition-colors ${
          isPremiumUser || isProUser || freePremiumFeatures
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Wand2 className="h-4 w-4" />
        Writing Assistant
        {!isPremiumUser && !isProUser && !freePremiumFeatures && (
          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
            <Crown className="h-3 w-3" />
          </span>
        )}
      </button>

      {isOpen && (isPremiumUser || isProUser || freePremiumFeatures) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">AI Writing Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {type === 'coverletter' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. Tech Corp"
                  />
                </div>
              </div>
            )}

            {type !== 'coverletter' && (
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {type === 'summary' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level *
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      >
                        <option value="">Select level</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead">Lead</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information (Optional)
                      </label>
                      <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Add any specific details you'd like to include..."
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Current {type === 'summary' ? 'Summary' : type === 'coverletter' ? 'Cover Letter' : 'Skills'}
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-600 text-sm whitespace-pre-wrap">
                {content || 'No content yet'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  AI Suggestions
                </h3>
                <button
                  onClick={generateSuggestions}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50"
                  disabled={loading || (type === 'coverletter' && (!jobTitle || !companyName))}
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? 'Generating...' : 'Generate Suggestions'}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Generating suggestions...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default WritingAssistant;