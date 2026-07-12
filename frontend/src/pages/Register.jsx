import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaTruck, FaUserCog } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({ name, email, password, role });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl shadow-lg mb-4">
            <FaTruck className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TransitOps</h1>
          <p className="text-indigo-200/80 mt-1">Get Started</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-indigo-300/70" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-indigo-300/70" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-300/70" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCog className="text-indigo-300/70" />
                </div>
                <select
                  id="role"
                  className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="driver">Driver</option>
                  <option value="fleet_manager">Fleet Manager</option>
                  <option value="safety_officer">Safety Officer</option>
                  <option value="financial_analyst">Financial Analyst</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-2 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-2 rounded-xl text-sm text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
              ) : (
                <>
                  <FiUserPlus /> Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-indigo-200/70">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline hover:text-indigo-200 transition">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-indigo-200/40 text-xs mt-6">
          &copy; 2026 TransitOps. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;