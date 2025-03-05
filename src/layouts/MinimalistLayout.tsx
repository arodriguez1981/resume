import React from 'react';
import { formatBulletedText } from '../utils/formatters';

interface MinimalistLayoutProps {
  data: any;
  sections: any;
  colors: any;
  personalInfoFields: any;
  typography: any;
  renderPersonalInfo: () => React.ReactNode[];
  renderMainSections: (data: any, sections: any, colors: any) => React.ReactNode[];
  renderAdditionalSections: (data: any, sections: any, colors: any) => React.ReactNode[];
  t: (key: string) => string;
}

const MinimalistLayout: React.FC<MinimalistLayoutProps> = ({ 
  data, 
  sections, 
  colors, 
  personalInfoFields,
  typography,
  renderPersonalInfo,
  renderMainSections,
  renderAdditionalSections,
  t
}) => {
  return (
    <div className="min-h-[279.4mm] relative">
      {/* Clean, minimal header */}
      <div className="p-12 pb-6">
        <div className="flex justify-between items-center">
          <div>
            {personalInfoFields.fullName && (
              <h1 className="text-3xl font-light mb-1" style={{ color: colors.primary }}>
                {data.fullName || t('personal.fullName')}
              </h1>
            )}
            {data.experience && data.experience.length > 0 && (
              <h2 className="text-lg text-gray-600 font-light">
                {data.experience[0].position}
              </h2>
            )}
          </div>
          
          {sections.photo && data.photo && (
            <div className="flex-shrink-0">
              <img
                src={data.photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover grayscale"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle divider */}
      <div className="mx-12 h-px bg-gray-200"></div>
      
      {/* Contact information in a clean, horizontal layout */}
      <div className="px-12 py-4 flex flex-wrap gap-6 text-sm text-gray-600">
        {renderPersonalInfo()}
      </div>
      
      {/* Main content with minimalist design */}
      <div className="p-12 pt-8 grid grid-cols-1 gap-10">
        {/* Summary section */}
        {sections.professional_summary && data.summary && (
          <div>
            <h2 className="text-lg font-normal mb-4" style={{ color: colors.primary }}>
              {t('summary.title')}
            </h2>
            <p className="text-gray-700 text-justify break-words whitespace-pre-wrap leading-relaxed">
              {formatBulletedText(data.summary)}
            </p>
          </div>
        )}
        
        {/* Experience section */}
        {sections.work_experience && data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-normal mb-6" style={{ color: colors.primary }}>
              {t('experience.title')}
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || t('present')}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-base font-medium text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 mb-2">{exp.company}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {formatBulletedText(exp.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education section */}
        {sections.education && data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-normal mb-6" style={{ color: colors.primary }}>
              {t('education.title')}
            </h2>
            <div className="space-y-6">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate || t('present')}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-base font-medium text-gray-900">{edu.school}</h3>
                    <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills section */}
        {sections.skills && data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-normal mb-4" style={{ color: colors.primary }}>
              {t('skills.title')}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className="text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Languages section */}
        {sections.languages && data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-lg font-normal mb-4" style={{ color: colors.primary }}>
              {t('languages.title')}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.languages.map((language: string, index: number) => (
                <span key={index} className="text-gray-700">
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional sections with minimalist styling */}
        {renderAdditionalSections(data, sections, colors)}
      </div>
    </div>
  );
};

export default MinimalistLayout;