import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Mail } from 'lucide-react';

const EmailVerification = ({ token, onNavigate }) => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('waitlist')
          .update({ verified: true, verified_at: new Date().toISOString() })
          .eq('verification_token', token)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setStatus('success');
          setMessage('🎉 Email verified successfully! You\'re all set for early access.');
        } else {
          setStatus('error');
          setMessage('Invalid or expired verification link.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong during verification.');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          {status === 'success' ? <Mail className="w-8 h-8 text-white" /> : <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>}
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">{status === 'success' ? 'Verified!' : 'Verifying...'}</h1>
        <p className="text-white/80 mb-6">{message}</p>
        <button onClick={() => onNavigate('landing')} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg">
          Back to TouchPlay
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;