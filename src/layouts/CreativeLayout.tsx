import React from 'react';
import { FileText, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { formatBulletedText } from '../utils/formatters';

interface CreativeLayoutProps {
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

const CreativeLayout: React.FC<CreativeLayoutProps> = ({ 
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
  // Create a lighter version of the primary color for accents
  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };
  
  const accentColor = lightenColor(colors.primary, 40);
  
  // Custom personal info renderer with right-aligned text and icons on the right
  const renderCustomPersonalInfo = () => {
    const items = [];

    if (personalInfoFields.email && data.email) {
      items.push(
        <div key="email" className="flex items-center justify-end gap-1 break-all">
          <span className="text-xs text-right">{data.email}</span>
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
        </div>
      );
    }

    if (personalInfoFields.phone && data.phone) {
      items.push(
        <div key="phone" className="flex items-center justify-end gap-1">
          <span className="text-xs text-right">{data.phone}</span>
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
        </div>
      );
    }

    if (personalInfoFields.location && data.location) {
      items.push(
        <div key="location" className="flex items-center justify-end gap-1">
          <span className="text-xs text-right">{data.location}</span>
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
      );
    }

    if (personalInfoFields.website && data.website) {
      items.push(
        <div key="website" className="flex items-center justify-end gap-1 break-all">
          <span className="text-xs text-right">{data.website}</span>
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
        </div>
      );
    }

    if (personalInfoFields.linkedin && data.linkedin) {
      items.push(
        <div key="linkedin" className="flex items-center justify-end gap-1 break-all">
          <span className="text-xs text-right">{data.linkedin}</span>
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Linkedin className="h-4 w-4" />
          </div>
        </div>
      );
    }

    return items;
  };
  
  return (
    <div className="min-h-[279.4mm] relative">
      {/* Creative header with diagonal design */}
      <div className="h-64 relative overflow-hidden">
        {/* Diagonal background */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 50%, ${accentColor} 50%, ${accentColor} 100%)` 
          }}
        ></div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full px-12 flex justify-between items-center">
            <div className="text-white max-w-[40%]">
              {personalInfoFields.fullName && (
                <h1 className="text-3xl font-semibold mb-2">
                  {data.fullName || t('personal.fullName')}
                </h1>
              )}
              {data.experience && data.experience.length > 0 && (
                <h2 className="text-2xl text-white/90">
                  {data.experience[0].position}
                </h2>
              )}
            </div>
            
            <div className="flex items-center gap-8">
              {/* Contact information stacked on the right with right-aligned text */}
              <div className="space-y-2 text-white/90 min-w-[180px] max-w-[250px]">
                {renderCustomPersonalInfo()}
              </div>
              
              {sections.photo && data.photo && (
                <div className="flex-shrink-0">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/80 shadow-lg">
                    <img 
                      src={data.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -bottom-6 left-12 w-12 h-12 rounded-full" style={{ backgroundColor: accentColor }}></div>
        <div className="absolute -bottom-3 left-24 w-6 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
      </div>
      
      {/* Main content with creative layout */}
      <div className="p-12 pt-16 grid grid-cols-12 gap-8">
        {/* Left column - 5 columns wide */}
        <div className="col-span-5 space-y-8">
          {sections.professional_summary && data.summary && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('summary.title')}
              </h2>
              <p className="text-gray-700 text-justify break-words whitespace-pre-wrap">
                {formatBulletedText(data.summary)}
              </p>
            </div>
          )}
          
          {sections.skills && data.skills && data.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('skills.title')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? colors.primary : accentColor,
                      color: index % 2 === 0 ? 'white' : colors.primary
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {sections.education && data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('education.title')}
              </h2>
              <div className="space-y-4">
                {data.education.map((edu: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                    <h3 className="text-lg font-medium" style={{ color: colors.primary }}>{edu.school}</h3>
                    <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate || t('present')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {sections.languages && data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('languages.title')}
              </h2>
              <div className="space-y-2">
                {data.languages.map((language: string, index: number) => (
                  <div key={index} className="text-gray-700">{language}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - 7 columns wide */}
        <div className="col-span-7 space-y-8">
          {sections.work_experience && data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('experience.title')}
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp: any, index: number) => (
                  <div key={index} className="relative pl-12">
                    {/* Decorative timeline */}
                    <div className="absolute left-4 top-0 bottom-0 w-1" style={{ backgroundColor: index % 2 === 0 ? colors.primary : accentColor }}></div>
                    
                    {/* Date circle - moved to the left of the line and increased size for better text fit */}
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'white', border: `2px solid ${index % 2 === 0 ? colors.primary : accentColor}` }}>
                      <span className="text-xs font-bold" style={{ color: index % 2 === 0 ? colors.primary : accentColor }}>
                        {exp.startDate?.split('-')[0] || ''}
                      </span>
                    </div>
                    
                    <div className="mb-2 pt-1">
                      <h3 className="text-lg font-medium" style={{ color: colors.primary }}>{exp.position}</h3>
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
          
          {sections.projects && data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2" style={{ color: colors.primary, borderColor: colors.primary }}>
                {t('projects.title')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((project: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                    <h3 className="text-lg font-medium" style={{ color: colors.primary }}>{project.name}</h3>
                    <p className="text-gray-700 text-sm">{project.description}</p>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm mt-2 inline-block"
                        style={{ color: colors.primary }}
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional sections in full width */}
      <div className="px-12 pb-12">
        {renderAdditionalSections(data, sections, colors)}
      </div>
    </div>
  );
};

export default CreativeLayout;