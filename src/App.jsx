// touchplay-waitlist/src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import EmailVerification from './components/EmailVerification';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [verificationToken, setVerificationToken] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (path === '/intel') {
      setCurrentPage('intel');
    } else if (token) {
      setVerificationToken(token);
      setCurrentPage('verify');
    } else {
      setCurrentPage('landing');
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'landing' ? '/' : `/${page}`);
  };

  return (
    <div className="font-sans antialiased">
      {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentPage === 'intel' && <AdminDashboard onNavigate={navigate} />}
      {currentPage === 'verify' && <EmailVerification token={verificationToken} onNavigate={navigate} />}
    </div>
  );
};

export default App;