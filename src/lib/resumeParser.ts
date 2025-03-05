import { supabase } from './supabase';
import { extractTextFromPDFBuffer } from './pdfExtractor';
import { extractTextFromDOCXBuffer } from './docxExtractor';
import { getFileType } from './documentExtractor';

interface ParsedResume {
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

// Clean and preprocess text to reduce token count
function preprocessText(text: string): string {
  // Remove redundant whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Remove common filler phrases
  const fillerPhrases = [
    'please find attached', 'please see attached', 'please find enclosed',
    'i am writing to', 'i would like to', 'i am pleased to',
    'thank you for your consideration', 'thank you for your time',
    'references available upon request'
  ];
  
  fillerPhrases.forEach(phrase => {
    cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
  });
  
  // Remove duplicate lines
  const lines = cleaned.split('\n');
  const uniqueLines = [...new Set(lines)];
  cleaned = uniqueLines.join('\n');
  
  return cleaned.trim();
}

// Estimate token count for OpenAI models (rough approximation)
function estimateTokenCount(text: string): number {
  // OpenAI uses tokens that are about 4 characters on average
  return Math.ceil(text.length / 4);
}

// Extract email from text using regex
function extractEmail(text: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches && matches.length > 0 ? matches[0] : null;
}

// Extract phone number from text using regex
function extractPhone(text: string): string | null {
  // This regex matches various phone number formats
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches && matches.length > 0 ? matches[0] : null;
}

// Step 1: Load and extract text from PDF or DOCX
export async function loadPDFFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ pdfContent: string, fileName: string, plainText: string }> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    // Validate file type - only PDF and DOCX are supported
    if (file.type !== 'application/pdf' && 
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.type !== 'application/msword') {
      throw new Error('Please upload a PDF or DOCX file');
    }

    if (onProgress) onProgress(0.2);

    // Extract text from document
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer) {
        throw new Error('Failed to read file');
      }
      
      let cleanText = '';
      
      // Determine file type and extract text accordingly
      const fileType = getFileType(file.name);
      
      if (fileType === 'pdf') {
        // Extract text using PDF.js
        const { cleanText: pdfText } = await extractTextFromPDFBuffer(arrayBuffer);
        cleanText = pdfText;
      } else if (fileType === 'docx') {
        // Extract text using mammoth.js
        const { cleanText: docxText } = await extractTextFromDOCXBuffer(arrayBuffer);
        cleanText = docxText;
      } else {
        throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
      }
      
      if (onProgress) onProgress(0.8);
      
      if (import.meta.env.VITE_IS_DEVELOPMENT === 'true') {
        // Estimate token count (rough approximation)
        const tokenEstimate = Math.ceil(cleanText.length / 4);
        console.log(`Document loaded. Estimated token count: ${tokenEstimate}`);
        console.log('Clean text length:', cleanText.length);
      }
      
      if (onProgress) onProgress(1.0);
      
      return { 
        pdfContent: '', // We don't need this anymore
        fileName: file.name,
        plainText: cleanText
      };
    } catch (error: any) {
      console.error('Document processing error:', error);
      throw new Error('Failed to extract text from document file. Please ensure the file is not corrupted.');
    }
  } catch (error: any) {
    console.error('Document load error:', error);
    throw new Error(error.message || 'Failed to load document. Please try again.');
  }
}

// Step 2: Parse the document content using AI
export async function parsePDFContent(
  pdfContent: string,
  fileName: string,
  onProgress?: (progress: number) => void,
  isExample: boolean = false,
  plainText?: string
): Promise<ParsedResume> {
  try {
    if (!plainText || plainText.trim() === '') {
      throw new Error('No text content extracted from document');
    }

    if (onProgress) onProgress(0.1);

    try {
      // Get current user if not example resume
      let userId = null;
      if (!isExample) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id;
        } catch (authError) {
          console.warn('Auth error, proceeding without user ID:', authError);
          // Continue without user ID if there's an auth error
        }
      }

      // Log token estimate if in development mode
      if (import.meta.env.VITE_IS_DEVELOPMENT === 'true') {
        const tokenEstimate = estimateTokenCount(plainText);
        console.log(`Parsing document. Estimated token count: ${tokenEstimate}`);
      }

      if (onProgress) onProgress(0.3);

      // Extract email and phone before sending to AI
      const extractedEmail = extractEmail(plainText);
      const extractedPhone = extractPhone(plainText);

      // Call the parse-resume-ai function with the plain text content
      const { data, error } = await supabase.functions.invoke('parse-resume-ai', {
        body: {
          content: plainText,
          contentType: 'text',
          fileName: fileName,
          userId,
          isExample,
          isDevelopment: import.meta.env.VITE_IS_DEVELOPMENT === 'true',
          extractedEmail,
          extractedPhone
        }
      });

      if (error) {
        console.error('AI processing error:', error);
        throw new Error(error.message || 'Failed to analyze resume. Please try again.');
      }

      if (!data) {
        throw new Error('No data received from resume analysis');
      }

      if (onProgress) onProgress(1);

      // Use extracted email and phone if AI didn't find them
      const email = data.email || extractedEmail || '';
      const phone = data.phone || extractedPhone || '';

      // Return parsed data with empty strings for missing fields (not "Not Provided")
      return {
        fullName: data.fullName || '',
        email: email,
        phone: phone,
        location: data.location || '',
        website: data.website || '',
        linkedin: data.linkedin || '',
        summary: data.summary || '',
        experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })) : [],
        education: Array.isArray(data.education) ? data.education.map(edu => ({
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || ''
        })) : [],
        skills: Array.isArray(data.skills) ? data.skills.filter(skill => skill) : [],
        languages: Array.isArray(data.languages) ? data.languages.filter(lang => lang) : [],
        certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.date || ''
        })) : [],
        projects: Array.isArray(data.projects) ? data.projects.map(proj => ({
          name: proj.name || '',
          description: proj.description || '',
          url: proj.url || ''
        })) : [],
        volunteer: Array.isArray(data.volunteer) ? data.volunteer.map(vol => ({
          organization: vol.organization || '',
          role: vol.role || '',
          description: vol.description || ''
        })) : [],
        references: Array.isArray(data.references) ? data.references.map(ref => ({
          name: ref.name || '',
          position: ref.position || '',
          company: ref.company || '',
          contact: ref.contact || ''
        })) : [],
        professionalObjective: data.professionalObjective || '',
        publications: Array.isArray(data.publications) ? data.publications.map(pub => ({
          title: pub.title || '',
          publisher: pub.publisher || '',
          date: pub.date || '',
          url: pub.url || ''
        })) : [],
        awards: Array.isArray(data.awards) ? data.awards.map(award => ({
          name: award.name || '',
          issuer: award.issuer || '',
          date: award.date || '',
          description: award.description || ''
        })) : [],
        additionalCourses: Array.isArray(data.additionalCourses) ? data.additionalCourses.map(course => ({
          name: course.name || '',
          institution: course.institution || '',
          date: course.date || '',
          description: course.description || ''
        })) : [],
        professionalAffiliations: Array.isArray(data.professionalAffiliations) ? data.professionalAffiliations.map(aff => ({
          organization: aff.organization || '',
          role: aff.role || '',
          startDate: aff.startDate || '',
          endDate: aff.endDate || ''
        })) : [],
        portfolio: Array.isArray(data.portfolio) ? data.portfolio.map(item => ({
          title: item.title || '',
          description: item.description || '',
          url: item.url || ''
        })) : [],
        personalInterests: data.personalInterests || '',
        availability: data.availability ? {
          relocation: !!data.availability.relocation,
          remote: !!data.availability.remote,
          startDate: data.availability.startDate || '',
          notice: data.availability.notice || '',
          preferences: data.availability.preferences || ''
        } : {
          relocation: false,
          remote: false,
          startDate: '',
          notice: '',
          preferences: ''
        }
      };
    } catch (err: any) {
      console.error('Resume parsing error:', err);
      if (err.message?.includes('Function not found')) {
        throw new Error('Resume parsing service is temporarily unavailable. Please try again later.');
      }
      throw new Error(err.message || 'Failed to process resume. Please try again.');
    }
  } catch (error: any) {
    console.error('Parse error:', error);
    throw new Error(error.message || 'Failed to parse resume. Please try again.');
  }
}