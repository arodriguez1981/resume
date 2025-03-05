/**
 * Utility functions for exporting resume content
 */

/**
 * Creates a printable version of the resume in a new window
 * @param element The HTML element containing the resume to export
 * @param isPremium Whether the user has premium access (no watermark)
 * @returns A Promise that resolves when the print window is ready
 */
export const exportResume = (element: HTMLElement | null, isPremium: boolean = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!element) {
      reject(new Error('No element provided for export'));
      return;
    }
    
    try {
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Get all styles from the page
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            // Likely a CORS issue with external stylesheets
            return '';
          }
        })
        .filter(Boolean)
        .join('\n');
      
      // Create HTML content for the print window with all styles included
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @page {
                size: letter;
                margin: 0; /* Remove page margins for printing */
              }
              
              body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                background-color: white;
                color: black;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .print-container {
                width: 215.9mm;
                min-height: 279.4mm;
                margin: 0 auto;
                position: relative;
                box-sizing: border-box;
                page-break-after: always;
                background-color: white;
                padding: 15mm; /* Add padding instead of page margins */
                padding-top: 0; /* Remove top padding */
                padding-left: 0; /* Remove left padding */
                padding-right: 0; /* Remove right padding */
              }
              
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 60px;
                color: rgba(200, 200, 200, 0.45);
                pointer-events: none;
                z-index: 1000;
              }
              
              /* Fix SVG icons to ensure they're not filled */
              svg {
                color: inherit !important;
                fill: none !important; /* Ensure icons are not filled */
                stroke: currentColor !important;
                stroke-width: 2px !important;
              }
              
              /* Preserve spacing between icons and text */
              .flex {
                display: flex !important;
              }
              
              .items-center {
                align-items: center !important;
              }
              
              .justify-between {
                justify-content: space-between !important;
              }
              
              .justify-center {
                justify-content: center !important;
              }
              
              .gap-1 {
                gap: 0.25rem !important;
              }
              
              .gap-2 {
                gap: 0.5rem !important;
              }
              
              .gap-3 {
                gap: 0.75rem !important;
              }
              
              .gap-4 {
                gap: 0.5rem !important;
              }
              
              .gap-8 {
                gap: 2rem !important;
              }
              
              /* Preserve margins */
              .p-8 {
                padding: 2rem !important;
              }
              
              .p-6 {
                padding: 1.5rem !important;
              }
              
              .p-4 {
                padding: 1rem !important;
              }
              
              .mb-8 {
                margin-bottom: 2rem !important;
              }
              
              .mb-4 {
                margin-bottom: 1rem !important;
              }
              
              .mb-2 {
                margin-bottom: 0.5rem !important;
              }
              
              .mt-8 {
                margin-top: 2rem !important;
              }
              
              .mt-4 {
                margin-top: 1rem !important;
              }
              
              /* Preserve layout structures */
              .grid {
                display: grid !important;
              }
              
              .grid-cols-1 {
                grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
              }
              
              .grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
              
              .grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              }
              
              .grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
              }
              
              .grid-cols-12 {
                grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
              }
              
              .col-span-1 {
                grid-column: span 1 / span 1 !important;
              }
              
              .col-span-2 {
                grid-column: span 2 / span 2 !important;
              }
              
              .col-span-3 {
                grid-column: span 3 / span 3 !important;
              }
              
              .col-span-4 {
                grid-column: span 4 / span 4 !important;
              }
              
              .col-span-5 {
                grid-column: span 5 / span 5 !important;
              }
              
              .col-span-6 {
                grid-column: span 6 / span 6 !important;
              }
              
              .col-span-7 {
                grid-column: span 7 / span 7 !important;
              }
              
              .col-span-8 {
                grid-column: span 8 / span 8 !important;
              }
              
              /* Preserve text styles */
              .text-center {
                text-align: center !important;
              }
              
              .text-justify {
                text-align: justify !important;
              }
              
              .text-4xl {
                font-size: 2.25rem !important;
                line-height: 2.5rem !important;
              }
              
              .text-3xl {
                font-size: 1.875rem !important;
                line-height: 2.25rem !important;
              }
              
              .text-2xl {
                font-size: 1.5rem !important;
                line-height: 2rem !important;
              }
              
              .text-xl {
                font-size: 1.25rem !important;
                line-height: 1.75rem !important;
              }
              
              .text-lg {
                font-size: 1.125rem !important;
                line-height: 1.75rem !important;
              }
              
              .text-sm {
                font-size: 0.875rem !important;
                line-height: 1.25rem !important;
              }
              
              .text-xs {
                font-size: 0.75rem !important;
                line-height: 1rem !important;
              }
              
              .font-bold {
                font-weight: 700 !important;
              }
              
              .font-semibold {
                font-weight: 600 !important;
              }
              
              .font-medium {
                font-weight: 500 !important;
              }
              
              /* Preserve colors */
              .text-gray-900 {
                color: #111827 !important;
              }
              
              .text-gray-800 {
                color: #1f2937 !important;
              }
              
              .text-gray-700 {
                color: #374151 !important;
              }
              
              .text-gray-600 {
                color: #4b5563 !important;
              }
              
              .text-gray-500 {
                color: #6b7280 !important;
              }
              
              .text-gray-400 {
                color: #9ca3af !important;
              }
              
              .text-white {
                color: #ffffff !important;
              }
              
              /* Preserve backgrounds */
              .bg-white {
                background-color: #ffffff !important;
              }
              
              .bg-gray-50 {
                background-color: #f9fafb !important;
              }
              
              .bg-gray-100 {
                background-color: #f3f4f6 !important;
              }
              
              /* Preserve borders */
              .rounded-lg {
                border-radius: 0.5rem !important;
              }
              
              .rounded-full {
                border-radius: 9999px !important;
              }
              
              .border-l-2 {
                border-left-width: 2px !important;
              }
              
              .border-b-2 {
                border-bottom-width: 2px !important;
              }
              
              /* Preserve positioning */
              .relative {
                position: relative !important;
              }
              
              .absolute {
                position: absolute !important;
              }
              
              .inset-0 {
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
              }
              
              /* Preserve flex layouts */
              .flex-wrap {
                flex-wrap: wrap !important;
              }
              
              .flex-shrink-0 {
                flex-shrink: 0 !important;
              }
              
              /* Preserve spacing */
              .space-y-1 > * + * {
                margin-top: 0.25rem !important;
              }
              
              .space-y-2 > * + * {
                margin-top: 0.5rem !important;
              }
              
              .space-y-3 > * + * {
                margin-top: 0.75rem !important;
              }
              
              .space-y-4 > * + * {
                margin-top: 1rem !important;
              }
              
              .space-y-6 > * + * {
                margin-top: 1.5rem !important;
              }
              
              .space-y-8 > * + * {
                margin-top: 2rem !important;
              }
              
              /* Preserve other utilities */
              .break-words {
                overflow-wrap: break-word !important;
              }
              
              .break-all {
                word-break: break-all !important;
              }
              
              .whitespace-pre-wrap {
                white-space: pre-wrap !important;
              }
              
              /* Fix for specific layouts */
              .h-48, .h-64 {
                height: auto !important;
                min-height: 12rem !important;
              }
              
              /* Creative layout specific fixes */
              .h-64 {
                height: 16rem !important;
              }
              
              .h-64 .relative.z-10.h-full {
                height: 100% !important;
                display: flex !important;
                align-items: center !important;
              }
              
              .h-64 .w-full.px-12 {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
              }
              
              .h-36, .w-36 {
                height: 9rem !important;
                width: 9rem !important;
              }
              
              .min-w-\\[180px\\] {
                min-width: 180px !important;
              }
              
              .max-w-\\[250px\\] {
                max-width: 250px !important;
              }
              
              .max-w-\\[40\\%\\] {
                max-width: 40% !important;
              }
              
              /* Include all the styles from the page */
              ${styles}
              
              /* Footer styling */
              .footer {
                position: absolute;
                bottom: 10mm;
                left: 10mm;
                font-size: 10px;
                color: #808080;
                text-align: left;
              }
              
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .print-container {
                  width: 100%;
                  height: 100%;
                  page-break-after: always;
                }
                
                /* Force background colors to print */
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                /* Fix for specific SVG icons in print */
                svg {
                  fill: none !important;
                  stroke: currentColor !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${clonedElement.innerHTML}
              ${!isPremium ? `
                <div class="watermark">WORKINFI RESUME</div>
              ` : ''}
            </div>
          </body>
        </html>
      `;

      // Create an iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      
      // Append iframe to body
      document.body.appendChild(iframe);
      
      // Get iframe document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        reject(new Error('Could not access iframe document'));
        return;
      }
      
      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for iframe to load
      iframe.onload = () => {
        // Trigger print after a short delay to ensure content is rendered
        setTimeout(() => {
          try {
            // Focus the iframe window
            if (iframe.contentWindow) {
              iframe.contentWindow.focus();
              // Print the iframe
              iframe.contentWindow.print();
              
              // Remove iframe after printing (or after a timeout)
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                }
                resolve();
              }, 1000);
            } else {
              throw new Error('Could not access iframe window');
            }
          } catch (printError) {
            console.error('Print error:', printError);
            // Clean up iframe even if printing fails
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            reject(printError);
          }
        }, 500);
      };
      
    } catch (error) {
      console.error('Error exporting resume:', error);
      reject(error);
    }
  });
};

/**
 * Creates a printable version of the cover letter in a new window
 * @param element The HTML element containing the cover letter to export
 * @param isPremium Whether the user has premium access (no watermark)
 * @returns A Promise that resolves when the print window is ready
 */
export const exportCoverLetter = (element: HTMLElement | null, isPremium: boolean = false): Promise<void> => {
  return exportResume(element, isPremium); // Reuse the same function for now
};