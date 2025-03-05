export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'ZH' | 'JA' | 'KO';

export interface LanguageOption {
  code: Language;
  name: string;
}

export interface WritingAssistantContext {
  jobTitle?: string;
  companyName?: string;
  experience?: Array<{
    company: string;
    position: string;
    description: string;
  }>;
}