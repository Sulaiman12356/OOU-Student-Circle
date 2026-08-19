import React, { useState } from 'react';
import { ProductItem, ProductReview } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { Star, X, CheckCircle, AlertCircle, Upload, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  product: ProductItem;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  product,
  orderId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('Please login to submit a review.');
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('Please enter your review feedback.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const review: ProductReview = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        vendorId: product.vendorId,
        orderId: orderId,
        customerId: currentUser.id,
        customerName: currentUser.fullName || 'Student Buyer',
        customerPhoto: currentUser.profilePhoto,
        rating,
        reviewTitle: reviewTitle.trim() || undefined,
        comment: comment.trim(),
        imageUrl: imageUrl.trim() || undefined,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString()
      };

      MarketplaceStore.submitProductReview(review);
      setSuccessMessage('Thank you! Your verified review has been published.');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-lg">Verified Purchase Review</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
          <img 
            src={product.mainImage || product.images[0]} 
            alt={product.title} 
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{product.title}</h4>
            <p className="text-xs text-slate-500">Sold by {product.vendorStoreName}</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Your Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-sm text-slate-700">
                {rating === 5 ? 'Exceptional (5/5)' :
                 rating === 4 ? 'Good Quality (4/5)' :
                 rating === 3 ? 'Average (3/5)' :
                 rating === 2 ? 'Below Expectations (2/5)' : 'Poor (1/5)'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Headline / Summary (Optional)
            </label>
            <input 
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. Great quality hoodie, delivered fast!"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Detailed Feedback *
            </label>
            <textarea 
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the product condition, fit/taste/durability, packaging, and experience with the campus vendor..."
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Optional Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Product Photo URL (Optional)
            </label>
            <input 
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-sm font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
