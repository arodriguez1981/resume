import React from 'react';
import { FormData } from '../../types/resume';
import WritingAssistant from '../WritingAssistant';
import PublicationsForm from '../PublicationsForm';
import AwardsForm from '../AwardsForm';
import AdditionalCoursesForm from '../AdditionalCoursesForm';
import ProfessionalAffiliationsForm from '../ProfessionalAffiliationsForm';
import PortfolioForm from '../PortfolioForm';
import AvailabilityForm from '../AvailabilityForm';

interface AdditionalInfoFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  t: (key: string) => string;
}

export const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ formData, onChange, t }) => {
  return (
    <>
      <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Objective</h2>
        <WritingAssistant
          content={formData.professionalObjective}
          onUpdate={(objective) => onChange({ professionalObjective: objective })}
          type="summary"
        />
        <textarea
          value={formData.professionalObjective}
          onChange={(e) => onChange({ professionalObjective: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 whitespace-pre-wrap"
          placeholder="Write your professional objective..."
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Publications</h2>
        <PublicationsForm
          publications={formData.publications}
          onChange={(publications) => onChange({ publications })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Awards & Recognition</h2>
        <AwardsForm
          awards={formData.awards}
          onChange={(awards) => onChange({ awards })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Courses</h2>
        <AdditionalCoursesForm
          courses={formData.additionalCourses}
          onChange={(additionalCourses) => onChange({ additionalCourses })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Affiliations</h2>
        <ProfessionalAffiliationsForm
          affiliations={formData.professionalAffiliations}
          onChange={(professionalAffiliations) => onChange({ professionalAffiliations })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio</h2>
        <PortfolioForm
          portfolio={formData.portfolio}
          onChange={(portfolio) => onChange({ portfolio })}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Interests</h2>
        <WritingAssistant
          content={formData.personalInterests}
          onUpdate={(interests) => onChange({ personalInterests: interests })}
          type="summary"
        />
        <textarea
          value={formData.personalInterests}
          onChange={(e) => onChange({ personalInterests: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 whitespace-pre-wrap"
          placeholder="Describe your personal interests and hobbies..."
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Availability & Relocation</h2>
        <AvailabilityForm
          availability={formData.availability}
          onChange={(availability) => onChange({ availability })}
        />
      </div>
    </>
  );
};