interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface Project {
  name: string;
  description: string;
  url?: string;
}

interface Volunteer {
  organization: string;
  role: string;
  description: string;
}

interface Reference {
  name: string;
  position: string;
  company: string;
  contact: string;
}

interface Publication {
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

interface Award {
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface AdditionalCourse {
  name: string;
  institution: string;
  date: string;
  description: string;
}

interface ProfessionalAffiliation {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

interface Availability {
  relocation: boolean;
  remote: boolean;
  startDate: string;
  notice: string;
  preferences: string;
}

export interface FormData {
  // Main Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: Certification[];
  projects: Project[];
  volunteer: Volunteer[];
  references: Reference[];

  // Additional Info
  professionalObjective: string;
  publications: Publication[];
  awards: Award[];
  additionalCourses: AdditionalCourse[];
  professionalAffiliations: ProfessionalAffiliation[];
  portfolio: PortfolioItem[];
  personalInterests: string;
  availability: Availability;
  photo?: string;
}