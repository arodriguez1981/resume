/**
 * Document extractor for DOCX files
 * Uses mammoth.js to extract text from DOCX files
 */
import mammoth from 'mammoth';

interface DocxContent {
  cleanText: string;
}

/**
 * Extracts text from a DOCX file
 * @param file The DOCX file to extract text from
 * @returns An object containing cleaned text
 */
export const extractTextFromDOCX = async (file: File): Promise<DocxContent> => {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    return extractTextFromDOCXBuffer(arrayBuffer);
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
};

/**
 * Extracts text from a DOCX ArrayBuffer
 * @param arrayBuffer The DOCX ArrayBuffer to extract text from
 * @returns An object containing cleaned text
 */
export const extractTextFromDOCXBuffer = async (arrayBuffer: ArrayBuffer): Promise<DocxContent> => {
  try {
    // Extract text from DOCX using mammoth.js
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    // Clean the text
    const cleanText = cleanDOCXText(result.value);
    
    return { cleanText };
  } catch (error) {
    console.error('Error extracting text from DOCX buffer:', error);
    // Return empty content instead of throwing to avoid breaking the import flow
    return { cleanText: '' };
  }
};

/**
 * Cleans DOCX text by removing redundant spaces, non-ASCII characters, and duplicate content
 * @param text The raw text to clean
 * @returns The cleaned text
 */
const cleanDOCXText = (text: string): string => {
  if (!text || text.trim() === '') {
    return '';
  }
  
  // Remove non-ASCII characters (but keep emails)
  let cleaned = text.replace(/[^\x00-\x7F]+/g, ' ');
  
  // Remove redundant spaces, tabs, and multiple newlines
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Split into paragraphs
  const paragraphs = cleaned.split(/\n+/);
  
  // Remove empty paragraphs and trim each paragraph
  const filteredParagraphs = paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // Remove duplicate paragraphs
  const uniqueParagraphs = filteredParagraphs.filter((paragraph, index) => {
    return filteredParagraphs.indexOf(paragraph) === index;
  });
  
  // Join paragraphs with double newlines
  cleaned = uniqueParagraphs.join('\n\n');
  
  // Remove common DOCX artifacts but preserve emails
  cleaned = cleaned
    .replace(/(\d+\s*of\s*\d+)/gi, '') // Page numbers (e.g., "1 of 10")
    .replace(/\[\s*\d+\s*\]/g, '') // Reference numbers like [1], [2]
    .replace(/\(\s*\d+\s*\)/g, '') // Reference numbers like (1), (2)
    .replace(/^Table of Contents.*$/gm, '') // Table of contents
    .replace(/^Contents.*$/gm, '') // Contents header
    .replace(/^Page \d+$/gm, '') // Page numbers
    .replace(/^Draft$/gm, '') // Draft watermark
    .replace(/^Confidential$/gm, '') // Confidential watermark
    .replace(/^Private$/gm, '') // Private watermark
    .replace(/^DRAFT$/gm, '') // DRAFT watermark
    .replace(/^CONFIDENTIAL$/gm, '') // CONFIDENTIAL watermark
    .replace(/^PRIVATE$/gm, '') // PRIVATE watermark
    
    // Clean up after removals
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
};