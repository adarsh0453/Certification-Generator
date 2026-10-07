import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { parseCsvFile } from '../services/api';

export const CsvUploader = ({ onRecipientsParsed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [parsedCount, setParsedCount] = useState(0);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setValidationErrors(['Invalid file type. Please upload a .csv file.']);
      return;
    }

    setSelectedFile(file);
    setLoading(true);
    setValidationErrors([]);

    try {
      const res = await parseCsvFile(file);
      setParsedCount(res.recipients_count || 0);
      if (res.validation_warnings && res.validation_warnings.length > 0) {
        setValidationErrors(res.validation_warnings);
      }
      if (res.recipients) {
        onRecipientsParsed(res.recipients);
      }
    } catch (err) {
      const errMsgs = err.errors || [err.message || 'Failed to parse CSV file.'];
      setValidationErrors(errMsgs);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="csv-uploader-wrapper">
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="csv-input"
          accept=".csv"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="csv-input" className="drop-zone-label">
          <UploadCloud size={38} className="upload-icon" />
          <div className="upload-text">
            <span className="upload-title">Click to upload or drag & drop CSV file</span>
            <span className="upload-sub">File must contain headers: name, email</span>
          </div>
        </label>
      </div>

      {selectedFile && (
        <div className="selected-file-pill">
          <FileText size={16} className="text-blue" />
          <span className="file-name">{selectedFile.name}</span>
          {parsedCount > 0 && (
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> {parsedCount} Recipients Loaded
            </span>
          )}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="validation-error-box">
          <div className="error-box-header">
            <AlertTriangle size={16} />
            <span>CSV Validation Errors ({validationErrors.length})</span>
          </div>
          <ul className="error-list">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .csv-uploader-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .drop-zone {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          padding: 2.5rem;
          text-align: center;
          background: rgba(15, 23, 42, 0.4);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .drop-zone:hover, .drop-zone.drag-active {
          border-color: var(--accent-blue);
          background: rgba(59, 130, 246, 0.08);
        }
        .drop-zone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
        }
        .upload-icon {
          color: var(--accent-blue);
        }
        .upload-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .upload-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .selected-file-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-color);
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
        }
        .file-name {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .validation-error-box {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: var(--radius-sm);
          padding: 1rem;
          color: var(--accent-rose);
        }
        .error-box-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.88rem;
          margin-bottom: 0.5rem;
        }
        .error-list {
          padding-left: 1.25rem;
          font-size: 0.82rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};
