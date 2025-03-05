import React from 'react';
import { FileText } from 'lucide-react';
import { formatBulletedText } from '../utils/formatters';

interface ModernLayoutProps {
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

const ModernLayout: React.FC<ModernLayoutProps> = ({ 
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
      {/* Header with accent color, name and personal info */}
      <div className="p-8 pb-12" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-8">
          {sections.photo && data.photo && (
            <div className="flex-shrink-0">
              <img
                src={data.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
            </div>
          )}
          
          <div className="flex-1 text-white">
            {personalInfoFields.fullName && data.fullName && (
              <h1 className="text-3xl font-bold mb-3 drop-shadow-md">
                {data.fullName}
              </h1>
            )}
            {data.experience && data.experience.length > 0 && (
              <h2 className="text-xl text-white/90 mb-4 drop-shadow-sm">
                {data.experience[0].position}
              </h2>
            )}
            <div className="flex flex-wrap gap-4">
              {renderPersonalInfo()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with two columns */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Left column for skills, languages, etc. */}
          <div className="col-span-1 space-y-8">
            {sections.skills && data.skills && data.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('skills.title')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {sections.languages && data.languages && data.languages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('languages.title')}
                </h2>
                <div className="space-y-2">
                  {data.languages.map((language: string, index: number) => (
                    <div key={index} className="text-gray-700">{language}</div>
                  ))}
                </div>
              </div>
            )}
            
            {sections.certifications && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('certifications.title')}
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column for summary, experience, education */}
          <div className="col-span-2 space-y-8">
            {sections.professional_summary && data.summary && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('summary.title')}
                </h2>
                <p className="text-gray-700 text-justify break-words whitespace-pre-wrap">
                  {formatBulletedText(data.summary)}
                </p>
              </div>
            )}
            
            {sections.work_experience && data.experience && data.experience.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('experience.title')}
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp: any, index: number) => (
                    <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: `${colors.primary}40` }}>
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                      <div className="mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate || t('present')}
                        </p>
                      </div>
                      <p className="text-gray-700">
                        {formatBulletedText(exp.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {sections.education && data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                  {t('education.title')}
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu: any, index: number) => (
                    <div key={index}>
                      <h3 className="text-lg font-medium text-gray-900">{edu.school}</h3>
                      <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate || t('present')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional sections in full width */}
        <div className="mt-8">
          {renderAdditionalSections(data, sections, colors)}
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;