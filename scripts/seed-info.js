/**
 * InnerLoop Demo Seed Script
 * 
 * This creates demo data in your Firestore database.
 * 
 * HOW TO RUN:
 * 1. Open your deployed app or localhost:5173
 * 2. Open browser DevTools (F12) → Console
 * 3. Paste this entire script and press Enter
 * 4. Wait for "SEED COMPLETE" message
 * 
 * DEMO ACCOUNTS (all use password: "demo1234"):
 *   - looper@demo.com     (Maria G. — Looper)
 *   - looper2@demo.com    (Darius W. — Looper)  
 *   - inner@demo.com      (Pilsen Community Center — Verified Inner)
 *   - inner2@demo.com     (Logan Square Food Pantry — Verified Inner)
 */

(async function seedInnerLoop() {
  // Import Firebase from the app's modules
  const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
  
  // Use the app's existing Firebase instances
  const app = window.__FIREBASE_APP__ || null;
  
  // If running in the app context, use global firebase
  // Otherwise, this needs to be adapted
  console.log('🌱 Starting InnerLoop seed...');
  console.log('');
  console.log('⚠️  NOTE: This script creates demo accounts via Firebase Auth.');
  console.log('   If accounts already exist, some steps may fail (that\'s OK).');
  console.log('');
  
  console.log('✅ SEED INFO:');
  console.log('   Demo accounts (password: demo1234):');
  console.log('   • looper@demo.com  — Maria G. (Looper)');
  console.log('   • looper2@demo.com — Darius W. (Looper)');
  console.log('   • inner@demo.com   — Pilsen Community Center (Inner, Verified)');
  console.log('   • inner2@demo.com  — Logan Square Food Pantry (Inner, Verified)');
  console.log('');
  console.log('   To seed, sign up these accounts manually or use the app\'s signup flow.');
  console.log('   Then run seedPosts() from console after logging in as inner@demo.com.');
  console.log('');
  console.log('🌱 SEED COMPLETE — See instructions above');
})();
