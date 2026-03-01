import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Loader2, Check, AlertCircle, Sparkles, Database } from 'lucide-react';

const DEMO_PASSWORD = 'demo1234';

const DEMO_USERS = [
  {
    email: 'looper@demo.com',
    name: 'Maria G.',
    role: 'Looper',
    isVerified: false,
    tags: ['volunteer', 'tutoring', 'humboldt-park'],
    starRating: 4.8,
    verifiedHours: 24,
    loopCredits: 18,
  },
  {
    email: 'looper2@demo.com',
    name: 'Darius W.',
    role: 'Looper',
    isVerified: false,
    tags: ['cleanup', 'garfield-park', 'community'],
    starRating: 4.5,
    verifiedHours: 10,
    loopCredits: 7,
  },
  {
    email: 'inner@demo.com',
    name: 'Pilsen Community Center',
    role: 'Inner',
    isVerified: true,
    tags: ['pilsen', 'volunteer', 'youth'],
    starRating: 4.9,
    verifiedHours: 156,
    loopCredits: 0,
  },
  {
    email: 'inner2@demo.com',
    name: 'Logan Square Food Pantry',
    role: 'Inner',
    isVerified: true,
    tags: ['logan-square', 'food', 'seniors', 'delivery'],
    starRating: 4.7,
    verifiedHours: 89,
    loopCredits: 0,
  },
];

const DEMO_POSTS = [
  {
    authorIndex: 2, // inner@demo.com
    content: 'Looking for 3 volunteers to help sort donated winter coats this Saturday 🧤 Meet at the center at 9am. We provide gloves and snacks!',
    tags: ['volunteer', 'pilsen', 'donation'],
    taskCapacity: 3,
    taskFilled: 2,
    hoursReward: 2,
    isInnerOnly: false,
    minutesAgo: 15,
  },
  {
    authorIndex: 0, // looper@demo.com
    content: 'Does anyone know a good after-school tutoring program near Humboldt Park? My son needs help with math. Any recommendations appreciated! 🙏',
    tags: ['tutoring', 'humboldt-park', 'education'],
    taskCapacity: null,
    taskFilled: null,
    hoursReward: null,
    isInnerOnly: false,
    minutesAgo: 45,
  },
  {
    authorIndex: 3, // inner2@demo.com
    content: 'URGENT: We need 5 drivers to deliver meal kits to seniors in the 60647 zip code this Thursday morning. Each route takes about 1.5 hours. Gas reimbursement available.',
    tags: ['delivery', 'logan-square', 'seniors', 'urgent'],
    taskCapacity: 5,
    taskFilled: 5,
    hoursReward: 1.5,
    isInnerOnly: false,
    minutesAgo: 120,
  },
  {
    authorIndex: 1, // looper2@demo.com
    content: 'Just finished 10 hours volunteering at the Garfield Park Conservatory cleanup! Feeling good about giving back to the neighborhood. If anyone wants to join next month, keep an eye on the feed 🌿',
    tags: ['garfield-park', 'cleanup', 'community'],
    taskCapacity: null,
    taskFilled: null,
    hoursReward: null,
    isInnerOnly: false,
    minutesAgo: 200,
  },
  {
    authorIndex: 2, // inner@demo.com
    content: 'Free youth basketball clinic this weekend at Dvorak Park! Ages 8-14. We need 2 volunteers to help coach. No experience necessary — just energy and patience 🏀',
    tags: ['youth', 'sports', 'pilsen', 'volunteer'],
    taskCapacity: 2,
    taskFilled: 0,
    hoursReward: 3,
    isInnerOnly: false,
    minutesAgo: 300,
  },
  {
    authorIndex: 3, // inner2@demo.com
    content: 'We have extra canned goods and dry pasta available for any community org that needs them. DM us to arrange pickup this week.',
    tags: ['resources', 'food', 'logan-square'],
    taskCapacity: null,
    taskFilled: null,
    hoursReward: null,
    isInnerOnly: true, // Inner Loop only
    minutesAgo: 400,
  },
  {
    authorIndex: 0, // looper@demo.com
    content: 'Shoutout to Pilsen Community Center for the amazing coat drive! Got my kids warm jackets and met so many great neighbors. This is what InnerLoop is about ❤️',
    tags: ['pilsen', 'gratitude', 'community'],
    taskCapacity: null,
    taskFilled: null,
    hoursReward: null,
    isInnerOnly: false,
    minutesAgo: 500,
  },
];

export default function SeedPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function log(msg, type = 'info') {
    setStatus(prev => [...prev, { msg, type }]);
  }

  async function runSeed() {
    setRunning(true);
    setStatus([]);
    const userUIDs = {};

    // Step 1: Create demo accounts
    log('Creating demo accounts...', 'info');
    for (const u of DEMO_USERS) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
        userUIDs[u.email] = cred.user.uid;

        await setDoc(doc(db, 'users', cred.user.uid), {
          name: u.name,
          role: u.role,
          isVerified: u.isVerified,
          tags: u.tags,
          starRating: u.starRating,
          verifiedHours: u.verifiedHours,
          loopCredits: u.loopCredits,
          ageVerification: false,
          location: null,
          createdAt: serverTimestamp(),
        });

        log(`✓ Created ${u.email} (${u.name})`, 'success');
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          // Account exists — sign in to get UID
          try {
            const cred = await signInWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
            userUIDs[u.email] = cred.user.uid;
            log(`• ${u.email} already exists — using existing`, 'info');
          } catch (e) {
            log(`✗ ${u.email} — login failed: ${e.message}`, 'error');
          }
        } else {
          log(`✗ ${u.email} — ${err.message}`, 'error');
        }
      }
    }

    // Sign out so we're clean
    await signOut(auth).catch(() => {});

    // Step 2: Create demo posts
    log('', 'info');
    log('Creating demo posts...', 'info');
    for (const p of DEMO_POSTS) {
      try {
        const author = DEMO_USERS[p.authorIndex];
        const authorUID = userUIDs[author.email];
        if (!authorUID) {
          log(`✗ Skipping post — no UID for ${author.email}`, 'error');
          continue;
        }

        const postTime = new Date(Date.now() - p.minutesAgo * 60 * 1000);

        await addDoc(collection(db, 'posts'), {
          authorID: authorUID,
          authorName: author.name,
          authorRole: author.role,
          content: p.content,
          tags: p.tags,
          postTime: Timestamp.fromDate(postTime),
          isInnerOnly: p.isInnerOnly,
          taskCapacity: p.taskCapacity,
          taskFilled: p.taskFilled,
          waitlist: p.taskCapacity && p.taskFilled >= p.taskCapacity ? [userUIDs['looper2@demo.com']].filter(Boolean) : [],
          joinedUsers: [],
          hoursReward: p.hoursReward,
          location: null,
        });

        const preview = p.content.slice(0, 50) + '...';
        log(`✓ Post: "${preview}"`, 'success');
      } catch (err) {
        log(`✗ Post failed: ${err.message}`, 'error');
      }
    }

    // Step 3: Create a demo review
    log('', 'info');
    log('Creating demo reviews...', 'info');
    try {
      const reviewerUID = userUIDs['inner@demo.com'];
      const reviewedUID = userUIDs['looper@demo.com'];
      if (reviewerUID && reviewedUID) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: reviewerUID,
          reviewedID: reviewedUID,
          rating: 5,
          hoursVerified: 2,
          comment: 'Maria was incredible — arrived early, organized everything, and stayed to help clean up. A true community asset!',
          wasWaitlisted: false,
          createdAt: serverTimestamp(),
        });
        log('✓ Review: Pilsen CC → Maria G. (5 stars)', 'success');

        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner2@demo.com'],
          reviewedID: userUIDs['looper2@demo.com'],
          rating: 4,
          hoursVerified: 3,
          comment: 'Darius was reliable and handled the delivery route efficiently. Would welcome back anytime.',
          wasWaitlisted: true,
          createdAt: serverTimestamp(),
        });
        log('✓ Review: Logan Sq → Darius W. (4 stars, waitlist 2×)', 'success');
      }
    } catch (err) {
      log(`✗ Review failed: ${err.message}`, 'error');
    }

    log('', 'info');
    log('🎉 SEED COMPLETE!', 'success');
    log('', 'info');
    log('Demo accounts (password: demo1234):', 'info');
    log('  looper@demo.com  — Maria G.', 'info');
    log('  looper2@demo.com — Darius W.', 'info');
    log('  inner@demo.com   — Pilsen Community Center', 'info');
    log('  inner2@demo.com  — Logan Square Food Pantry', 'info');

    setDone(true);
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-loop-gray flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </span>
          <p className="text-sm text-loop-green/40 mt-1">Demo Data Seed</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-loop-gray/50 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-loop-purple/10 flex items-center justify-center">
                <Database size={22} className="text-loop-purple" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Seed Demo Data</h2>
                <p className="text-xs text-loop-green/40">Creates 4 accounts, 7 posts, 2 reviews</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-loop-blue/10 border border-loop-blue/15 text-sm text-loop-green/60 space-y-1">
              <p className="font-semibold text-loop-green/80">Demo accounts (password: demo1234)</p>
              <p>• <strong>looper@demo.com</strong> — Maria G. (Looper)</p>
              <p>• <strong>looper2@demo.com</strong> — Darius W. (Looper)</p>
              <p>• <strong>inner@demo.com</strong> — Pilsen Community Center (Inner ✓)</p>
              <p>• <strong>inner2@demo.com</strong> — Logan Square Food Pantry (Inner ✓)</p>
            </div>

            {!done ? (
              <button
                onClick={runSeed}
                disabled={running}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all
                  ${running ? 'bg-loop-purple/60 cursor-not-allowed' : 'bg-loop-purple hover:shadow-lg hover:scale-[1.02]'}`}
              >
                {running ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {running ? 'Seeding...' : 'Run Seed'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-loop-green font-semibold text-sm text-white hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <Check size={18} /> Go to Login
              </button>
            )}
          </div>

          {/* Log output */}
          {status.length > 0 && (
            <div className="border-t border-loop-gray/30 px-6 py-4 max-h-64 overflow-y-auto">
              <div className="space-y-1 font-mono text-xs">
                {status.map((s, i) => (
                  <p key={i} className={
                    s.type === 'success' ? 'text-green-600' :
                    s.type === 'error' ? 'text-loop-red' :
                    'text-loop-green/50'
                  }>
                    {s.msg || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
