/**
 * Unified document extractor for PDF and DOCX files
 */
import { extractTextFromPDFBuffer } from './pdfExtractor';
import { extractTextFromDOCXBuffer } from './docxExtractor';

export interface DocumentContent {
  cleanText: string;
  fileType: 'pdf' | 'docx' | 'unknown';
}

/**
 * Extracts text from a document file (PDF or DOCX)
 * @param file The document file to extract text from
 * @returns An object containing cleaned text and file type
 */
export const extractTextFromDocument = async (file: File): Promise<DocumentContent> => {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Determine file type based on extension
    const fileType = getFileType(file.name);
    
    // Extract text based on file type
    if (fileType === 'pdf') {
      const { cleanText } = await extractTextFromPDFBuffer(arrayBuffer);
      return { cleanText, fileType };
    } else if (fileType === 'docx') {
      const { cleanText } = await extractTextFromDOCXBuffer(arrayBuffer);
      return { cleanText, fileType };
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw error;
  }
};

/**
 * Determines the file type based on the file extension
 * @param fileName The name of the file
 * @returns The file type ('pdf', 'docx', or 'unknown')
 */
export const getFileType = (fileName: string): 'pdf' | 'docx' | 'unknown' => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    return 'pdf';
  } else if (extension === 'docx' || extension === 'doc') {
    return 'docx';
  } else {
    return 'unknown';
  }
};