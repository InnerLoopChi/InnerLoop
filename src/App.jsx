import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

// Protected route — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-loop-gray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-loop-purple/30 border-t-loop-purple rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

// Redirect authenticated users away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-loop-gray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-loop-purple/30 border-t-loop-purple rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/feed" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth (guest only) */}
      <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      {/* Protected — feed placeholder for now */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Temporary feed placeholder until we build the real feed in a future chunk
function FeedPlaceholder() {
  const { profile, logout } = useAuth();
  return (
    <div className="min-h-screen bg-loop-gray flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center space-y-6">
        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
          profile?.role === 'Inner'
            ? 'bg-gradient-to-br from-loop-purple/20 to-loop-purple/5'
            : 'bg-gradient-to-br from-loop-red/20 to-loop-red/5'
        }`}>
          <span className="text-2xl">{profile?.role === 'Inner' ? '🏢' : '❤️'}</span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">
            Welcome, {profile?.name || 'User'}!
          </h1>
          <p className="text-sm text-loop-green/50 mt-1">
            {profile?.role === 'Inner' ? 'Inner Account' : 'Looper Account'}
            {profile?.isVerified && ' · Verified ✓'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-loop-gray/60">
            <p className="text-lg font-bold">{profile?.starRating ?? '—'}</p>
            <p className="text-xs text-loop-green/50">Stars</p>
          </div>
          <div className="p-3 rounded-xl bg-loop-gray/60">
            <p className="text-lg font-bold">{profile?.verifiedHours ?? 0}</p>
            <p className="text-xs text-loop-green/50">Hours</p>
          </div>
          <div className="p-3 rounded-xl bg-loop-gray/60">
            <p className="text-lg font-bold">{profile?.loopCredits ?? 0}</p>
            <p className="text-xs text-loop-green/50">Credits</p>
          </div>
        </div>
        <p className="text-sm text-loop-green/40">
          The local feed is coming soon. You're in the Loop! 🎉
        </p>
        <button
          onClick={logout}
          className="text-sm font-semibold text-loop-red hover:underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
