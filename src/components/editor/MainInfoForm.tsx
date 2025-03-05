import React from 'react';
import { FormData } from '../../types/resume';
import WritingAssistant from '../WritingAssistant';
import ExperienceForm from '../ExperienceForm';
import EducationForm from '../EducationForm';
import SkillsForm from '../SkillsForm';
import LanguagesForm from '../LanguagesForm';
import CertificationsForm from '../CertificationsForm';
import ProjectsForm from '../ProjectsForm';
import VolunteerForm from '../VolunteerForm';
import ReferencesForm from '../ReferencesForm';

interface MainInfoFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  t: (key: string) => string;
}

export const MainInfoForm: React.FC<MainInfoFormProps> = ({ formData, onChange, t }) => {
  return (
    <>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('personal.title')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('personal.fullName')}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
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
              onChange={(e) => onChange({ email: e.target.value })}
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
              onChange={(e) => onChange({ phone: e.target.value })}
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
              onChange={(e) => onChange({ location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="City, State, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('personal.website')}
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => onChange({ website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('personal.linkedin')}
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => onChange({ linkedin: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('summary.title')}</h2>
        <WritingAssistant
          content={formData.summary}
          onUpdate={(summary) => onChange({ summary })}
          type="summary"
        />
        <textarea
          value={formData.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 whitespace-pre-wrap"
          placeholder={t('summary.placeholder')}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('experience.title')}</h2>
        <ExperienceForm
          experiences={formData.experience}
          onChange={(experience) => onChange({ experience })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('education.title')}</h2>
        <EducationForm
          education={formData.education}
          onChange={(education) => onChange({ education })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('skills.title')}</h2>
        <WritingAssistant
          content={formData.skills.join(', ')}
          onUpdate={(skills) => onChange({ skills: skills.split(',').map(s => s.trim()).filter(Boolean) })}
          type="skill"
        />
        <SkillsForm
          skills={formData.skills}
          onChange={(skills) => onChange({ skills })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('languages.title')}</h2>
        <LanguagesForm
          languages={formData.languages}
          onChange={(languages) => onChange({ languages })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('certifications.title')}</h2>
        <CertificationsForm
          certifications={formData.certifications}
          onChange={(certifications) => onChange({ certifications })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('projects.title')}</h2>
        <ProjectsForm
          projects={formData.projects}
          onChange={(projects) => onChange({ projects })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('volunteer.title')}</h2>
        <VolunteerForm
          volunteer={formData.volunteer}
          onChange={(volunteer) => onChange({ volunteer })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('references.title')}</h2>
        <ReferencesForm
          references={formData.references}
          onChange={(references) => onChange({ references })}
        />
      </div>
    </>
  );
};