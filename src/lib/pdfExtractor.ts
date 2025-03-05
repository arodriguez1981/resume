// Import PDF.js in a way that avoids top-level await issues
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

// Configure the worker source using a CDN that's compatible with our build
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/legacy/build/pdf.worker.min.js`;

interface PDFContent {
  cleanText: string;
}

/**
 * Extracts text from a PDF file
 * @param file The PDF file to extract text from
 * @returns An object containing cleaned text
 */
const extractTextFromPDF = async (file: File): Promise<PDFContent> => {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    return extractTextFromPDFBuffer(arrayBuffer);
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

/**
 * Extracts text from a PDF ArrayBuffer
 * @param arrayBuffer The PDF ArrayBuffer to extract text from
 * @returns An object containing cleaned text
 */
export const extractTextFromPDFBuffer = async (arrayBuffer: ArrayBuffer): Promise<PDFContent> => {
  try {
    // Load the PDF document using the imported function (avoiding top-level await)
    const loadingTask = getDocument({ data: arrayBuffer });
    
    try {
      const pdf = await loadingTask.promise;
      
      let rawText = '';
      
      // Iterate through each page to extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Concatenate the text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        rawText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      
      // Clean the text
      const cleanText = cleanPDFText(rawText);
      
      return { cleanText };
    } catch (err) {
      console.error('PDF parsing error:', err);
      // If we can't parse the PDF, return empty content
      return { cleanText: '' };
    }
  } catch (error) {
    console.error('Error extracting text from PDF buffer:', error);
    // Return empty content instead of throwing to avoid breaking the import flow
    return { cleanText: '' };
  }
};

/**
 * Cleans PDF text by removing redundant spaces, non-ASCII characters, and duplicate content
 * @param text The raw text to clean
 * @returns The cleaned text
 */
const cleanPDFText = (text: string): string => {
  if (!text || text.trim() === '') {
    return '';
  }
  
  // Remove non-ASCII characters (but keep emails)
  let cleaned = text.replace(/[^\x00-\x7F]+/g, ' ');
  
  // Remove redundant spaces, tabs, and multiple newlines
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Split into paragraphs
  const paragraphs = cleaned.split(/\s*---\s*Page\s+\d+\s*---\s*/);
  
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
  
  // Remove common PDF artifacts but preserve emails
  cleaned = cleaned
    .replace(/(\d+\s*of\s*\d+)/gi, '') // Page numbers (e.g., "1 of 10")
    .replace(/\[\s*\d+\s*\]/g, '') // Reference numbers like [1], [2]
    .replace(/\(\s*\d+\s*\)/g, '') // Reference numbers like (1), (2)
     
    // Clean up after removals
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
};