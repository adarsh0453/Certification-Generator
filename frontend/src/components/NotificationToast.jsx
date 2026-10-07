import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const NotificationToast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast-banner ${type}`}>
      <div className="toast-content">
        {type === 'success' ? (
          <CheckCircle2 size={18} className="toast-icon" />
        ) : (
          <AlertCircle size={18} className="toast-icon" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="toast-close">
          <X size={14} />
        </button>
      )}

      <style>{`
        .toast-banner {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 600;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toast-banner.success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: var(--accent-emerald);
        }
        .toast-banner.error {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.4);
          color: var(--accent-rose);
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .toast-close {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          opacity: 0.7;
        }
        .toast-close:hover { opacity: 1; }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
