import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobDetails, getCertificateDownloadUrl } from '../services/api';
import { ProgressBar } from '../components/ProgressBar';
import { RecipientTable } from '../components/RecipientTable';
import { CertificatePreview } from '../components/CertificatePreview';
import { ArrowLeft, RefreshCw, Calendar, Award, AlertTriangle, Layers } from 'lucide-react';

export const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollTimerRef = useRef(null);

  const loadJobDetails = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await fetchJobDetails(jobId);
      setJob(data);
      setError(null);

      const status = data.status;
      if (status === 'pending' || status === 'processing') {
        setIsPolling(true);
      } else {
        setIsPolling(false);
      }
    } catch (err) {
      setError(err.message || `Failed to load details for Job #${jobId}`);
      setIsPolling(false);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadJobDetails(true);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [jobId]);

  useEffect(() => {
    if (isPolling) {
      pollTimerRef.current = setInterval(() => {
        loadJobDetails(false);
      }, 2500);
    } else if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isPolling]);

  if (loading && !job) {
    return (
      <div className="loading-container">
        <RefreshCw size={32} className="spin text-blue" />
        <span>Loading Certificate Job #{jobId}...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="error-page ui-card">
        <AlertTriangle size={36} className="text-rose mb-2" />
        <h2>Job Not Found</h2>
        <p className="text-secondary">{error || 'Unable to retrieve job details.'}</p>
        <Link to="/" className="btn btn-primary mt-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const formatCertificateDate = (dateStr) => {
    if (!dateStr) return '07 October 2026';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  };

  const formattedDate = formatCertificateDate(job.completion_date);

  const formattedRecipients = (job.recipients || []).map((r, idx) => ({
    ...r,
    id: r.id || idx + 1,
    course_name: r.course_name || job.course_name,
    completion_date: r.completion_date || formattedDate,
    status: (r.status || 'success').toLowerCase(),
    certificate_number: r.certificate_number || `CERT-${String(100000 + idx + 1).slice(1)}`,
  }));

  const [selectedRecipientId, setSelectedRecipientId] = useState(null);

  // Active recipient for certificate preview
  const sampleRecipient =
    formattedRecipients.find((r) => r.id === selectedRecipientId) ||
    (formattedRecipients.length > 0 ? formattedRecipients[0] : null);

  return (
    <div className="job-details-page">
      {/* Header */}
      <div className="page-header">
        <div className="flex-align-center gap-3">
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
          <div className="job-badge">Job #{job.job_id}</div>
        </div>

        <div className="header-actions">
          {isPolling && (
            <div className="live-polling-pill">
              <RefreshCw size={14} className="spin text-blue" />
              <span>Live Updating (2s polling)</span>
            </div>
          )}
          <button onClick={() => loadJobDetails(true)} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Now
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Status Left, Certificate Preview Right */}
      <div className="job-details-grid">
        <div className="details-left-column">
          {/* Overview Metadata Card */}
          <div className="job-meta-card ui-card">
            <div className="meta-left">
              <div className="meta-icon-wrap">
                <Award size={24} className="text-gold" />
              </div>
              <div>
                <h1 className="course-title">{job.course_name || 'Certificate Program'}</h1>
                <div className="meta-sub-info">
                  <span className="info-item">
                    <Calendar size={14} /> Completion Date: <strong>{formattedDate}</strong>
                  </span>
                  <span className="info-item">
                    <Layers size={14} /> Created On: <strong>{new Date(job.created_at || Date.now()).toLocaleDateString()}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar & Counters */}
          <ProgressBar
            status={(job.status || 'completed').toLowerCase()}
            progressPercentage={job.progress_percentage || 100}
            total={job.total || formattedRecipients.length}
            successful={job.successful || formattedRecipients.length}
            failed={job.failed || 0}
            pending={job.pending || 0}
          />

          {/* Recipients Table */}
          <div className="mt-4">
            <h2 className="section-heading mb-3">Recipients & Download Links</h2>
            <RecipientTable
              recipients={formattedRecipients}
              selectedRecipientId={sampleRecipient?.id}
              onSelectRecipient={(r) => setSelectedRecipientId(r.id)}
            />
          </div>
        </div>

        {/* Right Column: Certificate Preview */}
        <div className="details-right-column">
          <CertificatePreview
            recipientName={sampleRecipient ? sampleRecipient.name : 'Adarsh Kumar'}
            courseName={job.course_name || 'Certificate Program'}
            completionDate={formattedDate}
            certificateNumber={sampleRecipient && sampleRecipient.certificate_number ? sampleRecipient.certificate_number : 'AER-2026-000001'}
            downloadUrl={sampleRecipient && sampleRecipient.certificate_id ? getCertificateDownloadUrl(sampleRecipient.certificate_id) : null}
          />
        </div>
      </div>

      <style>{`
        .job-details-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .job-details-grid {
          display: grid;
          grid-template-columns: 1fr 520px;
          gap: 1.5rem;
        }
        @media (max-width: 1200px) {
          .job-details-grid { grid-template-columns: 1fr; }
        }
        .details-left-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .job-badge {
          font-family: var(--font-mono);
          background: #eff6ff;
          color: var(--accent-blue);
          border: 1px solid #dbeafe;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .live-polling-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-blue);
        }
        .job-meta-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .meta-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .meta-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: #fef3c7;
          border: 1px solid #fde68a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text-gold { color: #d97706; }
        .course-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .meta-sub-info {
          display: flex;
          gap: 1.25rem;
          margin-top: 0.2rem;
        }
        .info-item {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .flex-align-center {
          display: flex;
          align-items: center;
        }
        .gap-3 { gap: 0.75rem; }
        .section-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .mb-3 { margin-bottom: 0.75rem; }
        .mt-4 { margin-top: 1rem; }
        .loading-container, .error-page {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
