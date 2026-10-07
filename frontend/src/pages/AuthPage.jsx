import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationToast } from '../components/NotificationToast';
import deskHeroHd from '../assets/login_desk_hd.png';
import {
  Lock,
  Mail,
  User,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Zap,
  Eye,
  EyeOff,
  X,
  Plus,
  Check,
} from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle } = useAuth();

  // Mode: 'signin' or 'signup'
  const isRegisterRoute =
    location.pathname.includes('register') || location.pathname.includes('signup');
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage('Full name is required.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await register(name.trim(), email.trim().toLowerCase(), password);
        setToast({
          type: 'success',
          message: 'Account created and signed in successfully!',
        });
      } else {
        await login(email.trim().toLowerCase(), password);
        setToast({
          type: 'success',
          message: 'Signed in successfully!',
        });
      }

      setTimeout(() => {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }, 500);
    } catch (err) {
      const msg =
        err.message ||
        (isSignUp ? 'Registration failed.' : 'Incorrect email or password.');
      setErrorMessage(msg);
      setToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isCustomGoogleInput, setIsCustomGoogleInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const handleGoogleAccountSelect = async (selectedEmail, selectedName) => {
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle(selectedEmail, selectedName);
      setShowGoogleModal(false);
      setToast({
        type: 'success',
        message: `Signed in as ${selectedName} via Google!`,
      });
      setTimeout(() => {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed.');
      setToast({
        type: 'error',
        message: err.message || 'Google authentication failed.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const emailToUse = customGoogleEmail.trim().toLowerCase();
    const nameToUse =
      customGoogleName.trim() ||
      emailToUse.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase());
    handleGoogleAccountSelect(emailToUse, nameToUse);
  };

  return (
    <div className="login-split-page">
      {/* Left Column: Crisp Vector Typography & High-Definition Desk Scene */}
      <div className="login-hero-column">
        {/* Upper Vector Content Area */}
        <div className="hero-content-cluster">
          {/* Top Brand Header */}
          <div className="hero-brand-row">
            <div className="hero-emblem-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9.5" r="5" stroke="#f59e0b" strokeWidth="2.2" />
                <path
                  d="M8.5 14L7 20.5L12 17.5L17 20.5L15.5 14"
                  stroke="#f59e0b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hero-brand-text">
              <h2 className="hero-brand-title">Aereo Learning Institute</h2>
              <span className="hero-brand-subtitle">
                Enterprise Bulk Certificate Generation Platform
              </span>
            </div>
          </div>

          {/* Large Hero Headline */}
          <div className="hero-headline-block">
            <h1 className="hero-main-title">
              <span className="title-line-1">Learn Today,</span>
              <span className="title-line-2">Build Tomorrow</span>
            </h1>
            <p className="hero-main-desc">
              Simplifying certification, empowering learning, and building a skilled
              tomorrow.
            </p>
          </div>

          {/* Three Feature Badges */}
          <div className="hero-features-row">
            <div className="hero-feature-item">
              <div className="feature-icon-circle bg-blue">
                <GraduationCap size={16} color="#ffffff" />
              </div>
              <div className="feature-text-block">
                <span className="feature-title">Secure</span>
                <span className="feature-sub">Your data, our priority</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-circle bg-purple">
                <Zap size={16} color="#ffffff" />
              </div>
              <div className="feature-text-block">
                <span className="feature-title">Fast</span>
                <span className="feature-sub">Quick & hassle-free</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-circle bg-green">
                <ShieldCheck size={16} color="#ffffff" />
              </div>
              <div className="feature-text-block">
                <span className="feature-title">Trusted</span>
                <span className="feature-sub">By learners worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Desk Artwork Area with Floating Journey Callout */}
        <div className="hero-artwork-area">
          {/* Floating Handwritten Journey Callout */}
          <div className="journey-callout-doodle">
            <span className="journey-star">›</span>
            <div className="journey-text-lines">
              <span>Your</span>
              <span>Learning</span>
              <span>Journey</span>
              <span>Starts Here</span>
            </div>
            <svg
              className="journey-curved-arrow"
              width="36"
              height="48"
              viewBox="0 0 36 48"
              fill="none"
            >
              <path
                d="M 10 4 C 28 12, 28 30, 8 40"
                stroke="#60a5fa"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M 4 33 L 7 42 L 17 41"
                stroke="#60a5fa"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* HD Desk Photography Artwork */}
          <div className="desk-image-container">
            <img
              src={deskHeroHd}
              alt="Study Desk with Books and Laptop"
              className="desk-hd-image"
            />
            <div className="desk-gradient-overlay" />
          </div>
        </div>

        {/* Fluid Organic Wave Edge into Right Column */}
        <svg
          className="hero-wave-edge"
          viewBox="0 0 60 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 0 C 45 250, 5 450, 40 700 C 55 820, 60 920, 60 1000 L 0 1000 Z"
            fill="#081734"
          />
        </svg>
      </div>

      {/* Right Column: Clean White Authentication Card */}
      <div className="login-form-column">
        {/* Playful Floating Badge in Top Right */}
        <div className="floating-skills-badge">
          <span className="skills-line-1">Skills</span>
          <span className="skills-line-2">Create</span>
          <span className="skills-line-3">Opportunities</span>
          <svg
            className="skills-underline"
            width="85"
            height="14"
            viewBox="0 0 100 16"
            fill="none"
          >
            <path
              d="M3 11 C 30 3, 70 3, 97 12"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Decorative 3x3 Dot Matrix in Bottom Right */}
        <div className="bottom-dot-matrix">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="matrix-dot" />
          ))}
        </div>

        {/* Centered Modern White Card */}
        <div className="login-main-card">
          {/* Card Header Badge */}
          <div className="card-brand-header">
            <div className="card-badge-emblem">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9.5" r="5" stroke="#f59e0b" strokeWidth="2.2" />
                <path
                  d="M8.5 14L7 20.5L12 17.5L17 20.5L15.5 14"
                  stroke="#f59e0b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="card-brand-title">Aereo Learning Institute</h1>
            <p className="card-brand-subtitle">
              Enterprise Bulk Certificate Generation Platform
            </p>
          </div>

          {/* Dual Navigation Tabs */}
          <div className="card-tab-nav">
            <button
              type="button"
              className={`tab-toggle-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
            >
              <User size={15} />
              <span>Sign In / Log In</span>
            </button>
            <button
              type="button"
              className={`tab-toggle-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {errorMessage && (
            <div className="card-error-banner">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-auth-form">
            {isSignUp && (
              <div className="card-form-group">
                <label className="card-input-label">Full Name</label>
                <div className="card-input-wrap">
                  <User size={16} className="card-input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Dr. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="card-text-input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="card-form-group">
              <label className="card-input-label">Email Address</label>
              <div className="card-input-wrap">
                <Mail size={16} className="card-input-icon" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="card-text-input"
                  required
                />
              </div>
            </div>

            <div className="card-form-group">
              <label className="card-input-label">Password</label>
              <div className="card-input-wrap">
                <Lock size={16} className="card-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="card-text-input password-input"
                  required
                />
                <button
                  type="button"
                  className="card-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="card-form-group">
                <label className="card-input-label">Confirm Password</label>
                <div className="card-input-wrap">
                  <Lock size={16} className="card-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="card-text-input password-input"
                    required
                  />
                </div>
              </div>
            )}

            {/* Gradient Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="card-submit-button"
            >
              <span>
                {loading
                  ? 'Authenticating...'
                  : isSignUp
                  ? 'Create My Account'
                  : 'Sign In to Workspace'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* OR Divider */}
          <div className="card-divider-row">
            <span className="divider-line" />
            <span className="divider-text">OR</span>
            <span className="divider-line" />
          </div>

          {/* Continue with Google Social Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            className="card-google-button"
            id="google-signin-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Secure Trust Footer Badge */}
          <div className="card-trust-footer">
            <ShieldCheck size={14} className="text-emerald" />
            <span>Secure SHA-256 JWT Authentication</span>
          </div>
        </div>
      </div>

      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Interactive Google Sign-In Account Selector Modal */}
      {showGoogleModal && (
        <div
          className="google-modal-backdrop"
          onClick={() => !googleLoading && setShowGoogleModal(false)}
        >
          <div className="google-oauth-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="google-modal-header">
              <div className="google-brand-header-flex">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="google-modal-titles">
                  <h3 className="google-modal-title">Sign in with Google</h3>
                  <p className="google-modal-subtitle">
                    Choose an account to continue to Aereo Learning Institute
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="google-close-btn"
                onClick={() => !googleLoading && setShowGoogleModal(false)}
                disabled={googleLoading}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {googleLoading ? (
              <div className="google-loading-state">
                <div className="google-spinner" />
                <span>Connecting to Google Account Services...</span>
              </div>
            ) : (
              <>
                {/* Account List */}
                <div className="google-accounts-list">
                  {/* Account 1: Admin */}
                  <div
                    className="google-account-card"
                    onClick={() =>
                      handleGoogleAccountSelect('admin@aereo.io', 'Admin User')
                    }
                  >
                    <div className="google-account-avatar avatar-blue">A</div>
                    <div className="google-account-details">
                      <span className="google-user-name">Admin User</span>
                      <span className="google-user-email">admin@aereo.io</span>
                    </div>
                    <span className="google-account-tag">Administrator</span>
                  </div>

                  {/* Account 2: Learner */}
                  <div
                    className="google-account-card"
                    onClick={() =>
                      handleGoogleAccountSelect('learner@gmail.com', 'Alex Rivera')
                    }
                  >
                    <div className="google-account-avatar avatar-emerald">A</div>
                    <div className="google-account-details">
                      <span className="google-user-name">Alex Rivera</span>
                      <span className="google-user-email">learner@gmail.com</span>
                    </div>
                    <span className="google-account-tag">Learner</span>
                  </div>

                  {/* Custom Account Input Toggle */}
                  {!isCustomGoogleInput ? (
                    <div
                      className="google-account-card add-account-card"
                      onClick={() => setIsCustomGoogleInput(true)}
                    >
                      <div className="google-account-avatar avatar-gray">
                        <Plus size={18} />
                      </div>
                      <div className="google-account-details">
                        <span className="google-user-name">Use another Google account</span>
                        <span className="google-user-email">
                          Sign in with any custom email address
                        </span>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleCustomGoogleSubmit}
                      className="custom-google-form"
                    >
                      <div className="custom-google-inputs">
                        <input
                          type="email"
                          placeholder="Enter your Google email (e.g. name@gmail.com)"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="google-custom-input"
                          autoFocus
                          required
                        />
                        <input
                          type="text"
                          placeholder="Your display name (optional)"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="google-custom-input"
                        />
                      </div>
                      <div className="custom-google-actions">
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => setIsCustomGoogleInput(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Continue
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="google-modal-footer-notice">
                  <span>
                    To continue, Google will share your name, email address, language
                    preference, and profile picture with{' '}
                    <strong>Aereo Learning Institute</strong>.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .login-split-page {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background-color: #f1f5fa;
          overflow-x: hidden;
          position: relative;
        }

        /* Left Hero Column with Vector Typography */
        .login-hero-column {
          flex: 1.15;
          min-height: 100vh;
          position: relative;
          background: radial-gradient(circle at 10% 20%, #0d2252 0%, #081734 65%);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 3rem 0 3.25rem;
          color: #ffffff;
        }

        /* Hero Content Cluster */
        .hero-content-cluster {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          max-width: 580px;
        }

        /* Top Brand Row */
        .hero-brand-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .hero-emblem-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #0d1b3e;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }
        .hero-brand-text {
          display: flex;
          flex-direction: column;
        }
        .hero-brand-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }
        .hero-brand-subtitle {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.3;
        }

        /* Headline Block */
        .hero-headline-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .hero-main-title {
          display: flex;
          flex-direction: column;
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.8px;
        }
        .title-line-1 {
          color: #ffffff;
        }
        .title-line-2 {
          background: linear-gradient(135deg, #00f0ff 0%, #b388ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 25px rgba(179, 136, 255, 0.45));
        }
        .hero-main-desc {
          font-size: 0.96rem;
          color: #94a3b8;
          line-height: 1.5;
          max-width: 480px;
        }

        /* Features Horizontal Row */
        .hero-features-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .hero-feature-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .feature-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }
        .bg-blue { background: #2563eb; }
        .bg-purple { background: #7c3aed; }
        .bg-green { background: #059669; }
        .feature-text-block {
          display: flex;
          flex-direction: column;
        }
        .feature-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }
        .feature-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          line-height: 1.2;
        }

        /* Lower Artwork & Doodle Area */
        .hero-artwork-area {
          position: relative;
          margin-top: auto;
          width: 100%;
        }

        /* Floating Handwritten Doodle Callout */
        .journey-callout-doodle {
          position: absolute;
          top: -30px;
          right: 40px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transform: rotate(-4deg);
          user-select: none;
        }
        .journey-star {
          font-size: 1.2rem;
          color: #60a5fa;
          font-weight: 700;
        }
        .journey-text-lines {
          font-family: 'Caveat', 'Segoe Print', cursive, sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #93c5fd;
          line-height: 1.1;
          display: flex;
          flex-direction: column;
        }
        .journey-curved-arrow {
          margin-left: 2px;
          margin-top: 10px;
        }

        /* HD Desk Image Container */
        .desk-image-container {
          position: relative;
          width: 100%;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          overflow: hidden;
        }
        .desk-hd-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          image-rendering: -webkit-optimize-contrast;
          filter: contrast(1.03) brightness(1.02);
        }
        .desk-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, #081734 0%, transparent 100%);
          pointer-events: none;
        }

        /* Fluid Edge Divider */
        .hero-wave-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          right: -1px;
          width: 45px;
          height: 100%;
          z-index: 15;
          pointer-events: none;
        }

        /* Right Form Canvas Column */
        .login-form-column {
          flex: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          position: relative;
          background: radial-gradient(circle at 85% 15%, rgba(191, 219, 254, 0.45) 0%, transparent 45%),
                      radial-gradient(circle at 95% 95%, rgba(219, 234, 254, 0.5) 0%, transparent 45%),
                      #f1f5fa;
        }

        /* Top Right Skills Floating Text */
        .floating-skills-badge {
          position: absolute;
          top: 2rem;
          right: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          transform: rotate(3deg);
          user-select: none;
        }
        .skills-line-1, .skills-line-2, .skills-line-3 {
          font-family: 'Caveat', 'Segoe Print', cursive, sans-serif;
          font-weight: 700;
          color: #1e3a8a;
          line-height: 1.05;
          letter-spacing: -0.3px;
        }
        .skills-line-1 { font-size: 1.35rem; }
        .skills-line-2 { font-size: 1.25rem; }
        .skills-line-3 { font-size: 1.45rem; }
        .skills-underline {
          margin-top: 1px;
        }

        /* Bottom Right Dot Matrix */
        .bottom-dot-matrix {
          position: absolute;
          bottom: 2rem;
          right: 2.5rem;
          display: grid;
          grid-template-columns: repeat(3, 8px);
          grid-gap: 12px;
          opacity: 0.35;
          user-select: none;
        }
        .matrix-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
        }

        /* White Center Card */
        .login-main-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 20px;
          padding: 2.25rem 2.25rem;
          box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.9);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          position: relative;
          z-index: 10;
        }

        /* Brand Emblem Header */
        .card-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
        }
        .card-badge-emblem {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #0d1b3e;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(13, 27, 62, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .card-brand-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.3px;
          margin-top: 0.25rem;
        }
        .card-brand-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.3;
        }

        /* Dual Tabs */
        .card-tab-nav {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-top: 0.25rem;
        }
        .tab-toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.65rem 0.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.88rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-toggle-btn.active {
          color: #2563eb;
          font-weight: 700;
          border-bottom-color: #2563eb;
        }
        .tab-toggle-btn:hover:not(.active) {
          color: #1e293b;
        }

        /* Error Notification Banner */
        .card-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 0.6rem 0.85rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* Form Structure */
        .card-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }
        .card-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .card-input-label {
          font-size: 0.84rem;
          font-weight: 600;
          color: #1e293b;
        }
        .card-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .card-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #94a3b8;
          pointer-events: none;
        }
        .card-text-input {
          width: 100%;
          padding: 0.75rem 0.85rem 0.75rem 2.45rem;
          font-size: 0.9rem;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          transition: all 0.2s ease;
        }
        .card-text-input:focus {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }
        .password-input {
          padding-right: 2.5rem;
        }
        .card-eye-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .card-eye-btn:hover {
          color: #475569;
        }

        /* Submit Action Button */
        .card-submit-button {
          margin-top: 0.4rem;
          background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 0.82rem 1.25rem;
          font-size: 0.92rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          transition: all 0.2s ease;
        }
        .card-submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
        }
        .card-submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* OR Divider */
        .card-divider-row {
          display: flex;
          align-items: center;
          margin: 0.15rem 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .divider-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          padding: 0 0.85rem;
          letter-spacing: 0.5px;
        }

        /* Google Social Button */
        .card-google-button {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .card-google-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Trust Footer */
        .card-trust-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .text-emerald {
          color: #10b981;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .login-hero-column {
            display: none;
          }
          .login-form-column {
            flex: 1;
            padding: 2rem 1rem;
          }
        }

        /* Google OAuth Modal Styles */
        .google-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
          animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .google-oauth-modal {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(12px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .google-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .google-brand-header-flex {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .google-modal-titles {
          display: flex;
          flex-direction: column;
        }

        .google-modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.25;
        }

        .google-modal-subtitle {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
        }

        .google-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .google-close-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .google-accounts-list {
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 380px;
          overflow-y: auto;
        }

        .google-account-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.85rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }

        .google-account-card:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .google-account-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .avatar-blue { background: #2563eb; }
        .avatar-emerald { background: #059669; }
        .avatar-gray { background: #f1f5f9; color: #64748b; }

        .google-account-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .google-user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.25;
        }

        .google-user-email {
          font-size: 0.78rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .google-account-tag {
          font-size: 0.68rem;
          font-weight: 600;
          color: #2563eb;
          background: #eff6ff;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
        }

        .add-account-card {
          border-top: 1px solid #f1f5f9;
          margin-top: 0.25rem;
          padding-top: 0.85rem;
        }

        .custom-google-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 0.75rem 0.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .custom-google-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .google-custom-input {
          padding: 0.65rem 0.85rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
        }

        .google-custom-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .custom-google-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .google-modal-footer-notice {
          padding: 0.85rem 1.5rem 1.25rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.4;
        }

        .google-loading-state {
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .google-spinner {
          width: 36px;
          height: 36px;
          border: 3.5px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
