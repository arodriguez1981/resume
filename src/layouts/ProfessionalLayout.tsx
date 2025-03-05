import React from 'react';
import { FileText } from 'lucide-react';
import { formatBulletedText } from '../utils/formatters';

interface ProfessionalLayoutProps {
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

const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({ 
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
      {/* Professional header with subtle accent */}
      <div className="p-10 border-b-4" style={{ borderColor: colors.primary }}>
        <div className="flex items-center gap-8">
          {sections.photo && data.photo && (
            <div className="flex-shrink-0">
              <img
                src={data.photo}
                alt="Profile"
                className="w-28 h-28 rounded-md object-cover border"
                style={{ borderColor: colors.primary }}
              />
            </div>
          )}
          
          <div className="flex-1">
            {personalInfoFields.fullName && (
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                {data.fullName || t('personal.fullName')}
              </h1>
            )}
            {data.experience && data.experience.length > 0 && (
              <h2 className="text-xl text-gray-700 mb-3">
                {data.experience[0].position}
              </h2>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm">
              {renderPersonalInfo()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with professional layout */}
      <div className="grid grid-cols-12 gap-0">
        {/* Left sidebar - 4 columns */}
        <div className="col-span-4 bg-gray-50 p-8 min-h-full">
          {/* Summary section */}
          {sections.professional_summary && data.summary && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('summary.title')}
              </h2>
              <p className="text-gray-700 text-justify break-words whitespace-pre-wrap">
                {formatBulletedText(data.summary)}
              </p>
            </div>
          )}
          
          {/* Skills section */}
          {sections.skills && data.skills && data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('skills.title')}
              </h2>
              <div className="space-y-1">
                {data.skills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages section */}
          {sections.languages && data.languages && data.languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('languages.title')}
              </h2>
              <div className="space-y-1">
                {data.languages.map((language: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                    <span className="text-gray-700">{language}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications section */}
          {sections.certifications && data.certifications && data.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('certifications.title')}
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    <p className="text-sm text-gray-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education section */}
          {sections.education && data.education && data.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('education.title')}
              </h2>
              <div className="space-y-4">
                {data.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900">{edu.school}</h3>
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
        
        {/* Main content area - 8 columns */}
        <div className="col-span-8 p-8">
          {/* Experience section */}
          {sections.work_experience && data.experience && data.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('experience.title')}
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp: any, index: number) => (
                  <div key={index}>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
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
          
          {/* Projects section */}
          {sections.projects && data.projects && data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('projects.title')}
              </h2>
              <div className="space-y-4">
                {data.projects.map((project: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="text-gray-700">{project.description}</p>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {project.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Volunteer section */}
          {sections.volunteer && data.volunteer && data.volunteer.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('volunteer.title')}
              </h2>
              <div className="space-y-4">
                {data.volunteer.map((vol: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-900">{vol.role}</h3>
                    <p className="text-gray-600">{vol.organization}</p>
                    <p className="text-gray-700">{vol.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* References section */}
          {sections.references && data.references && data.references.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('references.title')}
              </h2>
              <div className="space-y-4">
                {data.references.map((ref: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-900">{ref.name}</h3>
                    <p className="text-gray-600">{ref.position} at {ref.company}</p>
                    <p className="text-gray-500">{ref.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional sections */}
          {renderAdditionalSections(data, sections, colors)}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLayout;