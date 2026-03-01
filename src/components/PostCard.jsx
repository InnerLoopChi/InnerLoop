import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import {
  doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Heart, Building2, Shield, MapPin, Clock, Users, ArrowRight, Zap,
  Check, Loader2, Trash2, MoreHorizontal, ClipboardCheck, X, CheckCircle2,
} from 'lucide-react';

export default function PostCard({ post, currentUser }) {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const toast = useToast();

  const isTask = post.taskCapacity != null && post.taskCapacity > 0;
  const isFull = isTask && (post.taskFilled || 0) >= post.taskCapacity;
  const isAuthor = post.authorID === currentUser?.id;
  const isInnerPost = post.authorRole === 'Inner';

  // Check application status
  const myApplication = post.applicants?.find(a => a.uid === currentUser?.id);
  const hasApplied = !!myApplication;
  const isAccepted = myApplication?.status === 'accepted';
  const isRejected = myApplication?.status === 'rejected';
  const isPending = myApplication?.status === 'pending';
  const hasJoined = post.joinedUsers?.includes(currentUser?.id);
  const isOnWaitlist = post.waitlist?.includes(currentUser?.id);

  const timeAgo = post.postTime?.toDate ? formatTimeAgo(post.postTime.toDate()) : 'just now';

  // Delete post
  async function handleDelete() {
    if (!isAuthor) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('Post deleted.');
    } catch (err) {
      toast.error('Failed to delete post.');
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-loop-gray/50 p-5 hover:shadow-md transition-shadow duration-300">
      {/* Author header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isInnerPost ? 'bg-gradient-to-br from-loop-purple/25 to-loop-purple/10' : 'bg-gradient-to-br from-loop-red/20 to-loop-red/5'
        }`}>
          {isInnerPost ? <Building2 size={18} className="text-loop-purple" /> : <Heart size={18} className="text-loop-red" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{post.authorName}</p>
          <p className="text-xs text-loop-green/40 flex items-center gap-1">
            {isInnerPost && <Shield size={10} className="text-loop-purple" />}
            {post.authorRole} <span className="mx-1">·</span> {timeAgo}
          </p>
        </div>
        {post.isInnerOnly && (
          <span className="px-2.5 py-1 rounded-full bg-loop-purple/10 text-loop-purple text-xs font-semibold flex items-center gap-1">
            <Shield size={10} /> Inner
          </span>
        )}
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full hover:bg-loop-gray flex items-center justify-center">
              <MoreHorizontal size={16} className="text-loop-green/40" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-loop-gray/50 py-1 min-w-[140px] animate-fadeIn">
                  <button onClick={() => { setShowMenu(false); handleDelete(); }} disabled={deleting}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-loop-red hover:bg-loop-red/5">
                    <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-loop-green/80 mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Requirements preview */}
      {isTask && post.requirements?.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-loop-purple/5 border border-loop-purple/10">
          <p className="text-[10px] font-semibold text-loop-purple mb-1.5 flex items-center gap-1"><ClipboardCheck size={10} /> REQUIREMENTS</p>
          <div className="flex flex-wrap gap-1.5">
            {post.requirements.map((req, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white text-[10px] font-medium border border-loop-purple/10">{req}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-loop-blue/15 border border-loop-blue/15">#{tag}</span>
          ))}
        </div>
      )}

      {/* Task section */}
      {isTask && (
        <div className="p-4 rounded-xl bg-loop-gray/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-loop-green/50 flex items-center gap-1">
              <Users size={12} /> {post.taskFilled || 0} of {post.taskCapacity} spots filled
            </span>
            {isFull ? (
              <span className="text-loop-red font-semibold flex items-center gap-1"><Clock size={12} /> Full — waitlist open</span>
            ) : (
              <span className="text-loop-green/60 font-medium">{post.taskCapacity - (post.taskFilled || 0)} left</span>
            )}
          </div>

          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-loop-red' : 'bg-gradient-to-r from-loop-purple to-loop-red'}`}
              style={{ width: `${Math.min(100, ((post.taskFilled || 0) / post.taskCapacity) * 100)}%` }} />
          </div>

          {isFull && post.waitlist?.length > 0 && (
            <p className="text-xs text-loop-green/40 flex items-center gap-1">
              <Zap size={11} className="text-loop-red" /> {post.waitlist.length} on waitlist — 2× rewards
            </p>
          )}

          {/* Applicant count for author */}
          {isAuthor && post.applicants?.length > 0 && (
            <p className="text-xs font-semibold text-loop-purple flex items-center gap-1">
              <Users size={11} /> {post.applicants.filter(a => a.status === 'pending').length} pending applications
            </p>
          )}

          {/* Action button for non-authors */}
          {!isAuthor && (
            <div>
              {isAccepted || hasJoined ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <CheckCircle2 size={16} /> You've been accepted!
                </div>
              ) : isRejected ? (
                <div className="flex items-center gap-2 text-sm text-loop-green/40">
                  <X size={16} /> Application not selected
                </div>
              ) : isPending ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-loop-purple">
                  <Clock size={16} /> Application pending...
                </div>
              ) : isOnWaitlist ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-loop-red">
                  <Zap size={14} /> On waitlist — 2× rewards if accepted
                </div>
              ) : (
                <button onClick={() => setShowApply(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all
                    ${isFull ? 'bg-loop-red hover:shadow-md' : 'bg-loop-green hover:shadow-md'}
                    hover:scale-105 active:scale-95`}>
                  {isFull ? <><Zap size={14} /> Join Waitlist</> : <><ArrowRight size={14} /> Apply to Task</>}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hours reward */}
      {isTask && post.hoursReward && (
        <div className="flex items-center text-xs text-loop-green/40 pt-2 mt-2 border-t border-loop-gray/50">
          <Clock size={11} className="mr-1" /> +{post.hoursReward} verified hours
        </div>
      )}

      {/* Apply Modal */}
      {showApply && (
        <ApplyModal
          post={post}
          currentUser={currentUser}
          isFull={isFull}
          onClose={() => setShowApply(false)}
        />
      )}
    </div>
  );
}

/* ─── Apply Modal ─────────────────────── */
function ApplyModal({ post, currentUser, isFull, onClose }) {
  const toast = useToast();
  const [checkedReqs, setCheckedReqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const hasRequirements = post.requirements?.length > 0;
  const allChecked = !hasRequirements || checkedReqs.length === post.requirements.length;

  function toggleReq(req) {
    setCheckedReqs(prev => prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]);
  }

  async function handleApply() {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const ref = doc(db, 'posts', post.id);
      const applicant = {
        uid: currentUser.id,
        name: currentUser.name || 'Anonymous',
        role: currentUser.role || 'Looper',
        metRequirements: checkedReqs,
        note: note.trim(),
        status: 'pending',
        appliedAt: new Date().toISOString(),
        tags: currentUser.tags || [],
        starRating: currentUser.starRating || null,
        verifiedHours: currentUser.verifiedHours || 0,
      };

      if (isFull) {
        await updateDoc(ref, {
          waitlist: arrayUnion(currentUser.id),
          applicants: arrayUnion(applicant),
        });
        toast.reward('Applied to waitlist! 2× rewards if accepted.');
      } else {
        await updateDoc(ref, {
          applicants: arrayUnion(applicant),
        });
        toast.success('Application submitted! The organizer will review it.');
      }
      onClose();
    } catch (err) {
      console.error('Apply error:', err);
      toast.error('Failed to apply. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-fadeIn"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-loop-gray/50 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display text-lg font-bold">{isFull ? 'Join Waitlist' : 'Apply to Task'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Task preview */}
          <div className="p-3 rounded-xl bg-loop-gray/30">
            <p className="text-sm font-semibold">{post.authorName}</p>
            <p className="text-xs text-loop-green/60 mt-1 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-loop-green/40">
              <span className="flex items-center gap-1"><Users size={10} /> {post.taskFilled || 0}/{post.taskCapacity}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> +{post.hoursReward}h</span>
            </div>
          </div>

          {/* Requirements checklist */}
          {hasRequirements && (
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <ClipboardCheck size={14} className="text-loop-purple" />
                Requirements — check what applies to you
              </p>
              <div className="space-y-2">
                {post.requirements.map((req, i) => {
                  const checked = checkedReqs.includes(req);
                  return (
                    <button key={i} type="button" onClick={() => toggleReq(req)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        checked ? 'border-loop-purple bg-loop-purple/5' : 'border-loop-gray/50 hover:border-loop-purple/30'
                      }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? 'bg-loop-purple border-loop-purple' : 'border-loop-green/20'
                      }`}>
                        {checked && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm">{req}</span>
                    </button>
                  );
                })}
              </div>
              {!allChecked && (
                <p className="text-xs text-orange-500 mt-2">You haven't checked all requirements — you can still apply but the organizer will see this.</p>
              )}
            </div>
          )}

          {/* Optional note */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Note to organizer <span className="text-loop-green/30 font-normal">(optional)</span></label>
            <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={200} rows={2}
              placeholder="Anything you want the organizer to know..."
              className="w-full px-3 py-2 rounded-xl border border-loop-gray bg-loop-gray/20 text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20 resize-none" />
          </div>

          {/* Your profile preview */}
          <div className="p-3 rounded-xl bg-loop-blue/10 border border-loop-blue/15">
            <p className="text-[10px] font-semibold text-loop-green/40 mb-1.5">YOUR PROFILE (visible to organizer)</p>
            <p className="text-sm font-semibold">{currentUser?.name}</p>
            <div className="flex items-center gap-3 text-xs text-loop-green/50 mt-1">
              {currentUser?.starRating && <span>⭐ {currentUser.starRating}</span>}
              <span>{currentUser?.verifiedHours || 0} verified hours</span>
            </div>
            {currentUser?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {currentUser.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white/60">#{t}</span>)}
              </div>
            )}
          </div>

          {/* Submit */}
          <button onClick={handleApply} disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all
              ${isFull ? 'bg-loop-red' : 'bg-loop-green'}
              ${loading ? 'opacity-60' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
            {loading ? <Loader2 size={18} className="animate-spin" /> :
              isFull ? <><Zap size={16} /> Join Waitlist (2× rewards)</> : <><ArrowRight size={16} /> Submit Application</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Time helper ─────────────────────── */
function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}
