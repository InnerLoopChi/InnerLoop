import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Heart,
  Building2,
  Shield,
  Zap,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'looper@demo.com', password: 'demo1234', name: 'Maria G.', role: 'Looper', desc: 'Active volunteer, 24 hrs', color: 'loop-red', icon: Heart },
  { email: 'looper2@demo.com', password: 'demo1234', name: 'Darius W.', role: 'Looper', desc: 'Community helper, 10 hrs', color: 'loop-red', icon: Heart },
  { email: 'inner@demo.com', password: 'demo1234', name: 'Pilsen Community Center', role: 'Inner ✓', desc: 'Verified org, posts tasks', color: 'loop-purple', icon: Building2 },
  { email: 'inner2@demo.com', password: 'demo1234', name: 'Logan Square Food Pantry', role: 'Inner ✓', desc: 'Verified org, DMs enabled', color: 'loop-purple', icon: Building2 },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login({ email, password });
      navigate('/feed');
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(account, index) {
    setError('');
    setDemoLoading(index);
    try {
      await login({ email: account.email, password: account.password });
      navigate('/feed');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Demo account not found. Visit /seed first to create demo data.');
      } else {
        setError(err.message || 'Demo login failed.');
      }
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-loop-gray relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-loop-purple/20 to-loop-blue/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-tr from-loop-red/15 to-loop-purple/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="font-display text-2xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-loop-gray/50 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-sm text-loop-green/50">Sign in to your InnerLoop account</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-loop-red/10 border border-loop-red/20 flex items-start gap-3">
              <AlertCircle size={18} className="text-loop-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-loop-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-loop-gray bg-loop-gray/30
                  text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                  focus:ring-loop-purple/30 focus:border-loop-purple/30 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-loop-gray bg-loop-gray/30
                    text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                    focus:ring-loop-purple/30 focus:border-loop-purple/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-loop-green/30 hover:text-loop-green/60 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full
                bg-loop-green font-semibold text-sm text-white transition-all duration-300
                hover:shadow-lg hover:shadow-loop-green/20
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Quick Login */}
        <div className="mt-6 bg-white rounded-3xl shadow-sm border border-loop-gray/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-loop-purple" />
            <h3 className="font-display text-sm font-bold">Quick Demo Login</h3>
            <span className="text-xs text-loop-green/30">— one click</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acct, i) => {
              const Icon = acct.icon;
              return (
                <button
                  key={acct.email}
                  onClick={() => handleDemoLogin(acct, i)}
                  disabled={demoLoading !== null}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                    demoLoading === i 
                      ? 'border-loop-purple/30 bg-loop-purple/5' 
                      : 'border-loop-gray/50 hover:border-loop-purple/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      acct.role.includes('Inner') ? 'bg-loop-purple/15' : 'bg-loop-red/15'
                    }`}>
                      {demoLoading === i 
                        ? <Loader2 size={12} className="animate-spin text-loop-purple" />
                        : <Icon size={12} className={acct.role.includes('Inner') ? 'text-loop-purple' : 'text-loop-red'} />
                      }
                    </div>
                    <span className="text-xs font-semibold truncate">{acct.name}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-9">
                    <span className={`text-[10px] font-medium ${acct.role.includes('Inner') ? 'text-loop-purple' : 'text-loop-red'}`}>
                      {acct.role}
                    </span>
                    <span className="text-[10px] text-loop-green/30">· {acct.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-loop-green/30 text-center mt-3">
            No demo accounts? <Link to="/seed" className="text-loop-purple font-semibold hover:underline">Seed demo data first</Link>
          </p>
        </div>

        <p className="text-center text-sm text-loop-green/40 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-loop-purple hover:underline">
            Join the Loop
          </Link>
        </p>
      </div>
    </div>
  );
}
