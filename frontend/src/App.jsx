import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CreateJob } from './pages/CreateJob';
import { JobDetails } from './pages/JobDetails';
import { JobsPage } from './pages/JobsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signin', '/register', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="auth-fullscreen-layout">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs/new" element={<CreateJob />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
