import React from 'react';
import { Download, Calendar, FileText, Award } from 'lucide-react';

export const CertificatePreview = ({
  recipientName = 'Jane Doe',
  courseName = 'Python',
  completionDate = '07 October 2026',
  certificateNumber = 'CERT-000001',
  downloadUrl = null,
  signatoryName = 'Admin Signature',
  signatureImage = null,
}) => {
  const effectiveSignatureImage =
    signatureImage ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('custom_signature_preview')
      : null);
  return (
    <div className="preview-card ui-card">
      <div className="preview-top-bar">
        <div>
          <h3 className="preview-heading">Certificate Visual Preview</h3>
          <p className="preview-sub">
            Real-time interactive preview matching official ReportLab vector PDF render.
          </p>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </a>
        )}
      </div>

      {/* Official Certificate Paper Container */}
      <div className="certificate-paper-wrap">
        {/* Guilloche Security Wavy Lines Background */}
        <div className="guilloche-overlay"></div>

        {/* Top-Left Geometric Navy/Gold Ribbon Banner */}
        <div className="ribbon-top-left">
          <div className="ribbon-navy"></div>
          <div className="ribbon-gold"></div>
          <div className="ribbon-subnavy"></div>
        </div>

        {/* Bottom-Right Geometric Navy/Gold Ribbon Banner */}
        <div className="ribbon-bottom-right">
          <div className="ribbon-navy"></div>
          <div className="ribbon-gold"></div>
          <div className="ribbon-subnavy"></div>
        </div>

        {/* Corner Ornaments */}
        <div className="corner-fan top-right"></div>
        <div className="corner-fan bottom-left"></div>

        {/* Double Gold Inner Border Frame */}
        <div className="double-gold-frame"></div>

        {/* Certificate Content Stack */}
        <div className="cert-body">
          {/* Header Branding */}
          <div className="brand-header">
            <div className="brand-logo-icon">
              <Award size={22} className="text-gold" />
            </div>
            <div className="brand-title">Aereo Learning Institute</div>
            <div className="brand-tagline">LEARN &nbsp;·&nbsp; GROW &nbsp;·&nbsp; ACHIEVE</div>
          </div>

          {/* Title Section */}
          <div className="cert-title-wrap">
            <h1 className="cert-title">
              <span className="navy-text">CERTIFICATE </span>
              <span className="gold-text">OF </span>
              <span className="navy-text">COMPLETION</span>
            </h1>
            <div className="flourish-divider">
              <div className="flourish-line"></div>
              <div className="flourish-diamond">◆</div>
              <div className="flourish-line"></div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="cert-subtitle">THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>

          {/* Recipient Name (Calligraphic Script) */}
          <div className="recipient-name-wrap">
            <h2 className="recipient-name-script">{recipientName}</h2>
            <div className="name-underline"></div>
          </div>

          {/* Course Details */}
          <p className="cert-course-label">for successfully completing the course/event</p>
          <h3 className="cert-course-name">{courseName}</h3>

          {/* Bottom 3-Column Section */}
          <div className="cert-bottom-grid">
            {/* Left Column: Metadata List with Icons & Divider */}
            <div className="meta-column">
              <div className="meta-item">
                <div className="icon-box">
                  <Calendar size={14} className="text-gold" />
                </div>
                <div className="meta-text">
                  <span className="meta-label">Completion Date</span>
                  <span className="meta-val">{completionDate}</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="icon-box">
                  <FileText size={14} className="text-gold" />
                </div>
                <div className="meta-text">
                  <span className="meta-label">Certificate ID</span>
                  <span className="meta-val">{certificateNumber}</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="icon-box">
                  <Award size={14} className="text-gold" />
                </div>
                <div className="meta-text">
                  <span className="meta-label">Issued On</span>
                  <span className="meta-val">{completionDate}</span>
                </div>
              </div>

              <div className="vertical-divider"></div>
            </div>

            {/* Center Column: Ribbon Badge */}
            <div className="badge-column">
              <div className="ribbon-badge-wrapper">
                <div className="badge-scallop-circle">
                  <div className="badge-inner-navy">
                    <Award size={16} className="badge-logo-gold" />
                    <span className="badge-text">CERTIFIED</span>
                    <span className="badge-subtext">LEARNER</span>
                    <span className="badge-stars">★ ★ ★</span>
                  </div>
                </div>

                {/* Hanging Ribbon Tails */}
                <div className="ribbon-tail left-tail"></div>
                <div className="ribbon-tail right-tail"></div>
              </div>
            </div>

            {/* Right Column: Signature Block */}
            <div className="signature-column">
              {effectiveSignatureImage ? (
                <div className="signature-img-container">
                  <img
                    src={effectiveSignatureImage}
                    alt="Authorized Signature"
                    className="signature-preview-img"
                  />
                </div>
              ) : (
                <div className="signature-font">{signatoryName}</div>
              )}
              <div className="sig-line"></div>
              <span className="sig-title">Authorized Signature</span>
              <span className="sig-org">Aereo Learning Institute</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .preview-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .preview-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .preview-heading {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .preview-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .certificate-paper-wrap {
          position: relative;
          background: #fcfcfd;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          padding: 2rem 2.5rem;
          overflow: hidden;
          min-height: 520px;
          border: 1px solid #e2e8f0;
        }

        /* Guilloche Security Overlay */
        .guilloche-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 70%),
            repeating-linear-gradient(45deg, rgba(226, 232, 240, 0.2) 0px, rgba(226, 232, 240, 0.2) 2px, transparent 2px, transparent 8px);
          pointer-events: none;
        }

        /* Double Gold Inner Border Frame */
        .double-gold-frame {
          position: absolute;
          inset: 18px;
          border: 1.5px solid #d97706;
          pointer-events: none;
        }
        .double-gold-frame::after {
          content: '';
          position: absolute;
          inset: 3px;
          border: 0.75px solid #d97706;
        }

        /* Top-Left Ribbon Banners */
        .ribbon-top-left {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .ribbon-top-left .ribbon-navy {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 140px 140px 0 0;
          border-color: #0d1b2a transparent transparent transparent;
        }
        .ribbon-top-left .ribbon-gold {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 165px 165px 0 0;
          border-color: #eab308 transparent transparent transparent;
          z-index: -1;
        }
        .ribbon-top-left .ribbon-subnavy {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 180px 180px 0 0;
          border-color: #1b263b transparent transparent transparent;
          z-index: -2;
        }

        /* Bottom-Right Ribbon Banners */
        .ribbon-bottom-right {
          position: absolute;
          bottom: 0;
          right: 0;
          pointer-events: none;
        }
        .ribbon-bottom-right .ribbon-navy {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 140px 140px;
          border-color: transparent transparent #0d1b2a transparent;
        }
        .ribbon-bottom-right .ribbon-gold {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 165px 165px;
          border-color: transparent transparent #eab308 transparent;
          z-index: -1;
        }
        .ribbon-bottom-right .ribbon-subnavy {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 180px 180px;
          border-color: transparent transparent #1b263b transparent;
          z-index: -2;
        }

        /* Corner Fans */
        .corner-fan {
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          z-index: 5;
        }
        .corner-fan.top-right {
          top: 18px;
          right: 18px;
          border-width: 0 16px 16px 0;
          border-color: transparent #d97706 transparent transparent;
        }
        .corner-fan.bottom-left {
          bottom: 18px;
          left: 18px;
          border-width: 16px 0 0 16px;
          border-color: transparent transparent transparent #d97706;
        }

        /* Body Stack */
        .cert-body {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Header Branding */
        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          margin-bottom: 1.25rem;
        }
        .brand-logo-icon {
          color: #d97706;
          margin-bottom: 0.15rem;
        }
        .brand-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0d1b2a;
          letter-spacing: -0.01em;
        }
        .brand-tagline {
          font-size: 0.68rem;
          font-weight: 700;
          color: #d97706;
          letter-spacing: 0.2em;
        }

        /* Title */
        .cert-title-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
        .cert-title {
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .navy-text { color: #0d1b2a; }
        .gold-text { color: #d97706; }

        .flourish-divider {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .flourish-line {
          width: 70px;
          height: 1px;
          background-color: #d97706;
        }
        .flourish-diamond {
          color: #d97706;
          font-size: 0.75rem;
        }

        .cert-subtitle {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.12em;
          margin-bottom: 1.25rem;
        }

        /* Recipient Name Script */
        .recipient-name-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }
        .recipient-name-script {
          font-family: 'Times New Roman', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 2.35rem;
          color: #0f2b48;
          line-height: 1.1;
        }
        .name-underline {
          width: 220px;
          height: 1.5px;
          background-color: #fef3c7;
          margin-top: 0.35rem;
        }

        .cert-course-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.2rem;
        }
        .cert-course-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0d1b2a;
          margin-bottom: 2rem;
        }

        /* Bottom 3 Columns */
        .cert-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 140px 1fr;
          width: 100%;
          align-items: flex-end;
          padding: 0 1rem;
        }

        /* Left Column */
        .meta-column {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          text-align: left;
          padding-right: 1.5rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .icon-box {
          color: #d97706;
        }
        .meta-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .meta-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
        }
        .meta-val {
          font-size: 0.78rem;
          font-weight: 600;
          color: #0d1b2a;
        }
        .vertical-divider {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background-color: #d97706;
        }

        /* Center Ribbon Badge */
        .badge-column {
          display: flex;
          justify-content: center;
        }
        .ribbon-badge-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .badge-scallop-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
          z-index: 10;
        }
        .badge-inner-navy {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #0d1b2a;
          border: 1.5px solid #d97706;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .badge-logo-gold { color: #d97706; margin-bottom: 1px; }
        .badge-text, .badge-subtext {
          font-size: 0.48rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #d97706;
          line-height: 1.1;
        }
        .badge-stars {
          font-size: 0.45rem;
          color: #d97706;
          margin-top: 1px;
        }

        .ribbon-tail {
          position: absolute;
          top: 45px;
          width: 14px;
          height: 32px;
          background-color: #0d1b2a;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
          z-index: 5;
        }
        .ribbon-tail.left-tail { left: 16px; transform: rotate(15deg); }
        .ribbon-tail.right-tail { right: 16px; transform: rotate(-15deg); }

        /* Right Column Signature */
        .signature-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .signature-font {
          font-family: 'Times New Roman', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.35rem;
          color: #1d4ed8;
        }
        .signature-img-container {
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signature-preview-img {
          max-height: 36px;
          max-width: 130px;
          object-fit: contain;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        .sig-line {
          width: 150px;
          height: 1px;
          background-color: #d97706;
          margin: 0.25rem 0 0.4rem 0;
        }
        .sig-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0d1b2a;
        }
        .sig-org {
          font-size: 0.7rem;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};
