import React, { useState, useEffect } from 'react';
import { Layout, Palette, Type, Layers, X, Columns, AlignLeft, Sidebar, Rows, Grid3X3, Grid, LayoutTemplate, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { useResumeCustomization } from '../contexts/ResumeCustomizationContext';
import { useAuth } from '../contexts/AuthContext';

interface CustomizationPanelProps {
  onClose: () => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('layout');
  const { 
    layout, 
    setLayout,
    colors,
    setColors,
    typography,
    setTypography,
    sections,
    toggleSection,
    personalInfoFields,
    togglePersonalInfoField,
    availableLayouts
  } = useResumeCustomization();
  
  const { isPlusUser, isPremiumUser, isProUser } = useAuth();
  const hasPaidPlan = isPlusUser || isPremiumUser || isProUser;

  // If current layout is not in available layouts, reset to classic
  useEffect(() => {
    if (!availableLayouts.includes(layout)) {
      setLayout('classic');
    }
  }, [layout, availableLayouts, setLayout]);

  const layouts = [
    { 
      id: 'classic', 
      name: 'Classic', 
      icon: AlignLeft,
      description: 'Traditional single-column layout',
      premium: false
    },
    { 
      id: 'split', 
      name: 'Split', 
      icon: Columns,
      description: 'Two-column layout with sidebar',
      premium: false
    },
    { 
      id: 'executive', 
      name: 'Executive', 
      icon: Grid,
      description: 'Professional layout with header emphasis',
      premium: false
    },
    { 
      id: 'modern', 
      name: 'Modern', 
      icon: LayoutTemplate,
      description: 'Contemporary design with clean sections',
      premium: true
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      icon: Grid3X3,
      description: 'Bold layout with accent colors',
      premium: true
    },
    { 
      id: 'minimalist', 
      name: 'Minimalist', 
      icon: Rows,
      description: 'Clean, simple layout with minimal elements',
      premium: true
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: Sidebar,
      description: 'Structured layout with clear section hierarchy',
      premium: true
    }
  ];

  const colorSchemes = [
    { id: 'blue', primary: '#2563eb', background: '#ffffff' },
    { id: 'purple', primary: '#7c3aed', background: '#ffffff' },
    { id: 'pink', primary: '#db2777', background: '#ffffff' },
    { id: 'red', primary: '#dc2626', background: '#ffffff' },
    { id: 'green', primary: '#16a34a', background: '#ffffff' },
    { id: 'indigo', primary: '#4f46e5', background: '#ffffff' },
    { id: 'teal', primary: '#0d9488', background: '#ffffff' },
    { id: 'amber', primary: '#d97706', background: '#ffffff' },
    { id: 'slate', primary: '#475569', background: '#ffffff' },
    { id: 'black', primary: '#000000', background: '#ffffff' }
  ];

  const fonts = [
    { id: 'inter', name: 'Inter' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'poppins', name: 'Poppins' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'large', name: 'Large' }
  ];

  const tabs = [
    { id: 'layout', icon: Layout, label: 'Layout' },
    { id: 'color', icon: Palette, label: 'Color' },
    { id: 'typography', icon: Type, label: 'Typography' },
    { id: 'sections', icon: Layers, label: 'Sections' }
  ];

  const sectionsList = [
    // Main sections
    { key: 'photo', label: 'Photo', group: 'main' },
    { key: 'personal_info', label: 'Personal Information', group: 'main' },
    { key: 'professional_summary', label: 'Professional Summary', group: 'main' },
    { key: 'work_experience', label: 'Work Experience', group: 'main' },
    { key: 'education', label: 'Education', group: 'main' },
    { key: 'skills', label: 'Skills', group: 'main' },
    { key: 'languages', label: 'Languages', group: 'main' },
    { key: 'certifications', label: 'Certifications', group: 'main' },
    { key: 'projects', label: 'Projects', group: 'main' },
    { key: 'volunteer', label: 'Volunteer', group: 'main' },
    { key: 'references', label: 'References', group: 'main' },
    // Additional sections
    { key: 'professional_objective', label: 'Professional Objective', group: 'additional' },
    { key: 'publications', label: 'Publications', group: 'additional' },
    { key: 'awards', label: 'Awards & Recognition', group: 'additional' },
    { key: 'additional_courses', label: 'Additional Courses', group: 'additional' },
    { key: 'professional_affiliations', label: 'Professional Affiliations', group: 'additional' },
    { key: 'portfolio', label: 'Portfolio', group: 'additional' },
    { key: 'personal_interests', label: 'Personal Interests', group: 'additional' },
    { key: 'availability', label: 'Availability & Relocation', group: 'additional' }
  ];

  const handleColorChange = (colorScheme: typeof colorSchemes[0]) => {
    setColors({
      primary: colorScheme.primary,
      background: colorScheme.background
    });
  };

  const handleTypographyChange = (
    type: 'headingFont' | 'bodyFont' | 'fontSize',
    value: string
  ) => {
    setTypography(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Customize Resume</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 p-3 text-sm flex flex-col items-center gap-1 transition-colors',
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <h4 className="text-sm font-medium text-gray-900">Choose Layout</h4>
            <div className="grid grid-cols-1 gap-4">
              {layouts.map(l => {
                const Icon = l.icon;
                const isAvailable = !l.premium || hasPaidPlan;
                const isPremiumLayout = l.premium && !hasPaidPlan;
                
                return (
                  <button
                    key={l.id}
                    onClick={() => isAvailable && setLayout(l.id)}
                    className={clsx(
                      'p-4 border rounded-lg transition-all relative',
                      isAvailable && layout === l.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : isAvailable
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 opacity-60 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={clsx(
                        'p-2 rounded-lg',
                        isAvailable && layout === l.id ? 'bg-blue-100' : 'bg-gray-100'
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium mb-1">{l.name}</div>
                        <div className="text-sm text-gray-500">{l.description}</div>
                      </div>
                    </div>
                    
                    {isPremiumLayout && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        <Lock className="h-3 w-3" />
                        Plus+
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {!hasPaidPlan && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p className="flex items-center gap-1">
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  <span>Upgrade to Plus, Premium, or Pro to unlock Creative, Minimalist, Professional, and Modern layouts.</span>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'color' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Color Scheme</h4>
            <div className="grid grid-cols-5 gap-3">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => handleColorChange(scheme)}
                  className={clsx(
                    'w-12 h-12 rounded-lg transition-transform hover:scale-110',
                    colors.primary === scheme.primary && 'ring-2 ring-offset-2 ring-blue-500'
                  )}
                  style={{ backgroundColor: scheme.primary }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Heading Font</h4>
              <div className="grid grid-cols-3 gap-2">
                {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => handleTypographyChange('headingFont', font.id)}
                    className={clsx(
                      'px-3 py-2 border rounded-md text-sm transition-colors',
                      typography.headingFont === font.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Body Font</h4>
              <div className="grid grid-cols-3 gap-2">
                {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => handleTypographyChange('bodyFont', font.id)}
                    className={clsx(
                      'px-3 py-2 border rounded-md text-sm transition-colors',
                      typography.bodyFont === font.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Font Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => handleTypographyChange('fontSize', size.id)}
                    className={clsx(
                      'px-3 py-2 border rounded-md text-sm transition-colors',
                      typography.fontSize === size.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Main Sections</h4>
              <div className="mt-4 space-y-3">
                {sectionsList
                  .filter(section => section.group === 'main')
                  .map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sections[key as keyof typeof sections]}
                        onChange={() => toggleSection(key as keyof typeof sections)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {label}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Additional Sections</h4>
              <div className="mt-4 space-y-3">
                {sectionsList
                  .filter(section => section.group === 'additional')
                  .map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sections[key as keyof typeof sections]}
                        onChange={() => toggleSection(key as keyof typeof sections)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {label}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            {sections.personal_info && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information Fields</h4>
                <div className="space-y-3 pl-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.fullName}
                      onChange={() => togglePersonalInfoField('fullName')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Full Name</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.email}
                      onChange={() => togglePersonalInfoField('email')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.phone}
                      onChange={() => togglePersonalInfoField('phone')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Phone</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.location}
                      onChange={() => togglePersonalInfoField('location')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Location</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.website}
                      onChange={() => togglePersonalInfoField('website')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Website</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalInfoFields.linkedin}
                      onChange={() => togglePersonalInfoField('linkedin')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">LinkedIn</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationPanel;