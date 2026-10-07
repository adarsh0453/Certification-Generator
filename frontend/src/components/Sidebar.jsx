import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Award,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <Award size={20} className="text-gold" />
        </div>
        <div className="brand-text-wrap">
          <span className="brand-title">Aereo Learning Institute</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/jobs/new"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Create Job</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <List size={18} />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/certificates"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Award size={18} />
          <span>Certificates</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="system-pill">
          <ShieldCheck size={14} className="text-emerald" />
          <span>ReportLab Engine Active</span>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 240px;
          background-color: var(--bg-sidebar);
          display: flex;
          flex-direction: column;
          padding: 1.25rem 0.85rem;
          gap: 1.5rem;
          flex-shrink: 0;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.65rem;
        }
        .brand-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(217, 119, 6, 0.3));
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text-gold { color: #f59e0b; }
        .brand-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          line-height: 1.2;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          color: var(--text-sidebar);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }
        .nav-item.active {
          background-color: var(--accent-blue);
          color: #ffffff;
        }
        .sidebar-footer {
          margin-top: auto;
          padding: 0.5rem;
        }
        .system-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          color: var(--text-sidebar);
          font-weight: 600;
        }
        .text-emerald { color: #10b981; }
      `}</style>
    </aside>
  );
};
