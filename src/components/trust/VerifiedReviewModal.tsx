import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  UploadCloud, 
  AlertCircle, 
  ShieldCheck, 
  Lock,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  FileCheck
} from 'lucide-react';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { useAuth } from '../../context/AuthContext';

interface VerifiedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  transactionType: 'service' | 'marketplace' | 'job' | 'campus_shop';
  targetItemId: string;
  targetItemTitle: string;
  targetUserId: string;
  targetUserName: string;
  orderAmount?: number;
  onSuccess?: () => void;
}

export const VerifiedReviewModal: React.FC<VerifiedReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  transactionType,
  targetItemId,
  targetItemTitle,
  targetUserId,
  targetUserName,
  orderAmount,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  
  // Rating states
  const [overallRating, setOverallRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [commRating, setCommRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  
  const [writtenReview, setWrittenReview] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Anti-Abuse Pre-flight Check
  const reviewEligibility = currentUser 
    ? TrustSafetyStore.canUserReview(currentUser.id, targetUserId, orderId)
    : { canReview: false, reason: 'Please sign in to leave a review.' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('You must be signed in to submit a review.');
      return;
    }

    if (!writtenReview.trim() || writtenReview.trim().length < 10) {
      setErrorMessage('Please share a written review with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = TrustSafetyStore.submitVerifiedReview({
        orderId,
        transactionType,
        targetItemId,
        targetItemTitle,
        reviewerId: currentUser.id,
        reviewerName: currentUser.fullName,
        reviewerPhoto: currentUser.profilePhoto,
        reviewerRole: currentUser.role,
        targetUserId,
        targetUserName,
        rating: overallRating,
        criteria: {
          quality: qualityRating,
          communication: commRating,
          timeliness: timelinessRating
        },
        writtenReview: writtenReview.trim(),
        proofImages: proofImage ? [proofImage] : []
      });

      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || 'Failed to submit review.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred while saving your review.');
    }
  };

  const renderStarSelector = (
    label: string, 
    value: number, 
    onChange: (val: number) => void
  ) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-amber-400 hover:scale-110 transition focus:outline-none"
          >
            <Star 
              className={`w-4 h-4 ${star <= value ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} 
            />
          </button>
        ))}
        <span className="text-xs font-black text-slate-700 ml-1.5 w-4">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#061A4F] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5B400]/20 border border-[#F5B400]/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-[#F5B400] fill-[#F5B400]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Verified Transaction Review</h2>
              <p className="text-xs text-blue-200">OOU StudentCircle Trust & Reputation Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#061A4F]">Verified Review Published!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you for contributing honest, transaction-verified feedback for <strong className="text-slate-900">{targetUserName}</strong>. Your review is now visible with a verified purchase badge.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : !reviewEligibility.canReview ? (
          /* Anti-Abuse Block Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Review Policy Restriction</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {reviewEligibility.reason}
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>OOU Anti-Abuse Review Mandate:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li>Reviews must be tied to a genuine completed transaction.</li>
                <li>Self reviews are strictly prohibited.</li>
                <li>Duplicate reviews for the same order are blocked.</li>
              </ul>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Understood
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Transaction Verification Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 mt-0.5 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-900">Verified Completed Order #{orderId}</span>
                  <span className="px-2 py-0.2 bg-emerald-200/60 text-emerald-800 font-bold rounded-full text-[10px]">
                    Verified
                  </span>
                </div>
                <div className="text-emerald-800 font-semibold truncate max-w-xs">{targetItemTitle}</div>
                <div className="text-emerald-700 text-[11px]">Provider: {targetUserName}</div>
              </div>
            </div>

            {/* Rating Criteria Breakdown */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-black text-[#061A4F] uppercase tracking-wider mb-1">
                Rating Breakdown
              </div>
              {renderStarSelector('Overall Experience', overallRating, setOverallRating)}
              {renderStarSelector('Delivery Quality & Polish', qualityRating, setQualityRating)}
              {renderStarSelector('Communication & Responsiveness', commRating, setCommRating)}
              {renderStarSelector('Timeliness & Deadline Adherence', timelinessRating, setTimelinessRating)}
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Written Review & Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={writtenReview}
                onChange={(e) => setWrittenReview(e.target.value)}
                placeholder="Share your detailed experience with this student/vendor. How was the final delivery, turnaround speed, and communication?"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
              />
              <span className="text-[10px] text-slate-400">Min. 10 characters</span>
            </div>

            {/* Optional Proof Images */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Work Proof / Product Photos
              </label>
              {proofImage ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 truncate max-w-[200px]">{proofImage}</span>
                  <button
                    type="button"
                    onClick={() => setProofImage(null)}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setProofImage('https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80')}
                  className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                  <span>Attach Delivered Work / Photo Evidence</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Review...' : 'Submit Verified Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
