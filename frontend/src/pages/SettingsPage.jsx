import React, { useState } from 'react';
import { Save, Shield, Building, Mail, Award, CheckCircle2 } from 'lucide-react';
import { NotificationToast } from '../components/NotificationToast';

export const SettingsPage = () => {
  const [orgName, setOrgName] = useState('Aereo Learning Institute');
  const [tagline, setTagline] = useState('LEARN · GROW · ACHIEVE');
  const [signatoryName, setSignatoryName] = useState('Admin Signature');
  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Signature');
  const [toast, setToast] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setToast({
      type: 'success',
      message: 'Certificate templates and organization settings saved successfully!',
    });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Organization & Certificate Settings</h1>
          <p className="page-subtitle">
            Customize certificate branding, authorized signatures, and API configurations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        <div className="ui-card settings-card">
          <h2 className="card-heading flex-align gap-2">
            <Building size={18} className="text-blue" />
            <span>Organization Branding</span>
          </h2>

          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline / Subtitle</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="ui-card settings-card">
          <h2 className="card-heading flex-align gap-2">
            <Award size={18} className="text-gold" />
            <span>Signature & Issuance</span>
          </h2>

          <div className="form-group">
            <label className="form-label">Default Signatory Name</label>
            <input
              type="text"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Signatory Title</label>
            <input
              type="text"
              value={signatoryTitle}
              onChange={(e) => setSignatoryTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="submit-row">
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={16} />
            <span>Save Preferences</span>
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
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .settings-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .card-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .flex-align { display: flex; align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .text-blue { color: var(--accent-blue); }
        .text-gold { color: var(--accent-amber); }
        .submit-row {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};
