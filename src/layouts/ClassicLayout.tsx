import React from 'react';
import { FileText, GraduationCap, Briefcase, Award, Languages, AlignCenterVertical as Certificate, FolderGit2, Heart, Users, Calendar } from 'lucide-react';
import { formatDate, formatBulletedText } from '../utils/formatters';

interface ClassicLayoutProps {
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

const ClassicLayout: React.FC<ClassicLayoutProps> = ({ 
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
      <div className="p-8">
        <header className="text-center mb-8">
          {sections.photo && data.photo && (
            <div className="mb-4 flex justify-center">
              <img
                src={data.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4"
                style={{ borderColor: colors.primary }}
              />
            </div>
          )}
          {personalInfoFields.fullName && (
            <h1 className={`text-4xl font-bold mb-4`} style={{ color: colors.primary }}>
              {data.fullName || t('personal.fullName')}
            </h1>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {renderPersonalInfo()}
          </div>
        </header>

        <div className="space-y-6">
          {sections.professional_summary && data.summary && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                <FileText className="h-5 w-5" />
                {t('summary.title')}
              </h2>
              <p className="text-gray-700 text-justify break-words whitespace-pre-wrap">
                {formatBulletedText(data.summary)}
              </p>
            </section>
          )}
          {renderMainSections(data, sections, colors)}
          {renderAdditionalSections(data, sections, colors)}
        </div>
      </div>
    </div>
  );
};

export default ClassicLayout;