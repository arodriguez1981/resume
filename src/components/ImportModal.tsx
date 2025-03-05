import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Linkedin, Briefcase, AlertCircle, RefreshCw, Crown, Lock, FileText, CheckCircle, FileUp, FileSearch, FileType2 } from 'lucide-react';
import { loadPDFFile, parsePDFContent } from '../lib/resumeParser';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import PaymentModal from './PaymentModal';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const { user, isProUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [plainText, setPlainText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [tokenEstimate, setTokenEstimate] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDevelopment = import.meta.env.VITE_IS_DEVELOPMENT === 'true';
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [importType, setImportType] = useState<'file' | 'example' | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [fileType, setFileType] = useState<'pdf' | 'docx' | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setError(null);
      setProgress(0);
      setSuccessMessage(null);
      setDragActive(false);
      setPlainText(null);
      setFileName(null);
      setTokenEstimate(null);
      setShowExtractedText(false);
      setFileType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadExampleResume = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setImportType('example');
    setSuccessMessage(null);
    setPlainText(null);
    setFileName(null);
    setFileType('pdf');

    try {
      const response = await fetch('/example-resume.pdf');
      if (!response.ok) {
        throw new Error('Failed to load example resume');
      }

      const blob = await response.blob();
      if (!blob) {
        throw new Error('Failed to load example resume file');
      }

      const file = new File([blob], 'example-resume.pdf', { 
        type: 'application/pdf'
      });

      // Step 1: Load the PDF
      const { plainText, fileName } = await loadPDFFile(file, (progress) => {
        setProgress(progress * 50); // First 50% of progress
      });

      setPlainText(plainText);
      setFileName(fileName);
      
      if (isDevelopment) {
        // Estimate token count (rough approximation)
        const tokenEstimate = Math.ceil(plainText.length / 4);
        setTokenEstimate(tokenEstimate);
      }
      
      setSuccessMessage('Document loaded successfully! Click "Parse Resume" to extract information.');
      setLoading(false);
      
    } catch (err: any) {
      console.error('Example resume error:', err);
      setError('Failed to load example resume. Please try again.');
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError('Please select a file');
      return;
    }

    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'pdf') {
      setFileType('pdf');
    } else if (fileExt === 'docx' || fileExt === 'doc') {
      setFileType('docx');
    } else {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!user && !freePremiumFeatures) {
      setShowAuthModal(true);
      setImportType('file');
      return;
    }

    if (!isProUser && !isDevelopment && !freePremiumFeatures) {
      setShowPaymentModal(true);
      setImportType('file');
      return;
    }

    // Step 1: Load the document
    loadDocument(file);
  };

  const loadDocument = async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setSuccessMessage(null);
    setPlainText(null);
    setFileName(null);
    setTokenEstimate(null);

    try {
      // Step 1: Load the document
      const { plainText, fileName } = await loadPDFFile(file, (progress) => {
        setProgress(progress * 100);
      });

      setPlainText(plainText);
      setFileName(fileName);
      
      if (isDevelopment) {
        // Estimate token count (rough approximation)
        const tokenEstimate = Math.ceil(plainText.length / 4);
        setTokenEstimate(tokenEstimate);
      }
      
      setSuccessMessage('Document loaded successfully! Click "Parse Resume" to extract information.');
      
    } catch (err: any) {
      console.error('Document load error:', err);
      setError(err.message || 'Failed to load document. Please try again.');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  const parsePDF = async () => {
    if (!plainText || !fileName) {
      setError('No text content extracted from document');
      return;
    }

    setParsing(true);
    setError(null);
    setProgress(0);
    setSuccessMessage(null);

    try {
      // Step 2: Parse the document content
      const data = await parsePDFContent(
        '', // We don't need this anymore
        fileName, 
        (progress) => {
          setProgress(progress * 100);
        }, 
        importType === 'example',
        plainText // Pass the plain text
      );

      setSuccessMessage(`Successfully parsed ${fileName}!`);
      
      // Short delay to show success message before closing
      setTimeout(() => {
        onImport(data);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'Failed to parse resume. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (importType === 'example' && isDevelopment) {
      loadExampleResume();
    } else if (importType === 'file' && fileInputRef.current?.files?.[0]) {
      loadDocument(fileInputRef.current.files[0]);
    }
  };

  // Check if user can access file upload features
  const canAccessFileUpload = isProUser || isDevelopment || freePremiumFeatures;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Import Resume</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        {isDevelopment && tokenEstimate && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p className="text-sm font-medium">Development Info:</p>
            <p className="text-sm">Estimated token count: {tokenEstimate.toLocaleString()}</p>
            <p className="text-sm">File type: {fileType || 'unknown'}</p>
            <p className="text-xs text-blue-500 mt-1">This information is only shown in development mode</p>
          </div>
        )}

        {/* Development mode: Show extracted text */}
        {isDevelopment && plainText && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Extracted Text:
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowExtractedText(!showExtractedText)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  {showExtractedText ? 'Hide' : 'Show'} Text
                </button>
                <span className="text-xs text-gray-500">Development Mode Only</span>
              </div>
            </div>
            {showExtractedText && (
              <div className="max-h-60 overflow-y-auto text-xs text-gray-600 font-mono whitespace-pre-wrap border border-gray-200 p-2 rounded">
                {plainText || "No text extracted"}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload Area - Only show if no document is loaded */}
          {!plainText && (
            <div 
              className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : canAccessFileUpload 
                    ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 opacity-70'
              } transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => canAccessFileUpload && fileInputRef.current?.click()}
              style={{ cursor: canAccessFileUpload ? 'pointer' : 'not-allowed' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading || !canAccessFileUpload}
              />
              
              <div className="flex flex-col items-center justify-center gap-3">
                <div className={`p-3 rounded-full ${canAccessFileUpload ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {canAccessFileUpload ? (
                    <FileUp className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Lock className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 flex items-center justify-center gap-2">
                    {canAccessFileUpload ? 'Upload Resume' : 'Pro Feature'}
                    {!canAccessFileUpload && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Crown className="h-3 w-3" />
                        PRO
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {canAccessFileUpload 
                      ? "Drag & drop a PDF or DOCX file here, or click to browse" 
                      : "Upgrade to Pro to unlock file uploads"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Maximum file size: 10MB
                  </p>
                  {canAccessFileUpload && (
                    <div className="flex justify-center gap-2 mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        <FileType2 className="h-3 w-3 mr-1" />
                        PDF
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <FileType2 className="h-3 w-3 mr-1" />
                        DOCX
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document loaded - show parse button */}
          {plainText && fileName && !parsing && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {fileType === 'pdf' ? (
                    <FileText className="h-6 w-6 text-blue-600" />
                  ) : (
                    <FileType2 className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{fileName}</h3>
                  <p className="text-sm text-gray-500">
                    {fileType === 'pdf' ? 'PDF' : 'DOCX'} loaded successfully
                  </p>
                </div>
              </div>
              
              <button
                onClick={parsePDF}
                className="w-full mt-3 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileSearch className="h-5 w-5" />
                Parse Resume
              </button>
            </div>
          )}

          {(loading || parsing) && (
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-center text-gray-600">
                {loading ? "Loading document..." : "Parsing resume..."} {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Example Resume Option */}
          {isDevelopment && !plainText && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Try Example Resume</h3>
              <button
                onClick={loadExampleResume}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FileText className="h-6 w-6 text-red-500" />
                <span className="font-medium">Load Example PDF Resume</span>
              </button>
            </div>
          )}

          <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium text-gray-900">Coming Soon</h3>
            <button
              disabled={true}
              className="w-full flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Linkedin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    Import from LinkedIn
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Crown className="h-3 w-3" />
                      PRO
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </button>

            <button
              disabled={true}
              className="w-full flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    Import from Indeed
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Crown className="h-3 w-3" />
                      PRO
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {!canAccessFileUpload && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Pro Features
            </h3>
            <p className="text-sm text-indigo-700 mb-3">
              Upgrade to Pro for $17 to unlock file uploads, LinkedIn/Indeed imports, and all Premium features for 15 days.
            </p>
            <button
              onClick={() => {
                setImportType('file');
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowPaymentModal(true);
                }
              }}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          plan="pro"
        />
      </div>
    </div>
  );
};

export default ImportModal;