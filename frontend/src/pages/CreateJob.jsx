import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';
import { CsvUploader } from '../components/CsvUploader';
import { NotificationToast } from '../components/NotificationToast';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Play,
  UserPlus,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export const CreateJob = () => {
  const navigate = useNavigate();
  const signatureInputRef = useRef(null);

  const [courseName, setCourseName] = useState('Python Programming');
  const [completionDate, setCompletionDate] = useState('2026-10-07');
  const [mode, setMode] = useState('CSV');

  // Signature file & interactive upload state
  const [signatureName, setSignatureName] = useState(() => {
    return localStorage.getItem('custom_signature_name') || 'signature.png (12 KB)';
  });
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState(() => {
    return localStorage.getItem('custom_signature_preview') || null;
  });
  const [signatureError, setSignatureError] = useState(null);
  const [isDraggingSig, setIsDraggingSig] = useState(false);

  const processSignatureFile = (file) => {
    if (!file) return;

    // Check file format: JPG, JPEG, PNG
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png'];

    if (!validMimeTypes.includes(file.type) && !validExtensions.includes(extension)) {
      const err = 'Invalid file format. Only JPG, JPEG, or PNG files are supported.';
      setSignatureError(err);
      setToast({ type: 'error', message: err });
      if (signatureInputRef.current) signatureInputRef.current.value = '';
      return;
    }

    // Check file size: max 50 KB
    const maxSizeBytes = 50 * 1024;
    if (file.size > maxSizeBytes) {
      const actualKb = (file.size / 1024).toFixed(1);
      const err = `File size (${actualKb} KB) exceeds the 50 KB limit.`;
      setSignatureError(err);
      setToast({
        type: 'error',
        message: `File too large (${actualKb} KB). Maximum allowed is 50 KB.`,
      });
      if (signatureInputRef.current) signatureInputRef.current.value = '';
      return;
    }

    setSignatureError(null);
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    const formattedName = `${file.name} (${sizeKb} KB)`;
    setSignatureName(formattedName);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setSignaturePreviewUrl(result);
      try {
        localStorage.setItem('custom_signature_preview', result);
        localStorage.setItem('custom_signature_name', formattedName);
      } catch (storageErr) {
        console.warn('Unable to cache signature preview to localStorage', storageErr);
      }
    };
    reader.readAsDataURL(file);

    setToast({
      type: 'success',
      message: `Signature "${file.name}" uploaded successfully!`,
    });
  };

  const handleResetSignature = (e) => {
    e.stopPropagation();
    setSignatureName('signature.png (12 KB)');
    setSignaturePreviewUrl(null);
    setSignatureError(null);
    localStorage.removeItem('custom_signature_preview');
    localStorage.removeItem('custom_signature_name');
    if (signatureInputRef.current) signatureInputRef.current.value = '';
    setToast({
      type: 'info',
      message: 'Signature reset to default template signature.',
    });
  };

  // Sample recipient list loaded by default matching screenshot
  const [recipients, setRecipients] = useState([
    { name: 'Jane Doe', email: 'jane@example.com' },
    { name: 'Rahul Sharma', email: 'rahul@example.com' },
    { name: 'Priya Singh', email: 'priya@example.com' },
  ]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  const handleCsvParsed = (parsedRecipients) => {
    if (parsedRecipients && parsedRecipients.length > 0) {
      setRecipients(parsedRecipients);
      setToast({
        type: 'success',
        message: `Loaded ${parsedRecipients.length} recipients from CSV.`,
      });
    }
  };

  const addManualRecipient = () => {
    setRecipients([...recipients, { name: '', email: '' }]);
  };

  const removeManualRecipient = (index) => {
    if (recipients.length <= 1) return;
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateManualRecipient = (index, field, value) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) {
      setFormErrors(['Course or Event name is required.']);
      return;
    }

    setLoading(true);
    setFormErrors([]);

    const payload = {
      course_name: courseName.trim(),
      completion_date: completionDate,
      recipients: recipients.map((r) => ({
        name: r.name.trim(),
        email: r.email.trim().toLowerCase(),
      })),
    };

    try {
      const res = await createJob(payload);
      setToast({
        type: 'success',
        message: 'Certificate generation job created successfully!',
      });
      setTimeout(() => {
        navigate(`/jobs/${res.job_id}`);
      }, 800);
    } catch (err) {
      setFormErrors(err.errors || [err.message || 'Failed to submit job.']);
      setToast({ type: 'error', message: err.message || 'Error creating job' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Create Certificate Job</h1>
          <p className="page-subtitle">
            Add course details, upload recipients and start generating certificates.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="back-link">
          &larr; Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="job-form-stack">
        {/* Section 1: Course / Event Details */}
        <div className="ui-card form-section-card">
          <h2 className="section-title">1. Course / Event Details</h2>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Course / Event Name *</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Completion Date *</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Authorized Signature *</label>

              <input
                ref={signatureInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processSignatureFile(e.target.files[0]);
                  }
                }}
              />

              <div
                className={`signature-upload-pill ${signatureError ? 'has-error' : ''} ${isDraggingSig ? 'drag-over' : ''}`}
                onClick={() => signatureInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingSig(true);
                }}
                onDragLeave={() => setIsDraggingSig(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingSig(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processSignatureFile(e.dataTransfer.files[0]);
                  }
                }}
                title="Click or drag & drop to change signature (Max 50 KB)"
              >
                <div className="sig-info-cluster">
                  {signaturePreviewUrl ? (
                    <img
                      src={signaturePreviewUrl}
                      alt="Signature Preview"
                      className="sig-preview-thumb"
                    />
                  ) : (
                    <FileText size={16} className="text-blue" />
                  )}
                  <span className="sig-name">{signatureName}</span>
                </div>

                <div className="sig-actions-cluster" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => signatureInputRef.current?.click()}
                  >
                    Change
                  </button>
                  {signaturePreviewUrl && (
                    <button
                      type="button"
                      className="btn-link btn-link-subtle"
                      onClick={handleResetSignature}
                      title="Reset to default template signature"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {signatureError ? (
                <span className="field-note sig-error-text">{signatureError}</span>
              ) : (
                <span className="field-note">JPG, JPEG or PNG (Max 50 KB)</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Upload Recipients */}
        <div className="ui-card form-section-card">
          <h2 className="section-title">2. Upload Recipients</h2>

          <div className="tab-bar">
            <button
              type="button"
              className={`tab-btn ${mode === 'CSV' ? 'active' : ''}`}
              onClick={() => setMode('CSV')}
            >
              Upload CSV
            </button>
            <button
              type="button"
              className={`tab-btn ${mode === 'MANUAL' ? 'active' : ''}`}
              onClick={() => setMode('MANUAL')}
            >
              Add Manually
            </button>
          </div>

          <div className="recipients-dual-grid">
            {/* Left Upload Zone */}
            {mode === 'CSV' ? (
              <CsvUploader onRecipientsParsed={handleCsvParsed} />
            ) : (
              <div className="manual-recipients-container">
                <div className="manual-header">
                  <span>Manual Roster Input</span>
                  <button
                    type="button"
                    onClick={addManualRecipient}
                    className="btn btn-secondary btn-sm"
                  >
                    <UserPlus size={14} /> Add Row
                  </button>
                </div>
                {recipients.map((r, i) => (
                  <div key={i} className="manual-row">
                    <input
                      type="text"
                      placeholder="Name"
                      value={r.name}
                      onChange={(e) => updateManualRecipient(i, 'name', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={r.email}
                      onChange={(e) => updateManualRecipient(i, 'email', e.target.value)}
                      className="form-input"
                    />
                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeManualRecipient(i)}
                        className="btn-icon danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Right Recipient Preview Table */}
            <div className="recipient-preview-box">
              <span className="preview-table-title">Recipient Preview</span>
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Photo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.slice(0, 5).map((r, idx) => (
                    <tr key={idx}>
                      <td className="font-mono">{idx + 1}</td>
                      <td className="fw-600">{r.name || 'Jane Doe'}</td>
                      <td className="text-muted">{r.email || 'jane@example.com'}</td>
                      <td>
                        <div className="avatar-micro">
                          {r.name ? r.name[0].toUpperCase() : 'A'}
                        </div>
                      </td>
                      <td>
                        <CheckCircle2 size={16} className="text-emerald" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <span className="view-more-note">View all {recipients.length} recipients &rarr;</span>
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="submit-action-bar">
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
            <Play size={16} fill="currentColor" />
            <span>{loading ? 'Generating...' : 'Generate Certificates'}</span>
          </button>
        </div>
      </form>

      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        .create-job-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .back-link {
          background: transparent;
          border: none;
          color: var(--accent-blue);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .job-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-section-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .form-grid-3 { grid-template-columns: 1fr; }
        }
        .signature-upload-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .signature-upload-pill:hover {
          border-color: var(--accent-blue);
          background: #f1f5f9;
        }
        .signature-upload-pill.has-error {
          border-color: #ef4444;
          background: #fef2f2;
        }
        .signature-upload-pill.drag-over {
          border: 2px dashed var(--accent-blue);
          background: #eff6ff;
        }
        .sig-info-cluster {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          overflow: hidden;
        }
        .sig-preview-thumb {
          width: 32px;
          height: 20px;
          object-fit: contain;
          border-radius: 3px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1px;
          flex-shrink: 0;
        }
        .sig-actions-cluster {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .btn-link-subtle {
          color: var(--text-muted);
          font-weight: 500;
        }
        .btn-link-subtle:hover {
          color: var(--text-primary);
        }
        .sig-error-text {
          color: #ef4444 !important;
          font-weight: 600;
        }
        .sig-name {
          font-size: 0.82rem;
          font-weight: 600;
        }
        .btn-link {
          background: transparent;
          border: none;
          color: var(--accent-blue);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .field-note {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .tab-bar {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }
        .tab-btn {
          padding: 0.45rem 1rem;
          border: 1px solid transparent;
          background: transparent;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .tab-btn.active {
          background-color: var(--accent-blue-light);
          color: var(--accent-blue);
          border-color: rgba(37, 99, 235, 0.2);
        }
        .recipients-dual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .recipients-dual-grid { grid-template-columns: 1fr; }
        }
        .recipient-preview-box {
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .preview-table-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .preview-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .preview-table th {
          font-size: 0.75rem;
          color: var(--text-muted);
          padding: 0.4rem;
          border-bottom: 1px solid var(--border-color);
        }
        .preview-table td {
          padding: 0.45rem;
          font-size: 0.82rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .avatar-micro {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3b82f6;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .view-more-note {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-blue);
          cursor: pointer;
        }
        .submit-action-bar {
          display: flex;
          justify-content: flex-end;
        }
        .text-blue { color: var(--accent-blue); }
        .text-emerald { color: var(--accent-emerald); }
        .manual-recipients-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .manual-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .manual-row {
          display: flex;
          gap: 0.5rem;
        }
        .btn-icon.danger {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
