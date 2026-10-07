import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import { ArrowRight, RefreshCw, Plus, Layers } from 'lucide-react';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetchJobs(1, 50);
      setJobs(res.items || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'completed_with_errors':
        return <span className="badge badge-completed_with_errors">With Errors</span>;
      case 'processing':
        return (
          <span className="badge badge-processing">
            <RefreshCw size={11} className="spin" /> Processing
          </span>
        );
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div className="jobs-page">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Certificate Jobs Roster</h1>
          <p className="page-subtitle">Manage and track all bulk certificate generation runs.</p>
        </div>
        <Link to="/jobs/new" className="btn btn-primary">
          <Plus size={16} />
          <span>New Job</span>
        </Link>
      </div>

      <div className="ui-card table-card">
        {loading ? (
          <div className="loading-box">
            <RefreshCw size={24} className="spin text-blue" />
            <span>Loading Jobs...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Course / Event Name</th>
                  <th>Completion Date</th>
                  <th>Status</th>
                  <th>Total Recipients</th>
                  <th>Successful</th>
                  <th>Failed</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.job_id}>
                    <td className="font-mono">#{typeof j.job_id === 'number' ? `J-${String(j.job_id).padStart(3, '0')}` : j.job_id}</td>
                    <td className="fw-600">{j.course_name}</td>
                    <td className="text-secondary">{j.completion_date}</td>
                    <td>{getStatusBadge(j.status)}</td>
                    <td className="fw-600">{j.total_recipients}</td>
                    <td className="text-emerald fw-600">{j.successful_count}</td>
                    <td className={j.failed_count > 0 ? 'text-rose fw-600' : 'text-muted'}>
                      {j.failed_count}
                    </td>
                    <td className="text-muted text-sm">
                      {new Date(j.created_at).toLocaleString()}
                    </td>
                    <td>
                      <Link to={`/jobs/${j.job_id}`} className="btn btn-secondary btn-sm">
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .jobs-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .table-card { padding: 1.5rem; }
        .loading-box {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .text-emerald { color: var(--accent-emerald); }
        .text-rose { color: var(--accent-rose); }
        .text-blue { color: var(--accent-blue); }
      `}</style>
    </div>
  );
};
