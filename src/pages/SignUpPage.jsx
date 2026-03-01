import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  Building2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [step, setStep] = useState(1);        // 1 = role select, 2 = form
  const [role, setRole] = useState('');        // "Looper" or "Inner"
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function selectRole(r) {
    setRole(r);
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    try {
      setLoading(true);
      await signup({ email, password, name: name.trim(), role });
      navigate('/feed');
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setError('This email is already registered.');
      else if (code === 'auth/invalid-email') setError('Please enter a valid email.');
      else if (code === 'auth/weak-password') setError('Password is too weak.');
      else setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-loop-gray relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-loop-blue/30 to-loop-purple/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-loop-red/20 to-loop-purple/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="font-display text-2xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </span>
        </Link>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h1 className="font-display text-3xl font-bold">Join the Loop</h1>
              <p className="text-sm text-loop-green/50">Choose how you want to participate</p>
            </div>

            <div className="space-y-4">
              {/* Looper option */}
              <button
                onClick={() => selectRole('Looper')}
                className="group w-full rounded-2xl bg-white border-2 border-transparent hover:border-loop-red/30
                  p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-loop-red/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-loop-red/20 to-loop-red/5
                    flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={24} className="text-loop-red" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      Looper
                      <ArrowRight size={16} className="text-loop-green/30 group-hover:text-loop-red group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-loop-green/50">Personal account — give & receive help</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-loop-green/40 leading-relaxed">
                  Browse tasks, earn verified hours & Loop Credits, build your Star Rating.
                </p>
              </button>

              {/* Inner option */}
              <button
                onClick={() => selectRole('Inner')}
                className="group w-full rounded-2xl bg-white border-2 border-transparent hover:border-loop-purple/30
                  p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-loop-purple/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-loop-purple/20 to-loop-purple/5
                    flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 size={24} className="text-loop-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      Inner
                      <ArrowRight size={16} className="text-loop-green/30 group-hover:text-loop-purple group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-loop-green/50">Organization account — post tasks & verify</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-loop-green/40 leading-relaxed">
                  Post tasks, manage capacity, verify hours, access the Inner Loop.
                </p>
              </button>
            </div>

            <p className="text-center text-sm text-loop-green/40">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-loop-purple hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-xl border border-loop-gray/50 p-8">
              {/* Back button + header */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-loop-green/50 hover:text-loop-green transition-colors mb-6"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  role === 'Inner'
                    ? 'bg-gradient-to-br from-loop-purple/20 to-loop-purple/5'
                    : 'bg-gradient-to-br from-loop-red/20 to-loop-red/5'
                }`}>
                  {role === 'Inner'
                    ? <Building2 size={20} className="text-loop-purple" />
                    : <Heart size={20} className="text-loop-red" />
                  }
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Create your {role} account</h2>
                  <p className="text-xs text-loop-green/40">
                    {role === 'Inner' ? 'For organizations & businesses' : 'For everyday community members'}
                  </p>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-loop-red/10 border border-loop-red/20 flex items-start gap-3">
                  <AlertCircle size={18} className="text-loop-red flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-loop-red">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {role === 'Inner' ? 'Organization Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'Inner' ? 'Pilsen Community Center' : 'Jane Doe'}
                    className="w-full px-4 py-3 rounded-xl border border-loop-gray bg-loop-gray/30
                      text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                      focus:ring-loop-purple/30 focus:border-loop-purple/30 transition-all"
                    required
                  />
                </div>

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
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-loop-gray bg-loop-gray/30
                        text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                        focus:ring-loop-purple/30 focus:border-loop-purple/30 transition-all"
                      required
                      minLength={6}
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
                    font-semibold text-sm text-white transition-all duration-300
                    ${role === 'Inner'
                      ? 'bg-loop-purple hover:shadow-lg hover:shadow-loop-purple/20'
                      : 'bg-loop-green hover:shadow-lg hover:shadow-loop-green/20'
                    }
                    ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Inner verification note */}
              {role === 'Inner' && (
                <div className="mt-6 p-4 rounded-xl bg-loop-purple/5 border border-loop-purple/10">
                  <p className="text-xs text-loop-green/50 leading-relaxed">
                    <strong className="text-loop-purple">Note:</strong> Inner accounts require verification.
                    After signup, our team will review your organization before granting full Inner access.
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-sm text-loop-green/40 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-loop-purple hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
