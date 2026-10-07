import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: {
      accent: '#2563eb',
      bg: '#eff6ff',
      border: '#dbeafe',
    },
    amber: {
      accent: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a',
    },
    emerald: {
      accent: '#16a34a',
      bg: '#dcfce7',
      border: '#bbf7d0',
    },
    rose: {
      accent: '#dc2626',
      bg: '#fee2e2',
      border: '#fecaca',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card ui-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div
            className="stat-icon-box"
            style={{
              backgroundColor: scheme.bg,
              borderColor: scheme.border,
              color: scheme.accent,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}

      <style>{`
        .stat-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .stat-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .stat-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
