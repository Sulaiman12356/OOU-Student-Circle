import React, { useState } from 'react';
import { X, Star, ShieldCheck, Send, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import { UnifiedOrder, PartyInfo, UnifiedReview } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';

interface VerifiedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: UnifiedOrder;
  currentUser: PartyInfo;
  onReviewSubmitted: (review: UnifiedReview) => void;
}

const AVAILABLE_TAGS = [
  'Fast Delivery',
  'Great Communication',
  'High Quality Work',
  'Campus Verified',
  'Value for Money',
  'Reliable & Polite',
  'Exceeded Expectations',
  'Accurate to Scope'
];

export const VerifiedReviewModal: React.FC<VerifiedReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  currentUser,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['High Quality Work', 'Fast Delivery']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Strict check
  const eligibility = TransactionEngineStore.canUserReviewOrder(currentUser.id, order.id);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback describing your experience with the provider.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = TransactionEngineStore.submitReview({
        orderId: order.id,
        reviewer: currentUser,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        tags: selectedTags
      });

      if (result.success && result.review) {
        onReviewSubmitted(result.review);
        onClose();
      } else {
        setError(result.message || 'Failed to submit verified review.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error publishing review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#061A4F] to-[#0A267A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F5B400]/20 rounded-xl text-[#F5B400]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400] block">Step 8: Verified Review</span>
              <h2 className="text-lg font-bold">Rate Your Experience</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details badge */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Order #{order.orderId}</p>
            <p className="text-sm font-bold text-slate-800 line-clamp-1">{order.targetItemTitle}</p>
            <p className="text-xs text-slate-600">Provider: <strong className="text-slate-700">{order.seller.name}</strong></p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </div>
        </div>

        {!eligibility.eligible ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Review Ineligible</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {eligibility.reason || 'Only completed transactions can generate reviews.'}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Interactive Stars */}
            <div className="text-center py-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overall Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating !== null ? hoverRating >= star : rating >= star)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600 mt-1 block">
                {rating === 5 && 'Outstanding Work (5.0)'}
                {rating === 4 && 'Very Good Quality (4.0)'}
                {rating === 3 && 'Satisfactory (3.0)'}
                {rating === 2 && 'Needs Improvement (2.0)'}
                {rating === 1 && 'Poor Experience (1.0)'}
              </span>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excellent attention to detail and fast delivery!"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-xs"
              />
            </div>

            {/* Detailed Feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Detailed Review & Feedback *
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your satisfaction with the deliverable, communication, accuracy, and whether you recommend this student provider to other students..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-xs"
                required
              />
            </div>

            {/* Quality Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Highlight Badges
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#061A4F] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verified Badge Notice */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>This review will display with a <strong>Verified Escrow Transaction</strong> badge.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#F5B400]" />
                {isSubmitting ? 'Publishing...' : 'Publish Verified Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
