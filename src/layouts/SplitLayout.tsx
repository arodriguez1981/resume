import React from 'react';
import { FileText } from 'lucide-react';
import { formatBulletedText } from '../utils/formatters';

interface SplitLayoutProps {
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

const SplitLayout: React.FC<SplitLayoutProps> = ({ 
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
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-1 p-6 text-white" style={{ backgroundColor: colors.primary }}>
          {sections.photo && data.photo && (
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div>
            {personalInfoFields.fullName && (
              <h1 className={`text-2xl font-bold mb-4`}>
                {data.fullName || t('personal.fullName')}
              </h1>
            )}
            <div className="space-y-3">
              {renderPersonalInfo()}
            </div>
          </div>
        </div>

        <div className="col-span-2 p-8">
          {sections.professional_summary && data.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                <FileText className="h-5 w-5" />
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

export default SplitLayout;