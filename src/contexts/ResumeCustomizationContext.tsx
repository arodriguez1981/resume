import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface Colors {
  primary: string;
  background: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
  fontSize: string;
}

interface PersonalInfoFields {
  fullName: boolean;
  email: boolean;
  phone: boolean;
  location: boolean;
  website: boolean;
  linkedin: boolean;
}

interface Sections {
  // Main sections
  photo: boolean;
  personal_info: boolean;
  professional_summary: boolean;
  work_experience: boolean;
  education: boolean;
  skills: boolean;
  languages: boolean;
  certifications: boolean;
  projects: boolean;
  volunteer: boolean;
  references: boolean;
  // Additional sections
  professional_objective: boolean;
  publications: boolean;
  awards: boolean;
  additional_courses: boolean;
  professional_affiliations: boolean;
  portfolio: boolean;
  personal_interests: boolean;
  availability: boolean;
}

interface ResumeCustomizationContextType {
  layout: string;
  setLayout: (layout: string) => void;
  colors: Colors;
  setColors: (colors: Colors) => void;
  typography: Typography;
  setTypography: (typography: Typography) => void;
  sections: Sections;
  toggleSection: (section: keyof Sections) => void;
  personalInfoFields: PersonalInfoFields;
  togglePersonalInfoField: (field: keyof PersonalInfoFields) => void;
  availableLayouts: string[];
}

const ResumeCustomizationContext = createContext<ResumeCustomizationContextType | undefined>(undefined);

export function ResumeCustomizationProvider({ children }: { children: React.ReactNode }) {
  const { isPlusUser, isPremiumUser, isProUser } = useAuth();
  const [layout, setLayout] = useState('classic');
  const [colors, setColors] = useState<Colors>({
    primary: '#2563eb',
    background: '#ffffff'
  });
  const [typography, setTypography] = useState<Typography>({
    headingFont: 'inter',
    bodyFont: 'inter',
    fontSize: 'medium'
  });
  const [sections, setSections] = useState<Sections>({
    // Main sections
    photo: true,
    personal_info: true,
    professional_summary: true,
    work_experience: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    projects: true,
    volunteer: true,
    references: true,
    // Additional sections
    professional_objective: true,
    publications: true,
    awards: true,
    additional_courses: true,
    professional_affiliations: true,
    portfolio: true,
    personal_interests: true,
    availability: true
  });
  const [personalInfoFields, setPersonalInfoFields] = useState<PersonalInfoFields>({
    fullName: true,
    email: true,
    phone: true,
    location: true,
    website: true,
    linkedin: true
  });

  // Determine available layouts based on user's subscription
  const availableLayouts = ['classic', 'split', 'executive'];
  
  // Add premium layouts if user has Plus, Premium, or Pro subscription
  if (isPlusUser || isPremiumUser || isProUser) {
    availableLayouts.push('creative', 'minimalist', 'professional', 'modern');
  }
  
  // Check if current layout is available, if not reset to classic
  const handleSetLayout = (newLayout: string) => {
    if (availableLayouts.includes(newLayout)) {
      setLayout(newLayout);
    } else {
      // If selected layout is not available, default to classic
      setLayout('classic');
    }
  };

  const toggleSection = (section: keyof Sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const togglePersonalInfoField = (field: keyof PersonalInfoFields) => {
    setPersonalInfoFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <ResumeCustomizationContext.Provider value={{
      layout,
      setLayout: handleSetLayout,
      colors,
      setColors,
      typography,
      setTypography,
      sections,
      toggleSection,
      personalInfoFields,
      togglePersonalInfoField,
      availableLayouts
    }}>
      {children}
    </ResumeCustomizationContext.Provider>
  );
}

export function useResumeCustomization() {
  const context = useContext(ResumeCustomizationContext);
  if (context === undefined) {
    throw new Error('useResumeCustomization must be used within a ResumeCustomizationProvider');
  }
  return context;
}