import React, { useState } from 'react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Star,
  X,
  Send,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function ReviewModal({ onClose, reviewedUserID, reviewedUserName, hoursForTask, wasWaitlisted = false, postId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate actual hours (2x if waitlisted)
  const actualHours = wasWaitlisted ? hoursForTask * 2 : hoursForTask;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (rating === 0) return setError('Please select a rating.');
    if (!reviewedUserID) return setError('Invalid user to review.');

    try {
      setLoading(true);

      // 0. Check for duplicate review
      const existingReviews = await getDocs(
        query(collection(db, 'reviews'),
          where('reviewerID', '==', user.uid),
          where('reviewedID', '==', reviewedUserID)
        )
      );
      if (!existingReviews.empty) {
        setError('You have already reviewed this person.');
        setLoading(false);
        return;
      }

      // 1. Create the review document
      await addDoc(collection(db, 'reviews'), {
        reviewerID: user.uid,
        reviewedID: reviewedUserID,
        rating,
        hoursVerified: actualHours,
        comment: comment.trim() || null,
        wasWaitlisted,
        postId: postId || null,
        createdAt: Timestamp.now(),
      });

      // 2. Update the reviewed user's stats with proper average
      const userRef = doc(db, 'users', reviewedUserID);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentRating = userData.starRating;
        const reviewCount = userData.reviewCount || 0;

        // Proper running average using review count
        let newRating;
        if (currentRating == null || reviewCount === 0) {
          newRating = rating;
        } else {
          newRating = ((currentRating * reviewCount) + rating) / (reviewCount + 1);
          newRating = Math.round(newRating * 10) / 10;
        }

        newRating = Math.max(1, Math.min(5, newRating));

        // Credits proportional to hours worked
        const creditsEarned = actualHours * (wasWaitlisted ? 2 : 1);

        await updateDoc(userRef, {
          starRating: newRating,
          reviewCount: increment(1),
          verifiedHours: increment(actualHours),
          loopCredits: increment(creditsEarned),
        });
      }

      onClose();
    } catch (err) {
      console.error('Review error:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-loop-gray/50">
          <h2 className="font-display text-lg font-bold">Leave a Review</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reviewed user info */}
          <div className="text-center space-y-1">
            <p className="text-sm text-loop-green/50">Reviewing</p>
            <p className="font-display text-lg font-bold">{reviewedUserName}</p>
          </div>

          {/* Waitlist bonus badge */}
          {wasWaitlisted && (
            <div className="p-3 rounded-xl bg-loop-red/10 border border-loop-red/15 text-center">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-loop-red">
                <Zap size={14} /> Waitlist Bonus Active — 2× hours & credits
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-loop-red/10 border border-loop-red/20 flex items-start gap-2">
              <AlertCircle size={16} className="text-loop-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-loop-red">{error}</p>
            </div>
          )}

          {/* Star Rating */}
          <div className="text-center space-y-3">
            <p className="text-sm font-medium">How did they do?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${i <= (hoverRating || rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-loop-gray/60'
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-loop-green/50">
                {['', 'Needs improvement', 'Fair', 'Good', 'Great', 'Outstanding'][rating]}
              </p>
            )}
          </div>

          {/* Hours verified display */}
          <div className="p-4 rounded-xl bg-loop-gray/40 text-center">
            <p className="text-sm text-loop-green/50 mb-1">Hours to verify</p>
            <p className="text-2xl font-bold">
              {actualHours}
              <span className="text-sm font-normal text-loop-green/40 ml-1">hrs</span>
            </p>
            {wasWaitlisted && (
              <p className="text-xs text-loop-red font-medium mt-1">
                ({hoursForTask} base × 2 waitlist bonus)
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Comment <span className="text-loop-green/30 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was working with them?"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-loop-gray bg-loop-gray/20
                text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                focus:ring-loop-purple/20 focus:border-loop-purple/20 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full
              bg-loop-green font-semibold text-sm text-white transition-all duration-300
              ${loading || rating === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg hover:shadow-loop-green/20 hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
