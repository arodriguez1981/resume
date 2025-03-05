import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (isPremium: boolean = false, element?: HTMLElement): Promise<void> => {
  const targetElement = element || document.getElementById('resume-preview');
  if (!targetElement) return;

  try {
    // Store original styles
    const originalStyles = {
      background: targetElement.style.background,
      backgroundColor: targetElement.style.backgroundColor,
      color: targetElement.style.color
    };

    // Force white background and black text
    targetElement.style.background = 'white';
    targetElement.style.backgroundColor = 'white';
    targetElement.style.color = 'black';

    // Create canvas with explicit white background
    const canvas = await html2canvas(targetElement, {
      scale: 1.5, // Reduced from 2 to optimize file size
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowHeight: targetElement.scrollHeight,
      height: targetElement.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(targetElement.id);
        if (clonedElement) {
          // Force white background in cloned element
          clonedElement.style.background = 'white';
          clonedElement.style.backgroundColor = 'white';
          
          // Ensure all parent elements have white background
          let parent = clonedElement.parentElement;
          while (parent) {
            parent.style.background = 'white';
            parent.style.backgroundColor = 'white';
            parent = parent.parentElement;
          }
        }
      }
    });

    // Restore original styles
    targetElement.style.background = originalStyles.background;
    targetElement.style.backgroundColor = originalStyles.backgroundColor;
    targetElement.style.color = originalStyles.color;

    // Create PDF with Letter size (215.9mm x 279.4mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [215.9, 279.4], // Letter size
      compress: true
    });

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Define margins
    const margin = 10; // 10mm margins
    const printableWidth = pageWidth - (2 * margin);
    const printableHeight = pageHeight - (2 * margin);

    // Calculate scaling to fit content width
    const scale = printableWidth / canvas.width;
    
    // Calculate total height after scaling
    const scaledHeight = canvas.height * scale;
    
    // Calculate number of pages needed
    const totalPages = Math.ceil(scaledHeight / printableHeight);

    // For each page
    for (let i = 0; i < totalPages; i++) {
      // Add new page if not the first page
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate what portion of the canvas to use for this page
      const sourceY = i * (printableHeight / scale);
      const sourceHeight = Math.min(printableHeight / scale, canvas.height - sourceY);
      
      // Add image for this page
      pdf.addImage(
        canvas,
        'PNG',
        margin, // left margin
        margin, // top margin
        printableWidth,
        sourceHeight * scale,
        null,
        'FAST',
        0,
        -sourceY * scale // Vertical offset to show the correct portion
      );

      if (!isPremium) {
        // Add watermark to each page
        pdf.setTextColor(200, 200, 200);
        pdf.setGState(new pdf.GState({ opacity: 0.3 }));
        pdf.setFontSize(40);

        const watermarkText = 'WORKINFI RESUME';
        const x = pageWidth / 2;
        const y = pageHeight / 2;

        pdf.text(watermarkText, x, y, {
          align: 'center',
          angle: 45
        });

        // Add footer only to last page
        if (i === totalPages - 1) {
          pdf.setFontSize(10);
          pdf.setTextColor(128, 128, 128);
          
          const footerText = 'Created using Workinfi Resume';
          const websiteText = 'https://workinfi.com/resume';
          const contactText = 'Contact us: support@workinfo_resume.com | (239) 375-1111';
          
          const footerWidth = pdf.getStringUnitWidth(footerText) * 10 / pdf.internal.scaleFactor;
          const websiteWidth = pdf.getStringUnitWidth(websiteText) * 10 / pdf.internal.scaleFactor;
          const contactWidth = pdf.getStringUnitWidth(contactText) * 10 / pdf.internal.scaleFactor;
          
          pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 15);
          pdf.setTextColor(0, 102, 204);
          pdf.text(websiteText, (pageWidth - websiteWidth) / 2, pageHeight - 10);
          pdf.setTextColor(128, 128, 128);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, pageHeight - 5);

          pdf.link(
            (pageWidth - websiteWidth) / 2,
            pageHeight - 11,
            websiteWidth,
            5,
            { url: 'https://workinfi.com/resume' }
          );
        }
      }
    }

    // Save the PDF
    const filename = element ? 'cover-letter.pdf' : 'resume.pdf';
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};