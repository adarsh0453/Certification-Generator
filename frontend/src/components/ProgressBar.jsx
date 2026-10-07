import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export const ProgressBar = ({
  status,
  progressPercentage = 0,
  total = 0,
  successful = 0,
  failed = 0,
  pending = 0,
}) => {
  const isWarning = failed > 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'completed_with_errors':
        return <span className="badge badge-completed_with_errors">Completed With Errors</span>;
      case 'processing':
        return (
          <span className="badge badge-processing">
            <RefreshCw size={12} className="spin" /> Processing
          </span>
        );
      case 'failed':
        return <span className="badge badge-failed">Failed</span>;
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div className="progress-card glass-card">
      <div className="progress-header">
        <div className="progress-title-wrap">
          <span className="progress-label">Generation Progress</span>
          {getStatusBadge()}
        </div>
        <span className="progress-percent">{progressPercentage}%</span>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${isWarning ? 'warning' : ''}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="stats-mini-grid">
        <div className="mini-stat">
          <span className="mini-stat-label">Total Recipients</span>
          <span className="mini-stat-value">{total}</span>
        </div>
        <div className="mini-stat success">
          <span className="mini-stat-label">
            <CheckCircle2 size={13} /> Successful
          </span>
          <span className="mini-stat-value">{successful}</span>
        </div>
        <div className="mini-stat danger">
          <span className="mini-stat-label">
            <AlertTriangle size={13} /> Failed
          </span>
          <span className="mini-stat-value">{failed}</span>
        </div>
        <div className="mini-stat warning">
          <span className="mini-stat-label">
            <Clock size={13} /> Pending
          </span>
          <span className="mini-stat-value">{pending}</span>
        </div>
      </div>

      <style>{`
        .progress-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .progress-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .progress-label {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
        }
        .progress-percent {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--accent-blue);
          font-family: var(--font-mono);
        }
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .stats-mini-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .mini-stat {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mini-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }
        .mini-stat-value {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .mini-stat.success .mini-stat-value {
          color: var(--accent-emerald);
        }
        .mini-stat.danger .mini-stat-value {
          color: var(--accent-rose);
        }
        .mini-stat.warning .mini-stat-value {
          color: var(--accent-amber);
        }
      `}</style>
    </div>
  );
};
