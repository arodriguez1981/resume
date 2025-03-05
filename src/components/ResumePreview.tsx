import React from 'react';
import { FileText, Mail, Phone, MapPin, Globe, Linkedin, GraduationCap, Briefcase, Award, Languages, AlignCenterVertical as Certificate, FolderGit2, Heart, Users, Calendar } from 'lucide-react';
import { useResumeCustomization } from '../contexts/ResumeCustomizationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { clsx } from 'clsx';
import { formatDate, formatBulletedText } from '../utils/formatters';

// Import all layout components
import ClassicLayout from '../layouts/ClassicLayout';
import SplitLayout from '../layouts/SplitLayout';
import ExecutiveLayout from '../layouts/ExecutiveLayout';
import ModernLayout from '../layouts/ModernLayout';
import CreativeLayout from '../layouts/CreativeLayout';
import MinimalistLayout from '../layouts/MinimalistLayout';
import ProfessionalLayout from '../layouts/ProfessionalLayout';

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  languages: string[];
  certifications: { name: string; issuer: string; date: string }[];
  projects: { name: string; description: string; url?: string }[];
  volunteer: { organization: string; role: string; description: string }[];
  references: { name: string; position: string; company: string; contact: string }[];
  professionalObjective?: string;
  publications?: { title: string; publisher: string; date: string; url?: string }[];
  awards?: { name: string; issuer: string; date: string; description: string }[];
  additionalCourses?: { name: string; institution: string; date: string; description: string }[];
  professionalAffiliations?: { organization: string; role: string; startDate: string; endDate: string }[];
  portfolio?: { title: string; description: string; url: string }[];
  personalInterests?: string;
  availability?: {
    relocation: boolean;
    remote: boolean;
    startDate: string;
    notice: string;
    preferences: string;
  };
  photo?: string;
}

const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { layout, colors, typography, sections, personalInfoFields, availableLayouts } = useResumeCustomization();
  const { t } = useLanguage();

  const styles = {
    container: clsx(
      'transition-all duration-200 bg-white shadow-lg',
      'w-full', // Full width within container
      'transform origin-top',
      {
        'font-sans': typography.bodyFont === 'inter',
        'font-serif': typography.bodyFont === 'roboto',
        'font-mono': typography.bodyFont === 'poppins',
        'text-sm': typography.fontSize === 'small',
        'text-base': typography.fontSize === 'medium',
        'text-lg': typography.fontSize === 'large',
      }
    ),
    page: 'min-h-[279.4mm] relative', // Min-height for Letter size
    wrapper: 'bg-gray-100 min-h-screen flex justify-center overflow-x-auto' // Center the preview
  };

  const renderPersonalInfo = () => {
    const items = [];

    if (personalInfoFields.email && data.email) {
      items.push(
        <div key="email" className="flex items-center gap-1 break-words">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <span className="ml-1 text-sm break-words">{data.email}</span>
        </div>
      );
    }

    if (personalInfoFields.phone && data.phone) {
      items.push(
        <div key="phone" className="flex items-center gap-1">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <span className="ml-1 text-sm break-words">{data.phone}</span>
        </div>
      );
    }

    if (personalInfoFields.location && data.location) {
      items.push(
        <div key="location" className="flex items-center gap-1">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="ml-1 text-sm break-words">{data.location}</span>
        </div>
      );
    }

    if (personalInfoFields.website && data.website) {
      items.push(
        <div key="website" className="flex items-center gap-1 break-words">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <span className="ml-1 text-sm break-words">{data.website}</span>
        </div>
      );
    }

    if (personalInfoFields.linkedin && data.linkedin) {
      items.push(
        <div key="linkedin" className="flex items-center gap-1 break-words">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Linkedin className="h-4 w-4" />
          </div>
          <span className="ml-1 text-sm break-words">{data.linkedin}</span>
        </div>
      );
    }

    return items;
  };

  const renderMainSections = (data: ResumeData, sections: any, colors: any) => {
    const mainSections = [];

    if (sections.work_experience && data. experience && data.experience.length > 0) {
      mainSections.push(
        <div key="experience" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Briefcase className="h-5 w-5" />
            {t('experience.title')}
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: `${colors.primary}40` }}>
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                <div className="mb-2">
                  <h3 className="text-lg font-medium text-gray-900 break-words">{exp.position}</h3>
                  <p className="text-gray-600 break-words">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} {exp.endDate ? `- ${formatDate(exp.endDate)}` : exp.startDate ? `- ${t('present')}` : ''}
                  </p>
                </div>
                <div className="text-gray-700 break-words whitespace-pre-wrap">
                  {formatBulletedText(exp.description)} </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.education && data.education && data.education.length > 0) {
      mainSections.push(
        <div key="education" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <GraduationCap className="h-5 w-5" />
            {t('education.title')}
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{edu.school}</h3>
                <p className="text-gray-700 break-words">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} {edu.endDate ? `- ${formatDate(edu.endDate)}` : edu.startDate ? `- ${t('present')}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.skills && data.skills && data.skills.length > 0) {
      mainSections.push(
        <div key="skills" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Award className="h-5 w-5" />
            {t('skills.title')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm break-words"
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
      );
    }

    if (sections.languages && data.languages && data.languages.length > 0) {
      mainSections.push(
        <div key="languages" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Languages className="h-5 w-5" />
            {t('languages.title')}
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((language, index) => (
              <div key={index} className="text-gray-700 break-words">{language}</div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.certifications && data.certifications && data.certifications.length > 0) {
      mainSections.push(
        <div key="certifications" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Certificate className="h-5 w-5" />
            {t('certifications.title')}
          </h2>
          <div className="space-y-4">
            {data.certifications.map((cert, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 break-words">{cert.name}</h3>
                <p className="text-gray-600 break-words">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.projects && data.projects && data.projects.length > 0) {
      mainSections.push(
        <div key="projects" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <FolderGit2 className="h-5 w-5" />
            {t('projects.title')}
          </h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{project.name}</h3>
                <p className="text-gray-700 break-words">{project.description}</p>
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-words"
                  >
                    {project.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.volunteer && data.volunteer && data.volunteer.length > 0) {
      mainSections.push(
        <div key="volunteer" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Heart className="h-5 w-5" />
            {t('volunteer.title')}
          </h2>
          <div className="space-y-4">
            {data.volunteer.map((vol, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 break-words">{vol.role}</h3>
                <p className="text-gray-600 break-words">{vol.organization}</p>
                <p className="text-gray-700 text-sm mt-1 break-words">{vol.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.references && data.references && data.references.length > 0) {
      mainSections.push(
        <div key="references" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Users className="h-5 w-5" />
            {t('references.title')}
          </h2>
          <div className="space-y-4">
            {data.references.map((ref, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 break-words">{ref.name}</h3>
                <p className="text-gray-600 break-words">{ref.position} {ref.company ? `at ${ref.company}` : ''}</p>
                {ref.contact && <p className="text-gray-500 text-sm mt-1 break-words">{ref.contact}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return mainSections;
  };

  const renderAdditionalSections = (data: ResumeData, sections: any, colors: any) => {
    const additionalSections = [];

    if (sections.professional_objective && data.professionalObjective) {
      additionalSections.push(
        <div key="objective" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <FileText className="h-5 w-5" />
            Professional Objective
          </h2>
          <div className="text-gray-700 text-justify break-words whitespace-pre-wrap">
            {formatBulletedText(data.professionalObjective)}
          </div>
        </div>
      );
    }

    if (sections.publications && data.publications && data.publications.length > 0) {
      additionalSections.push(
        <div key="publications" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <FileText className="h-5 w-5" />
            Publications
          </h2>
          <div className="space-y-4">
            {data.publications.map((pub, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{pub.title}</h3>
                <p className="text-gray-600 break-words">{pub.publisher}</p>
                <p className="text-sm text-gray-500">{formatDate(pub.date)}</p>
                {pub.url && (
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-words"
                  >
                    {pub.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.awards && data.awards && data.awards.length > 0) {
      additionalSections.push(
        <div key="awards" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Award className="h-5 w-5" />
            Awards & Recognition
          </h2>
          <div className="space-y-4">
            {data.awards.map((award, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{award.name}</h3>
                <p className="text-gray-600 break-words">{award.issuer}</p>
                <p className="text-sm text-gray-500">{formatDate(award.date)}</p>
                <p className="text-gray-700 mt-1 break-words">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.additional_courses && data.additionalCourses && data.additionalCourses.length > 0) {
      additionalSections.push(
        <div key="courses" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <GraduationCap className="h-5 w-5" />
            Additional Courses
          </h2>
          <div className="space-y-4">
            {data.additionalCourses.map((course, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{course.name}</h3>
                <p className="text-gray-600 break-words">{course.institution}</p>
                <p className="text-sm text-gray-500">{formatDate(course.date)}</p>
                <p className="text-gray-700 mt-1 break-words">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.professional_affiliations && data.professionalAffiliations && data.professionalAffiliations.length > 0) {
      additionalSections.push(
        <div key="affiliations" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Users className="h-5 w-5" />
            Professional Affiliations
          </h2>
          <div className="space-y-4">
            {data.professionalAffiliations.map((affiliation, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{affiliation.organization}</h3>
                <p className="text-gray-600 break-words">{affiliation.role}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(affiliation.startDate)} {affiliation.endDate ? `- ${formatDate(affiliation.endDate)}` : affiliation.startDate ? `- ${t('present')}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.portfolio && data.portfolio && data.portfolio.length > 0) {
      additionalSections.push(
        <div key="portfolio" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <FolderGit2 className="h-5 w-5" />
            Portfolio
          </h2>
          <div className="space-y-4">
            {data.portfolio.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900 break-words">{item.title}</h3>
                <p className="text-gray-700 break-words">{item.description}</p>
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-words"
                  >
                    {item.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sections.personal_interests && data.personalInterests) {
      additionalSections.push(
        <div key="interests" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Heart className="h-5 w-5" />
            Personal Interests
          </h2>
          <div className="text-gray-700 text-justify break-words whitespace-pre-wrap">
            {formatBulletedText(data.personalInterests)}
          </div>
        </div>
      );
    }

    if (sections.availability && data.availability && (
      data.availability.relocation ||
      data.availability.remote ||
      data.availability.startDate ||
      data.availability.notice ||
      data.availability.preferences
    )) {
      additionalSections.push(
        <div key="availability" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
            <Calendar className="h-5 w-5" />
            Availability & Relocation
          </h2>
          <div className="space-y-2">
            <div className="flex gap-4 flex-wrap">
              {data.availability.relocation && (
                <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700">
                  Open to Relocation
                </span>
              )}
              {data.availability.remote && (
                <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  Available for Remote Work
                </span>
              )}
            </div>
            {data.availability.startDate && (
              <p className="text-gray-700 break-words">
                <span className="font-medium">Available from:</span> {formatDate(data.availability.startDate)}
              </p>
            )}
            {data.availability.notice && (
              <p className="text-gray-700 break-words">
                <span className="font-medium">Notice period:</span> {data.availability.notice}
              </p>
            )}
            {data.availability.preferences && (
              <p className="text-gray-700 break-words">
                <span className="font-medium">Location preferences:</span> {data.availability.preferences}
              </p>
            )}
          </div>
        </div>
      );
    }

    return additionalSections;
  };

  const hasContent = (
    (personalInfoFields.fullName && data.fullName) || 
    (personalInfoFields.email && data.email) || 
    (personalInfoFields.phone && data.phone) ||
    data.summary || 
    (data.experience && data.experience.length > 0) || 
    (data.education && data.education.length > 0) || 
    (data.skills && data.skills.length > 0) ||
    (data.languages && data.languages.length > 0) ||
    (data.certifications && data.certifications.length > 0) ||
    (data.projects && data.projects.length > 0) ||
    (data.volunteer && data.volunteer.length > 0) ||
    (data.references && data.references.length > 0) ||
    data.professionalObjective ||
    (data.publications && data.publications.length > 0) ||
    (data.awards && data.awards.length > 0) ||
    (data.additionalCourses && data.additionalCourses.length > 0) ||
    (data.professionalAffiliations && data.professionalAffiliations.length > 0) ||
    (data.portfolio && data.portfolio.length > 0) ||
    data.personalInterests ||
    (data.availability && (
      data.availability.relocation ||
      data.availability.remote ||
      data.availability.startDate ||
      data.availability.notice ||
      data.availability.preferences
    ))
  );

  // Render the appropriate layout based on the selected layout
  const renderSelectedLayout = () => {
    // Make sure we're using an available layout
    const currentLayout = availableLayouts.includes(layout) ? layout : 'classic';
    
    const layoutProps = {
      data,
      sections,
      colors,
      personalInfoFields,
      typography,
      renderPersonalInfo,
      renderMainSections,
      renderAdditionalSections,
      t
    };

    switch (currentLayout) {
      case 'split':
        return <SplitLayout {...layoutProps} />;
      case 'executive':
        return <ExecutiveLayout {...layoutProps} />;
      case 'modern':
        return <ModernLayout {...layoutProps} />;
      case 'creative':
        return <CreativeLayout {...layoutProps} />;
      case 'minimalist':
        return <MinimalistLayout {...layoutProps} />;
      case 'professional':
        return <ProfessionalLayout {...layoutProps} />;
      case 'classic':
      default:
        return <ClassicLayout {...layoutProps} />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div 
        id="resume-preview" 
        className={styles.container}
        style={{ backgroundColor: colors.background }}
      >
        {hasContent ? renderSelectedLayout() : (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-gray-500 text-center">
              {t('preview.empty')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;