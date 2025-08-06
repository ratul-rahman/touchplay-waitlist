import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { checkRateLimit } from '../utils/rateLimiter';
import { sendWelcomeEmail } from '../utils/emailService';
import { getClientInfo } from '../utils/clientInfo';
import { Mail, Play, Zap, TrendingUp, Shield } from 'lucide-react';


const LandingPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content')
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;

    if (!checkRateLimit(email || 'anonymous')) {
      setMessage('Too many requests. Please try again in a minute.');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const clientInfo = await getClientInfo();
      const utmParams = getUTMParams();
      const verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const { error } = await supabase.from('waitlist').insert({
        email: email.toLowerCase().trim(),
        verification_token: verificationToken,
        ip_address: clientInfo.ip,
        country: clientInfo.country,
        city: clientInfo.city,
        ...utmParams,
        referrer: document.referrer,
        user_agent: navigator.userAgent
      });
      
      if (error) {
        if (error.code === '23505') {
          setMessage('You\'re already on the waitlist! Check your email for verification.');
          setMessageType('info');
        } else {
          throw error;
        }
      } else {
        const emailSent = await sendWelcomeEmail(email, verificationToken);
        if (emailSent) {
          setMessage('🎉 Welcome aboard! Check your email to verify and secure your early access.');
          setMessageType('success');
          setEmail('');
        } else {
          setMessage('Added to waitlist, but failed to send verification email. Contact support.');
          setMessageType('warning');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };


return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <nav className="relative z-10 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">TouchPlay</span>
            </div>
            {/* <button onClick={() => onNavigate('intel')} className="text-white/70 hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
            </button> */}
        </nav>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
            <div className="text-center mb-16">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                    <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-white/90 text-sm font-medium">The "Lovable" of Playable Ads</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    AI-Native Platform for
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> High-ROI</span>
                    <br />Playable Ads
                </h1>
                <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Prompt. Attach gameplay video. Generate stunning playable ads instantly. Slash costs and development time while maximizing engagement for mobile game marketers.
                </p>
            </div>
            
            <div className="max-w-md mx-auto mb-16">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email for early access"
                            required
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <input
                            type="text"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading || !email} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2">
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                <span>Join the Waitlist</span>
                            </>
                        )}
                    </button>
                </form>
                
                {message && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        messageType === 'success' ? 'bg-green-500/20 text-green-100 border border-green-500/30' :
                        messageType === 'error' ? 'bg-red-500/20 text-red-100 border border-red-500/30' :
                        messageType === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default LandingPage;