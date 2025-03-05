import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw, Upload, Settings2, FileText, Crown } from 'lucide-react';
import { useResumeCustomization } from '../contexts/ResumeCustomizationContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { saveDraft, loadDraft } from '../lib/draftManager';
import { exportResume } from '../utils/exportUtils';

// Components
import ResumePreview from '../components/ResumePreview';
import CustomizationPanel from '../components/CustomizationPanel';
import DownloadMenu from '../components/DownloadMenu';
import LanguageSelector from '../components/LanguageSelector';
import ResetDialog from '../components/ResetDialog';
import ImportModal from '../components/ImportModal';

// Modals
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import DownloadOptionsModal from '../components/DownloadOptionsModal';

// Form sections
import { FormTabs } from '../components/editor/FormTabs';
import { MainInfoForm } from '../components/editor/MainInfoForm';
import { AdditionalInfoForm } from '../components/editor/AdditionalInfoForm';

// Types
import { FormData } from '../types/resume';

const Editor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPlusUser, isPremiumUser, isProUser } = useAuth();
  const { t } = useLanguage();
  const { sections, colors, personalInfoFields } = useResumeCustomization();
  
  // UI state
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'premium' | 'pro' | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'additional'>('main');
  
  // Draft saving state
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number>();
  const initialLoadRef = useRef(true);
  const previewRef = useRef<HTMLDivElement>(null);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    // Main Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    volunteer: [],
    references: [],

    // Additional Info
    professionalObjective: '',
    publications: [],
    awards: [],
    additionalCourses: [],
    professionalAffiliations: [],
    portfolio: [],
    personalInterests: '',
    availability: {
      relocation: false,
      remote: false,
      startDate: '',
      notice: '',
      preferences: ''
    }
  });

  // Load draft data when user is authenticated
  useEffect(() => {
    const loadDraftData = async () => {
      if (!user || !initialLoadRef.current) return;

      try {
        const data = await loadDraft(user.id);
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        initialLoadRef.current = false;
      }
    };

    loadDraftData();
  }, [user]);

  // Auto-save draft data when form changes
  useEffect(() => {
    if (!user || initialLoadRef.current) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveDraft(user.id, formData);
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, user]);

  // Handle plan selection from URL state
  useEffect(() => {
    const state = location.state as { selectedPlan?: 'plus' | 'premium' | 'pro' };
    if (state?.selectedPlan) {
      setSelectedPlan(state.selectedPlan);
      setShowPaymentModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Form data update handler
  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Export handlers
  const handleExport = async () => {
    if (isProUser || isPremiumUser || isPlusUser) {
      try {
        await exportResume(previewRef.current, true);
      } catch (error) {
        console.error('Error exporting resume:', error);
      }
    } else {
      setShowDownloadOptions(true);
    }
  };

  const handleDownloadFree = async () => {
    setShowDownloadOptions(false);
    try {
      await exportResume(previewRef.current, false);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  const handleDownloadPlus = async () => {
    setShowDownloadOptions(false);
    try {
      await exportResume(previewRef.current, true);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  const handleDownloadPremium = async () => {
    setShowDownloadOptions(false);
    try {
      await exportResume(previewRef.current, true);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  const handleDownloadPro = async () => {
    setShowDownloadOptions(false);
    try {
      await exportResume(previewRef.current, true);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  // Upgrade plan handlers
  const handleUpgradePlus = () => {
    if (!user) {
      setShowDownloadOptions(false);
      setSelectedPlan('plus');
      setShowAuthModal(true);
      return;
    }

    setShowDownloadOptions(false);
    setSelectedPlan('plus');
    setShowPaymentModal(true);
  };

  const handleUpgradePremium = () => {
    if (!user) {
      setShowDownloadOptions(false);
      setSelectedPlan('premium');
      setShowAuthModal(true);
      return;
    }

    setShowDownloadOptions(false);
    setSelectedPlan('premium');
    setShowPaymentModal(true);
  };

  const handleUpgradePro = () => {
    if (!user) {
      setShowDownloadOptions(false);
      setSelectedPlan('pro');
      setShowAuthModal(true);
      return;
    }

    setShowDownloadOptions(false);
    setSelectedPlan('pro');
    setShowPaymentModal(true);
  };

  // Auth and payment handlers
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedPlan) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (selectedPlan === 'plus' || selectedPlan === 'premium' || selectedPlan === 'pro') {
      exportResume(previewRef.current, true);
    }
  };

  // Reset form handler
  const handleReset = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      volunteer: [],
      references: [],
      professionalObjective: '',
      publications: [],
      awards: [],
      additionalCourses: [],
      professionalAffiliations: [],
      portfolio: [],
      personalInterests: '',
      availability: {
        relocation: false,
        remote: false,
        startDate: '',
        notice: '',
        preferences: ''
      }
    });
    setShowResetDialog(false);
  };

  // Import handler
  const handleImport = (data: any) => {
    setFormData(data);
    setShowImportModal(false);
  };

  // Cover letter handler
  const handleCoverLetterClick = () => {
    if (!user) {
      setShowAuthModal(true);
      setSelectedPlan('premium');
      return;
    }
    if (!isPremiumUser && !isProUser) {
      setShowPaymentModal(true);
      setSelectedPlan('premium');
      return;
    }
    navigate('/coverletter');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[97%] mx-auto px-4 py-8">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('button.reset')}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('button.import')}
            </button>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <button
                onClick={() => setShowCustomization(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {t('button.customize')}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCoverLetterClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Create cover letter
              {!isPremiumUser && !isProUser && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500 text-white">
                  <Crown className="h-3 w-3" />
                </span>
              )}
            </button>
            <DownloadMenu 
              onExport={handleExport}
              onShowOptions={() => setShowDownloadOptions(true)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form section - 40% width */}
          <div className="w-full lg:w-[40%] overflow-y-auto max-h-[calc(100vh-180px)]">
            {/* Tabs */}
            <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Info Tab */}
            {activeTab === 'main' && (
              <MainInfoForm 
                formData={formData} 
                onChange={handleFormDataChange} 
                t={t} 
              />
            )}

            {/* Additional Info Tab */}
            {activeTab === 'additional' && (
              <AdditionalInfoForm 
                formData={formData} 
                onChange={handleFormDataChange} 
                t={t} 
              />
            )}
          </div>

          {/* Preview section - 60% width */}
          <div className="w-full lg:w-[60%]">
            <div className="sticky top-8" ref={previewRef}>
              <ResumePreview data={formData} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCustomization && (
        <CustomizationPanel onClose={() => setShowCustomization(false)} />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedPlan(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlan(null);
        }}
        onSuccess={handlePaymentSuccess}
        plan={selectedPlan || 'premium'}
      />

      <DownloadOptionsModal
        isOpen={showDownloadOptions}
        onClose={() => setShowDownloadOptions(false)}
        onDownloadFree={handleDownloadFree}
        onDownloadPlus={handleDownloadPlus}
        onDownloadPremium={handleDownloadPremium}
        onDownloadPro={handleDownloadPro}
        onUpgradePlus={handleUpgradePlus}
        onUpgradePremium={handleUpgradePremium}
        onUpgradePro={handleUpgradePro}
      />

      <ResetDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleConfirmReset}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default Editor;