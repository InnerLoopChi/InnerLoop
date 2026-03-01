import React from 'react';

export default function FirebaseSetup() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#e8e6e6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'DM Sans', sans-serif",
      color: '#0a3200',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: 40,
        maxWidth: 520,
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800 }}>
            Inner<span style={{
              background: 'linear-gradient(135deg, #8B6897, #f18989)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Loop</span>
          </span>
        </div>

        <div style={{
          width: 56, height: 56, margin: '0 auto 24px',
          borderRadius: 16, background: '#8B68971a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          🔧
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Firebase Not Configured
        </h1>

        <p style={{
          fontSize: 14,
          textAlign: 'center',
          opacity: 0.5,
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          InnerLoop needs a Firebase project to work. Follow the steps below to set it up.
        </p>

        <div style={{
          background: '#f8f8f7',
          borderRadius: 16,
          padding: 24,
          fontSize: 14,
          lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Quick Setup (3 minutes):</p>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener" style={{ color: '#8B6897', fontWeight: 600 }}>Firebase Console</a></li>
            <li>Create a project → Add a Web app</li>
            <li>Enable <strong>Email/Password</strong> auth</li>
            <li>Create <strong>Firestore Database</strong> (test mode)</li>
            <li>Copy your config values</li>
          </ol>

          <div style={{
            marginTop: 20,
            padding: 16,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e8e6e6',
            fontSize: 13,
            fontFamily: 'monospace',
          }}>
            <p style={{ fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
              If running locally:
            </p>
            <p>Add to <code>.env</code> file:</p>
            <pre style={{ margin: '8px 0 0', opacity: 0.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
            </pre>
          </div>

          <div style={{
            marginTop: 16,
            padding: 16,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e8e6e6',
            fontSize: 13,
            fontFamily: 'monospace',
          }}>
            <p style={{ fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
              If hosting on GitHub Pages:
            </p>
            <p>Add as <strong>Repository Secrets</strong> in:</p>
            <p style={{ opacity: 0.6, wordBreak: 'break-all' }}>
              Settings → Secrets → Actions
            </p>
          </div>
        </div>

        <p style={{
          fontSize: 12,
          textAlign: 'center',
          opacity: 0.3,
          marginTop: 24,
        }}>
          Once configured, refresh this page.
        </p>
      </div>
    </div>
  );
}
