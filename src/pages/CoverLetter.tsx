import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import WritingAssistant from '../components/WritingAssistant';
import { supabase } from '../lib/supabase';
import { Download, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { exportCoverLetter } from '../utils/exportUtils';

interface CoverLetterData {
  // From resume
  fullName: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  website: string;
  
  // Additional fields
  jobTitle: string;
  date: string;
  hiringManagerName: string;
  companyName: string;
  letterContent: string;
}

const CoverLetter = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const previewRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<CoverLetterData>({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    linkedin: '',
    website: '',
    jobTitle: '',
    date: new Date().toISOString().split('T')[0],
    hiringManagerName: '',
    companyName: '',
    letterContent: ''
  });

  useEffect(() => {
    const loadResumeData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('resume_drafts')
          .select('data')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data?.data) {
          const resumeData = data.data;
          setFormData(prev => ({
            ...prev,
            fullName: resumeData.fullName || '',
            phone: resumeData.phone || '',
            email: resumeData.email || '',
            location: resumeData.location || '',
            linkedin: resumeData.linkedin || '',
            website: resumeData.website || ''
          }));
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
    };

    loadResumeData();
  }, [user]);

  const handleFormChange = (field: keyof CoverLetterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      await exportCoverLetter(previewRef.current, true);
    } catch (error) {
      console.error('Error exporting cover letter:', error);
    }
  };

  const renderPersonalInfo = () => {
    const items = [];

    if (formData.fullName) {
      items.push(
        <p key="name" className="font-bold text-gray-900">{formData.fullName}</p>
      );
    }

    if (formData.phone) {
      items.push(
        <div key="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <p className="text-gray-700">{formData.phone}</p>
        </div>
      );
    }

    if (formData.email) {
      items.push(
        <div key="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <p className="text-gray-700">{formData.email}</p>
        </div>
      );
    }

    if (formData.location) {
      items.push(
        <div key="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <p className="text-gray-700">{formData.location}</p>
        </div>
      );
    }

    if (formData.website) {
      items.push(
        <div key="website" className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <p className="text-gray-700">{formData.website}</p>
        </div>
      );
    }

    if (formData.linkedin) {
      items.push(
        <div key="linkedin" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-gray-500" />
          <p className="text-gray-700">{formData.linkedin}</p>
        </div>
      );
    }

    return items.length > 0 ? (
      <div className="space-y-2">{items}</div>
    ) : (
      <p className="text-gray-500 italic">No personal information provided</p>
    );
  };

  const renderCompanyInfo = () => {
    if (!formData.date && !formData.hiringManagerName && !formData.companyName) {
      return (
        <p className="text-gray-500 italic">No company information provided</p>
      );
    }

    return (
      <>
        {formData.date && <p className="text-gray-700">{formData.date}</p>}
        {formData.hiringManagerName && <p className="text-gray-700">{formData.hiringManagerName}</p>}
        {formData.companyName && <p className="text-gray-700">{formData.companyName}</p>}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[97%] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('coverletter.title')}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('button.download')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            {/* Personal Info Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('coverletter.personalInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.fullName')}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.location')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.linkedin')}
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleFormChange('linkedin', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('personal.website')}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleFormChange('website', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('coverletter.jobDetails')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('coverletter.jobTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleFormChange('jobTitle', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('coverletter.jobTitlePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('coverletter.date')}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('coverletter.hiringManager')}
                  </label>
                  <input
                    type="text"
                    value={formData.hiringManagerName}
                    onChange={(e) => handleFormChange('hiringManagerName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('coverletter.hiringManagerPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('coverletter.company')}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleFormChange('companyName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('coverletter.companyPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Letter Content Section */}
            <div className="bg-white shadow rounded-lg p-6 relative">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('coverletter.content')}
              </h2>
              <WritingAssistant
                content={formData.letterContent}
                onUpdate={(content) => handleFormChange('letterContent', content)}
                type="coverletter"
                context={{
                  jobTitle: formData.jobTitle,
                  companyName: formData.companyName,
                  experience: user?.experience || []
                }}
              />
              <textarea
                value={formData.letterContent}
                onChange={(e) => handleFormChange('letterContent', e.target.value)}
                rows={12}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                placeholder={t('coverletter.contentPlaceholder')}
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-8 h-fit">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div 
                ref={previewRef} 
                className="p-[25.4mm]"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                {/* Add bleed area indicator */}
                <div 
                  className="absolute inset-0 border-2 border-dashed border-gray-200 pointer-events-none"
                  style={{
                    margin: '3mm',
                    display: 'none' // Hidden by default, can be shown for debugging
                  }}
                />

                {/* Content remains the same */}
                {renderPersonalInfo()}

                <div className="mt-8 text-left space-y-1">
                  {renderCompanyInfo()}
                </div>

                {formData.companyName && (
                  <hr className="my-6 border-gray-200" />
                )}

                <div className="mt-8 text-left">
                  <p className="text-gray-900">
                    Dear {formData.hiringManagerName || <span className="text-gray-500 italic">[Hiring Manager Name]</span>},
                  </p>
                </div>

                <div className="mt-6 text-gray-800 text-justify whitespace-pre-wrap leading-relaxed">
                  {formData.letterContent || (
                    <p className="text-gray-500 italic">No content provided</p>
                  )}
                </div>

                <div className="mt-8 text-left">
                  <p className="text-gray-900">Sincerely,</p>
                  <p className="mt-8 text-gray-900">
                    {formData.fullName || <span className="text-gray-500 italic">[Your Name]</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;