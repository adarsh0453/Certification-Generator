import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Plus,
  ChevronDown,
  CheckCircle2,
  User,
  Settings,
  LogOut,
  LogIn,
  Award,
  FileText,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'AU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };
  const userInitials = getInitials(user?.name);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Job #J-005 Completed',
      message: '50 certificates generated for Python Programming',
      time: '10 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Certificate Verified',
      message: 'Certificate ID CERT-000001 created for Jane Doe',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Engine Status Online',
      message: 'FastAPI & ReportLab vector rendering pipeline active',
      time: '3 hours ago',
      unread: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        {/* Breadcrumb / Brand */}
      </div>

      <div className="navbar-right">
        {/* Interactive Notification Bell */}
        <div className="dropdown-wrapper">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="icon-btn"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="dropdown-panel ui-card notification-panel">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="btn-text-sm">
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="btn-close"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="notifications-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.unread ? 'unread' : ''}`}
                  >
                    <div className="item-icon">
                      <CheckCircle2 size={16} className="text-emerald" />
                    </div>
                    <div className="item-body">
                      <span className="item-title">{n.title}</span>
                      <span className="item-msg">{n.message}</span>
                      <span className="item-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive User Profile Pill & Dropdown / Sign In CTA */}
        {isAuthenticated ? (
          <div className="dropdown-wrapper">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="user-profile-pill"
            >
              <div className="user-avatar">{userInitials}</div>
              <span className="user-name">{user?.name || 'User'}</span>
              <ChevronDown size={14} className="text-muted" />
            </button>

            {/* User Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="dropdown-panel ui-card profile-menu-panel">
                <div className="profile-menu-header">
                  <div className="profile-avatar-large">{userInitials}</div>
                  <div className="profile-details">
                    <span className="profile-fullname">{user?.name || 'Administrator'}</span>
                    <span className="profile-email">{user?.email || 'admin@aereo.io'}</span>
                    <span className="badge badge-completed mt-1">Active Member</span>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-items">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="menu-item-btn"
                  >
                    <Settings size={15} />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/certificates');
                      setShowProfileMenu(false);
                    }}
                    className="menu-item-btn"
                  >
                    <Award size={15} />
                    <span>My Certificates</span>
                  </button>

                  <a
                    href="http://localhost:8000/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item-btn"
                  >
                    <FileText size={15} />
                    <span>API Documentation</span>
                  </a>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-footer">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/login');
                    }}
                    className="menu-item-btn danger"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary btn-sm auth-nav-btn">
            <LogIn size={15} />
            <span>Sign In</span>
          </Link>
        )}

        {/* Primary CTA Button */}
        <Link to="/jobs/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Create Certificate Job</span>
        </Link>
      </div>

      <style>{`
        .navbar-container {
          height: 64px;
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .dropdown-wrapper {
          position: relative;
        }
        .icon-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          background-color: #f1f5f9;
          color: var(--text-primary);
        }
        .notification-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          background-color: var(--accent-rose);
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }
        .user-profile-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          transition: background-color 0.2s ease;
        }
        .user-profile-pill:hover {
          background-color: #f1f5f9;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .dropdown-panel {
          position: absolute;
          top: 48px;
          right: 0;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .notification-panel {
          width: 320px;
        }
        .profile-menu-panel {
          width: 250px;
          padding: 0.5rem 0;
        }
        .profile-menu-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
        }
        .profile-avatar-large {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-details {
          display: flex;
          flex-direction: column;
        }
        .profile-fullname {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .profile-email {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .menu-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 0.35rem 0;
        }
        .menu-items, .menu-footer {
          display: flex;
          flex-direction: column;
        }
        .menu-item-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background-color 0.2s ease;
        }
        .menu-item-btn:hover {
          background-color: #f8fafc;
          color: var(--accent-blue);
        }
        .menu-item-btn.danger {
          color: var(--accent-rose);
        }
        .menu-item-btn.danger:hover {
          background-color: #fee2e2;
        }
        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
          background: #f8fafc;
        }
        .dropdown-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .btn-text-sm {
          background: transparent;
          border: none;
          color: var(--accent-blue);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
          max-height: 320px;
          overflow-y: auto;
        }
        .notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .notification-item.unread {
          background-color: #eff6ff;
        }
        .item-icon { margin-top: 2px; }
        .item-body {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .item-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .item-msg {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .item-time {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .text-muted { color: var(--text-muted); }
        .text-emerald { color: var(--accent-emerald); }
        .mt-1 { margin-top: 0.25rem; }
      `}</style>
    </header>
  );
};
