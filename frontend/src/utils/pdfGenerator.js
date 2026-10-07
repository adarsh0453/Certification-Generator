import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Formats any input date string into executive long format: '07 October 2026'
 */
export const formatCertificateDate = (dateStr) => {
  if (!dateStr) return '07 October 2026';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  } catch (e) {}
  return dateStr;
};

/**
 * Captures an HTML element at 300 DPI print quality and downloads it as an A4 PDF.
 */
export const downloadElementAsPdf = async (element, filename = 'Certificate.pdf') => {
  if (!element) return;
  const canvas = await html2canvas(element, {
    scale: 3, // 3x retina scaling for crisp vector-like typography
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#fcfcfd',
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  pdf.save(filename);
};

/**
 * Generates an official certificate PDF that is 100% IDENTICAL in design,
 * colors, ribbons, typography, flourishes, badges, and layout to the visual UI preview.
 */
export const generateCertificatePdf = async ({
  recipientName = 'Jane Doe',
  courseName = 'Python',
  completionDate = '07 October 2026',
  certificateNumber = 'CERT-000001',
  signatureImage = null,
}) => {
  const formattedDate = formatCertificateDate(completionDate);
  const targetElement = document.getElementById('certificate-paper-target');

  // Check if on-screen visual preview matches the target recipient
  const currentPreviewName = targetElement?.querySelector('.recipient-name-script')?.textContent?.trim();
  if (targetElement && (!recipientName || currentPreviewName === recipientName.trim())) {
    const safeName = (recipientName || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_');
    await downloadElementAsPdf(targetElement, `Certificate_${safeName}_${certificateNumber}.pdf`);
    return;
  }

  // Create an offscreen render clone with exact identical styles and layout
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // 210mm at 96 DPI
  container.style.height = '1123px'; // 297mm at 96 DPI
  container.style.zIndex = '-9999';
  container.style.visibility = 'visible';
  container.style.backgroundColor = '#fcfcfd';

  const effectiveSignature =
    signatureImage ||
    (typeof window !== 'undefined' ? localStorage.getItem('custom_signature_preview') : null);

  container.innerHTML = `
    <div style="width: 794px; height: 1123px; box-sizing: border-box; padding: 3.5rem 3rem; position: relative; background: #fcfcfd; overflow: hidden; border: 1px solid #e2e8f0; font-family: system-ui, -apple-system, sans-serif;">
      <!-- Guilloche Overlay -->
      <div style="position: absolute; inset: 0; background-image: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 70%), repeating-linear-gradient(45deg, rgba(226, 232, 240, 0.2) 0px, rgba(226, 232, 240, 0.2) 2px, transparent 2px, transparent 8px); pointer-events: none;"></div>

      <!-- Top-Left Ribbon Folds -->
      <div style="position: absolute; top: 0; left: 0; pointer-events: none;">
        <div style="position: absolute; top: 0; left: 0; width: 0; height: 0; border-style: solid; border-width: 170px 170px 0 0; border-color: #0d1b2a transparent transparent transparent;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 0; height: 0; border-style: solid; border-width: 200px 200px 0 0; border-color: #eab308 transparent transparent transparent; z-index: -1;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 0; height: 0; border-style: solid; border-width: 220px 220px 0 0; border-color: #1b263b transparent transparent transparent; z-index: -2;"></div>
      </div>

      <!-- Bottom-Right Ribbon Folds -->
      <div style="position: absolute; bottom: 0; right: 0; pointer-events: none;">
        <div style="position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 0 170px 170px; border-color: transparent transparent #0d1b2a transparent;"></div>
        <div style="position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 0 200px 200px; border-color: transparent transparent #eab308 transparent; z-index: -1;"></div>
        <div style="position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 0 220px 220px; border-color: transparent transparent #1b263b transparent; z-index: -2;"></div>
      </div>

      <!-- Corner Fans -->
      <div style="position: absolute; top: 22px; right: 22px; width: 0; height: 0; border-style: solid; border-width: 0 22px 22px 0; border-color: transparent #d97706 transparent transparent; z-index: 5;"></div>
      <div style="position: absolute; bottom: 22px; left: 22px; width: 0; height: 0; border-style: solid; border-width: 22px 0 0 22px; border-color: transparent transparent transparent #d97706; z-index: 5;"></div>

      <!-- Double Gold Inner Frame -->
      <div style="position: absolute; inset: 22px; border: 2px solid #d97706; pointer-events: none;">
        <div style="position: absolute; inset: 4px; border: 1px solid #d97706;"></div>
      </div>

      <!-- Cert Body Content -->
      <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; text-align: center; height: 100%; justify-content: space-between;">
        
        <!-- Header Branding -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem; margin-top: 1.5rem;">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="6"></circle>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
          </svg>
          <div style="font-size: 1.85rem; font-weight: 800; color: #0d1b2a; letter-spacing: -0.01em;">Aereo Learning Institute</div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #d97706; letter-spacing: 0.22em;">LEARN   ·   GROW   ·   ACHIEVE</div>
        </div>

        <!-- Title Section -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
          <h1 style="font-size: 2.6rem; font-weight: 800; letter-spacing: 0.04em; margin: 0; line-height: 1.1;">
            <span style="color: #0d1b2a;">CERTIFICATE </span>
            <span style="color: #d97706;">OF </span>
            <span style="color: #0d1b2a;">COMPLETION</span>
          </h1>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem;">
            <div style="width: 100px; height: 1.5px; background-color: #d97706;"></div>
            <div style="color: #d97706; font-size: 1rem;">◆</div>
            <div style="width: 100px; height: 1.5px; background-color: #d97706;"></div>
          </div>
        </div>

        <!-- Subtitle -->
        <p style="font-size: 0.95rem; font-weight: 600; color: #64748b; letter-spacing: 0.14em; margin: 1rem 0 0 0;">
          THIS CERTIFICATE IS PROUDLY PRESENTED TO
        </p>

        <!-- Recipient Name -->
        <div style="display: flex; flex-direction: column; align-items: center; margin: 1.5rem 0;">
          <h2 style="font-family: 'Times New Roman', Georgia, serif; font-style: italic; font-weight: 700; font-size: 3.4rem; color: #0f2b48; line-height: 1.1; margin: 0;">
            ${recipientName}
          </h2>
          <div style="width: 320px; height: 2px; background-color: #fef3c7; margin-top: 0.75rem;"></div>
        </div>

        <!-- Course Details -->
        <div>
          <p style="font-size: 1rem; color: #64748b; margin: 0 0 0.4rem 0;">for successfully completing the course/event</p>
          <h3 style="font-size: 2rem; font-weight: 800; color: #0d1b2a; margin: 0;">${courseName}</h3>
        </div>

        <!-- Bottom 3 Columns -->
        <div style="display: grid; grid-template-columns: 1fr 180px 1fr; width: 100%; align-items: flex-end; padding: 0 1.5rem 1.5rem 1.5rem; margin-top: 2rem; box-sizing: border-box;">
          
          <!-- Left Column -->
          <div style="position: relative; display: flex; flex-direction: column; gap: 1rem; text-align: left; padding-right: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="3" y1="10" y2="10"></line></svg>
              <div style="display: flex; flex-direction: column; line-height: 1.25;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Completion Date</span>
                <span style="font-size: 0.95rem; font-weight: 600; color: #0d1b2a;">${formattedDate}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <div style="display: flex; flex-direction: column; line-height: 1.25;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Certificate ID</span>
                <span style="font-size: 0.95rem; font-weight: 600; color: #0d1b2a;">${certificateNumber}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
              <div style="display: flex; flex-direction: column; line-height: 1.25;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Issued On</span>
                <span style="font-size: 0.95rem; font-weight: 600; color: #0d1b2a;">${formattedDate}</span>
              </div>
            </div>
            <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 1.5px; background-color: #d97706;"></div>
          </div>

          <!-- Center Badge -->
          <div style="display: flex; justify-content: center;">
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 86px; height: 86px; border-radius: 50%; background: #d97706; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(217, 119, 6, 0.4); z-index: 10;">
                <div style="width: 74px; height: 74px; border-radius: 50%; background: #0d1b2a; border: 2px solid #d97706; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
                  <span style="font-size: 0.55rem; font-weight: 800; letter-spacing: 0.05em; color: #d97706; line-height: 1.1; margin-top: 1px;">CERTIFIED</span>
                  <span style="font-size: 0.55rem; font-weight: 800; letter-spacing: 0.05em; color: #d97706; line-height: 1.1;">LEARNER</span>
                  <span style="font-size: 0.52rem; color: #d97706; margin-top: 1px;">★ ★ ★</span>
                </div>
              </div>
              <!-- Ribbon tails -->
              <div style="position: absolute; top: 58px; left: 22px; width: 18px; height: 42px; background-color: #0d1b2a; clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); transform: rotate(15deg); z-index: 5;"></div>
              <div style="position: absolute; top: 58px; right: 22px; width: 18px; height: 42px; background-color: #0d1b2a; clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); transform: rotate(-15deg); z-index: 5;"></div>
            </div>
          </div>

          <!-- Right Column Signature -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            ${
              effectiveSignature && effectiveSignature.startsWith('data:image')
                ? `<img src="${effectiveSignature}" alt="Signature" style="max-height: 50px; max-width: 170px; object-fit: contain;" />`
                : `<div style="font-family: 'Times New Roman', Georgia, serif; font-style: italic; font-weight: 700; font-size: 1.85rem; color: #1d4ed8;">Admin Signature</div>`
            }
            <div style="width: 190px; height: 1.5px; background-color: #d97706; margin: 0.35rem 0 0.5rem 0;"></div>
            <span style="font-size: 0.92rem; font-weight: 700; color: #0d1b2a;">Authorized Signature</span>
            <span style="font-size: 0.8rem; color: #64748b;">Aereo Learning Institute</span>
          </div>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const safeName = (recipientName || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_');
    await downloadElementAsPdf(container.firstElementChild, `Certificate_${safeName}_${certificateNumber}.pdf`);
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};
