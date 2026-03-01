import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import ReviewModal from '../components/ReviewModal';
import {
  ArrowLeft,
  Users,
  Clock,
  Check,
  CheckCircle2,
  Zap,
  AlertCircle,
  Loader2,
  Star,
  Building2,
  Heart,
  ChevronDown,
  ChevronUp,
  Shield,
  MapPin,
  Send,
} from 'lucide-react';

export default function MyTasksPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isInner = profile?.role === 'Inner';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState(null);

  // Load tasks
  useEffect(() => {
    if (!user?.uid) return;

    let q;
    if (isInner) {
      // Inners see tasks they posted
      q = query(
        collection(db, 'posts'),
        where('authorID', '==', user.uid),
        where('taskCapacity', '>', 0),
        orderBy('taskCapacity'),
        orderBy('postTime', 'desc')
      );
    } else {
      // Loopers see tasks they joined
      q = query(
        collection(db, 'posts'),
        where('joinedUsers', 'array-contains', user.uid),
        orderBy('postTime', 'desc')
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('Tasks query error:', err);
      setLoading(false);
    });

    return unsub;
  }, [user?.uid, isInner]);

  // Mark task as completed
  async function markComplete(taskId) {
    try {
      await updateDoc(doc(db, 'posts', taskId), {
        status: 'completed',
        completedAt: new Date(),
      });
    } catch (err) {
      console.error('Mark complete error:', err);
    }
  }

  // Open review for a specific user
  function openReview(userId, userName, hoursReward, wasWaitlisted) {
    setReviewTarget({ userId, userName, hoursReward, wasWaitlisted });
  }

  // Format time
  function timeAgo(ts) {
    if (!ts?.toDate) return 'recently';
    const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/feed')} className="flex items-center gap-1.5 text-sm font-medium text-loop-green/60 hover:text-loop-green transition-colors">
            <ArrowLeft size={18} /> Feed
          </button>
          <span className="font-display text-lg font-extrabold">My Tasks</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="mb-2">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            {isInner ? <Building2 size={22} className="text-loop-purple" /> : <Heart size={22} className="text-loop-red" />}
            {isInner ? 'Posted Tasks' : 'Joined Tasks'}
          </h1>
          <p className="text-sm text-loop-green/40 mt-1">
            {isInner ? 'Manage tasks you\'ve posted — mark complete and review Loopers' : 'Tasks you\'ve signed up for'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-loop-purple" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center">
              <Users size={28} className="text-loop-purple" />
            </div>
            <p className="font-display text-lg font-bold">No tasks yet</p>
            <p className="text-sm text-loop-green/40">
              {isInner ? 'Post a task from the feed to get started!' : 'Join a task from the feed to see it here.'}
            </p>
            <button onClick={() => navigate('/feed')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-green text-white text-sm font-semibold">
              Go to Feed
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isInner={isInner}
                isExpanded={expandedTask === task.id}
                onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                onMarkComplete={() => markComplete(task.id)}
                onReview={openReview}
                timeAgo={timeAgo}
                currentUserId={user?.uid}
              />
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          onClose={() => setReviewTarget(null)}
          reviewedUserID={reviewTarget.userId}
          reviewedUserName={reviewTarget.userName}
          hoursForTask={reviewTarget.hoursReward}
          wasWaitlisted={reviewTarget.wasWaitlisted}
        />
      )}
    </div>
  );
}

/* ─── Task Card Sub-component ──────────────────── */
function TaskCard({ task, isInner, isExpanded, onToggle, onMarkComplete, onReview, timeAgo, currentUserId }) {
  const [userNames, setUserNames] = useState({});
  const isComplete = task.status === 'completed';
  const isFull = (task.taskFilled || 0) >= task.taskCapacity;
  const fillPct = Math.min(100, ((task.taskFilled || 0) / task.taskCapacity) * 100);

  // Load joined user names (for Inner view)
  useEffect(() => {
    if (!isInner || !isExpanded || !task.joinedUsers?.length) return;

    const loadNames = async () => {
      const names = {};
      for (const uid of task.joinedUsers) {
        if (!userNames[uid]) {
          try {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) names[uid] = snap.data().name;
          } catch (e) {
            names[uid] = 'Unknown';
          }
        }
      }
      if (Object.keys(names).length > 0) {
        setUserNames(prev => ({ ...prev, ...names }));
      }
    };
    loadNames();
  }, [isInner, isExpanded, task.joinedUsers]);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${
      isComplete ? 'border-green-200 bg-green-50/30' : 'border-loop-gray/50'
    }`}>
      {/* Header — always visible */}
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isComplete && <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />}
              <p className="font-semibold text-sm truncate">{task.content?.slice(0, 80)}{task.content?.length > 80 ? '...' : ''}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-loop-green/40">
              <span className="flex items-center gap-1">
                <Users size={11} /> {task.taskFilled || 0}/{task.taskCapacity}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> +{task.hoursReward} hrs
              </span>
              <span>{timeAgo(task.postTime)}</span>
              {isComplete && <span className="text-green-600 font-semibold">Completed</span>}
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? <ChevronUp size={18} className="text-loop-green/30" /> : <ChevronDown size={18} className="text-loop-green/30" />}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-loop-gray rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : isFull ? 'bg-loop-red' : 'bg-gradient-to-r from-loop-purple to-loop-red'}`} style={{ width: `${fillPct}%` }} />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-loop-gray/30 pt-4">
          {/* Full content */}
          <p className="text-sm text-loop-green/70 leading-relaxed whitespace-pre-wrap">{task.content}</p>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-loop-blue/15 border border-loop-blue/15">#{t}</span>
              ))}
            </div>
          )}

          {/* Joined Users — Inner view */}
          {isInner && task.joinedUsers?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-loop-green/50 uppercase tracking-wide">
                Participants ({task.joinedUsers.length})
              </p>
              {task.joinedUsers.map((uid) => {
                const isWaitlisted = task.waitlist?.includes(uid);
                return (
                  <div key={uid} className="flex items-center justify-between p-3 rounded-xl bg-loop-gray/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-loop-red/15 flex items-center justify-center">
                        <Heart size={14} className="text-loop-red" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{userNames[uid] || 'Loading...'}</p>
                        {isWaitlisted && (
                          <p className="text-xs text-loop-red font-semibold flex items-center gap-1">
                            <Zap size={10} /> Waitlisted — 2× eligible
                          </p>
                        )}
                      </div>
                    </div>
                    {isComplete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onReview(uid, userNames[uid] || 'Looper', task.hoursReward, isWaitlisted); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-loop-purple text-white text-xs font-semibold hover:shadow-md transition-all"
                      >
                        <Star size={12} /> Review
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Waitlist — Inner view */}
          {isInner && task.waitlist?.length > 0 && (
            <div className="p-3 rounded-xl bg-loop-red/5 border border-loop-red/10">
              <p className="text-xs font-semibold text-loop-red flex items-center gap-1">
                <Zap size={12} /> {task.waitlist.length} on waitlist (2× rewards if they fill a spot)
              </p>
            </div>
          )}

          {/* Actions */}
          {isInner && !isComplete && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkComplete(); }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 hover:shadow-lg transition-all"
            >
              <CheckCircle2 size={16} /> Mark Task as Completed
            </button>
          )}

          {/* Looper view — status */}
          {!isInner && (
            <div className={`p-4 rounded-xl text-center ${isComplete ? 'bg-green-50 border border-green-200' : 'bg-loop-blue/10 border border-loop-blue/20'}`}>
              {isComplete ? (
                <p className="text-sm font-semibold text-green-700 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Task completed — review incoming!
                </p>
              ) : (
                <p className="text-sm text-loop-green/50">
                  You're signed up for this task. The organizer will mark it complete when done.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
