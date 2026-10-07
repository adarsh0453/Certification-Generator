import React, { useState } from 'react';
import { Download, AlertCircle, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getCertificateDownloadUrl } from '../services/api';
import { generateCertificatePdf } from '../utils/pdfGenerator';

export const RecipientTable = ({
  recipients = [],
  selectedRecipientId = null,
  onSelectRecipient = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || (r.status || '').toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'success':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> Success
          </span>
        );
      case 'failed':
        return (
          <span className="badge badge-failed">
            <AlertCircle size={12} /> Failed
          </span>
        );
      case 'processing':
        return (
          <span className="badge badge-processing">
            <RefreshCw size={12} className="spin" /> Processing
          </span>
        );
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div className="table-container glass-card">
      <div className="table-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by recipient name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input search-input"
          />
        </div>

        <div className="filter-buttons">
          {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-btn ${statusFilter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient Name</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Details / Error Message</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipients.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No recipients found matching current filter criteria.
                </td>
              </tr>
            ) : (
              filteredRecipients.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelectRecipient && onSelectRecipient(r)}
                  className={`table-row-clickable ${selectedRecipientId === r.id ? 'active-recipient-row' : ''}`}
                  title="Click to preview this recipient's certificate"
                >
                  <td className="font-mono">#{r.id}</td>
                  <td className="fw-600">{r.name}</td>
                  <td className="text-secondary">{r.email}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    {r.error_message ? (
                      <span className="error-text" title={r.error_message}>
                        <AlertCircle size={14} /> {r.error_message}
                      </span>
                    ) : r.status === 'success' ? (
                      <span className="success-text">Generated & Verified</span>
                    ) : (
                      <span className="text-muted">Queued</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectRecipient) onSelectRecipient(r);
                        generateCertificatePdf({
                          recipientName: r.name,
                          courseName: r.course_name || 'Certificate Program',
                          completionDate: r.completion_date || '07 October 2026',
                          certificateNumber: r.certificate_number || `CERT-${String(r.id || 1).padStart(6, '0')}`,
                        });
                      }}
                      className="btn btn-primary btn-sm"
                      title="Download official PDF Certificate"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .table-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input {
          padding-left: 2.75rem;
          width: 100%;
        }
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn.active, .filter-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          color: var(--accent-blue);
          border-color: rgba(59, 130, 246, 0.4);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .custom-table th {
          background: rgba(15, 23, 42, 0.6);
          padding: 0.85rem 1rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }
        .custom-table td {
          padding: 0.85rem 1rem;
          font-size: 0.88rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .font-mono {
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
        .fw-600 { font-weight: 600; }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        .error-text {
          color: var(--accent-rose);
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .success-text {
          color: var(--accent-emerald);
          font-size: 0.82rem;
        }
        .disabled-text {
          color: var(--text-muted);
          font-size: 0.82rem;
        }
        .table-row-clickable {
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .table-row-clickable:hover {
          background: rgba(37, 99, 235, 0.05);
        }
        .active-recipient-row {
          background: rgba(37, 99, 235, 0.1) !important;
          border-left: 3px solid #2563eb;
        }
        .empty-row {
          text-align: center;
          padding: 2.5rem !important;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
