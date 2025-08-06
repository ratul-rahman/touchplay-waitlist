import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { calculateAnalytics } from '../utils/analytics';
import { Mail, Users, MapPin, ExternalLink, Download, Trash2, BarChart3, PieChart, Shield, TrendingUp } from 'lucide-react';

const AdminDashboard = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [waitlistData, setWaitlistData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@touchplay.ai' && loginForm.password === 'touchplay2024') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid credentials');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setWaitlistData(data || []);
      setAnalytics(calculateAnalytics(data || []));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Verified', 'Country', 'City', 'UTM Source', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...waitlistData.map(item => [item.email, item.verified, item.country, item.city, item.utm_source, item.created_at].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'waitlist.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('waitlist').delete().eq('id', id);
      if (error) throw error;
      fetchData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">TouchPlay Intel</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Admin email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
            <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-lg">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">TouchPlay Intel</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={exportToCSV} className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-lg"><Download className="w-4 h-4" /><span>Export CSV</span></button>
                    <button onClick={() => onNavigate('landing')} className="text-gray-400 hover:text-white">← Back to Landing</button>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
            {loading ? <div className="text-center">Loading...</div> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg p-6"><p className="text-gray-400 text-sm">Total Signups</p><p className="text-3xl font-bold">{analytics.total}</p></div>
                        <div className="bg-gray-800 rounded-lg p-6"><p className="text-gray-400 text-sm">Verified</p><p className="text-3xl font-bold text-green-400">{analytics.verified}</p></div>
                        <div className="bg-gray-800 rounded-lg p-6"><p className="text-gray-400 text-sm">Verification Rate</p><p className="text-3xl font-bold text-blue-400">{analytics.verificationRate}%</p></div>
                        <div className="bg-gray-800 rounded-lg p-6"><p className="text-gray-400 text-sm">Countries</p><p className="text-3xl font-bold text-yellow-400">{analytics.countries?.length}</p></div>
                    </div>
                    <div className="overflow-x-auto bg-gray-800 rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Location</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th></tr></thead>
                            <tbody className="divide-y divide-gray-700">
                                {waitlistData.map(entry => (
                                    <tr key={entry.id}>
                                        <td className="px-6 py-4">{entry.email}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${entry.verified ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{entry.verified ? 'Verified' : 'Pending'}</span></td>
                                        <td className="px-6 py-4">{entry.city}, {entry.country}</td>
                                        <td className="px-6 py-4">{new Date(entry.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><button onClick={() => setDeleteConfirm(entry.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
        {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                    <p className="mb-6">Are you sure you want to delete this entry?</p>
                    <div className="flex space-x-4">
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-600 py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 py-2 px-4 rounded-lg">Delete</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;