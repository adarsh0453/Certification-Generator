import { jsPDF } from 'jspdf';

/**
 * Generates an official, high-resolution vector PDF certificate
 * matching the Aereo Learning Institute design template.
 */
export const generateCertificatePdf = ({
  recipientName = 'Jane Doe',
  courseName = 'Python',
  completionDate = '07 October 2026',
  certificateNumber = 'CERT-000001',
  signatureImage = null,
}) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm

  // Background parchment tone
  doc.setFillColor(254, 252, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Navy Border
  doc.setDrawColor(15, 23, 42); // #0f172a
  doc.setLineWidth(3.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Gold Border Frame
  doc.setDrawColor(217, 119, 6); // #d97706
  doc.setLineWidth(1.2);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Secondary Thin Gold Border
  doc.setDrawColor(245, 158, 11); // #f59e0b
  doc.setLineWidth(0.4);
  doc.rect(15.5, 15.5, pageWidth - 31, pageHeight - 31);

  // Decorative Corner Triangles
  doc.setFillColor(15, 23, 42);
  doc.triangle(8, 8, 30, 8, 8, 30, 'F');
  doc.triangle(pageWidth - 8, 8, pageWidth - 30, 8, pageWidth - 8, 30, 'F');
  doc.triangle(8, pageHeight - 8, 30, pageHeight - 8, 8, pageHeight - 30, 'F');
  doc.triangle(pageWidth - 8, pageHeight - 8, pageWidth - 30, pageHeight - 8, pageWidth - 8, pageHeight - 30, 'F');

  // Secondary Gold Corner Accents
  doc.setFillColor(217, 119, 6);
  doc.triangle(8, 8, 18, 8, 8, 18, 'F');
  doc.triangle(pageWidth - 8, 8, pageWidth - 18, 8, pageWidth - 8, 18, 'F');
  doc.triangle(8, pageHeight - 8, 18, pageHeight - 8, 8, pageHeight - 18, 'F');
  doc.triangle(pageWidth - 8, pageHeight - 8, pageWidth - 18, pageHeight - 8, pageWidth - 8, pageHeight - 18, 'F');

  // Institute Branding
  doc.setTextColor(30, 58, 138); // Deep Navy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AEREO LEARNING INSTITUTE', pageWidth / 2, 34, { align: 'center' });

  doc.setTextColor(100, 116, 139); // Slate Grey
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('LEARN   ·   GROW   ·   ACHIEVE', pageWidth / 2, 40, { align: 'center' });

  // Certificate Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 56, { align: 'center' });

  // Gold Flourish Line
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 45, 62, pageWidth / 2 + 45, 62);
  doc.setFillColor(217, 119, 6);
  doc.circle(pageWidth / 2, 62, 1.5, 'F');

  // Presentation Subtitle
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', pageWidth / 2, 75, { align: 'center' });

  // Recipient Name
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(32);
  doc.text(recipientName, pageWidth / 2, 95, { align: 'center' });

  // Name underline
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.7);
  const nameWidth = Math.min(doc.getTextWidth(recipientName) + 24, 150);
  doc.line(pageWidth / 2 - nameWidth / 2, 99, pageWidth / 2 + nameWidth / 2, 99);

  // Course completion text
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text('for successfully completing the course/event', pageWidth / 2, 114, { align: 'center' });

  // Course Title
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text(courseName, pageWidth / 2, 126, { align: 'center' });

  // Bottom Metadata: Left Column
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Completion Date:', 32, 160);
  doc.setFont('helvetica', 'normal');
  doc.text(completionDate || '07 October 2026', 60, 160);

  doc.setFont('helvetica', 'bold');
  doc.text('Certificate ID:', 32, 168);
  doc.setFont('helvetica', 'normal');
  doc.text(certificateNumber, 60, 168);

  doc.setFont('helvetica', 'bold');
  doc.text('Issued On:', 32, 176);
  doc.setFont('helvetica', 'normal');
  doc.text(completionDate || '07 October 2026', 60, 176);

  // Center: Certified Learner Gold Seal
  doc.setFillColor(217, 119, 6);
  doc.circle(pageWidth / 2, 168, 12, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.circle(pageWidth / 2, 168, 10.5, 'S');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('CERTIFIED', pageWidth / 2, 166.5, { align: 'center' });
  doc.text('LEARNER', pageWidth / 2, 170.5, { align: 'center' });

  // Right Column: Signatory
  const customSig = signatureImage || (typeof window !== 'undefined' ? localStorage.getItem('custom_signature_preview') : null);
  if (customSig && customSig.startsWith('data:image')) {
    try {
      doc.addImage(customSig, 'PNG', pageWidth - 70, 146, 40, 16);
    } catch {
      doc.setTextColor(30, 58, 138);
      doc.setFont('times', 'italic');
      doc.setFontSize(16);
      doc.text('Admin Signature', pageWidth - 50, 160, { align: 'center' });
    }
  } else {
    doc.setTextColor(30, 58, 138);
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.text('Admin Signature', pageWidth - 50, 160, { align: 'center' });
  }

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 75, 165, pageWidth - 25, 165);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Authorized Signatory', pageWidth - 50, 171, { align: 'center' });
  doc.text('Aereo Learning Institute', pageWidth - 50, 176, { align: 'center' });

  // Save the PDF file to user device
  const safeName = recipientName.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Certificate_${safeName}_${certificateNumber}.pdf`);
};
