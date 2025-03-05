import React from 'react';
import { FileText, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { formatBulletedText } from '../utils/formatters';

interface ExecutiveLayoutProps {
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

const ExecutiveLayout: React.FC<ExecutiveLayoutProps> = ({ 
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
      {/* Header with name and title */}
      <div className="p-8 border-b-4" style={{ borderColor: colors.primary }}>
        <div className="flex justify-between items-end">
          <div>
            {personalInfoFields.fullName && (
              <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {data.fullName || t('personal.fullName')}
              </h1>
            )}
            {data.experience && data.experience.length > 0 && (
              <h2 className="text-xl text-gray-600">
                {data.experience[0].position}
              </h2>
            )}
          </div>
          
          {sections.photo && data.photo && (
            <div className="flex-shrink-0">
              <img
                src={data.photo}
                alt="Profile"
                className="w-24 h-24 rounded-md object-cover border-2"
                style={{ borderColor: colors.primary }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Contact information in a horizontal bar */}
      <div className="px-8 py-3 flex flex-wrap justify-between items-center bg-gray-50">
        {personalInfoFields.email && data.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" style={{ color: colors.primary }} />
            <span className="text-sm">{data.email}</span>
          </div>
        )}
        
        {personalInfoFields.phone && data.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" style={{ color: colors.primary }} />
            <span className="text-sm">{data.phone}</span>
          </div>
        )}
        
        {personalInfoFields.location && data.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
            <span className="text-sm">{data.location}</span>
          </div>
        )}
        
        {personalInfoFields.website && data.website && (
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" style={{ color: colors.primary }} />
            <span className="text-sm">{data.website}</span>
          </div>
        )}
        
        {personalInfoFields.linkedin && data.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" style={{ color: colors.primary }} />
            <span className="text-sm">{data.linkedin}</span>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="p-8">
        <div className="grid grid-cols-1 gap-8">
          {sections.professional_summary && data.summary && (
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ color: colors.primary, borderColor: `${colors.primary}40` }}>
                {t('summary.title')}
              </h2>
              <p className="text-gray-700 text-justify break-words whitespace-pre-wrap">
                {formatBulletedText(data.summary)}
              </p>
            </div>
          )}
          
          {renderMainSections(data, sections, colors)}
          {renderAdditionalSections(data, sections, colors)}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLayout;