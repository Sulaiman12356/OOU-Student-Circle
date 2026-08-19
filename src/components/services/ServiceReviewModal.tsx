import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { ServiceOrder, ServiceReview } from '../../types';
import { 
  X, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ServiceReviewModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ServiceReviewModal: React.FC<ServiceReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast Delivery', 'Top Quality']);
  const [error, setError] = useState<string | null>(null);

  const availableTags = [
    'Fast Delivery',
    'Top Quality',
    'Great Communication',
    'Punctual & Reliable',
    'Fair Pricing',
    'Highly Recommended',
    'Creative & Skilled'
  ];

  if (!isOpen || !order) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!comment.trim()) {
      setError('Please provide feedback describing your experience.');
      return;
    }

    const reviewData: ServiceReview = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      serviceId: order.serviceId,
      serviceTitle: order.serviceTitle,
      providerId: order.providerId,
      providerName: order.providerName,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhoto: currentUser.profilePhoto,
      customerDepartment: currentUser.department || 'Student Client',
      rating,
      title: title.trim() || 'Exceptional Service & Fast Delivery!',
      comment: comment.trim(),
      tags: selectedTags,
      isVerifiedTransaction: true,
      createdAt: new Date().toISOString()
    };

    const res = DataStore.saveServiceReview(reviewData);
    if (!res.success) {
      setError(res.error || 'Failed to submit review.');
      return;
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div 
      id="service-review-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Write a Verified Review
              </h2>
              <p className="text-xs text-gray-500 truncate max-w-[260px]">
                For completed order: {order.serviceTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Badge Notice */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Verified Transaction Guarantee</span>
              <p className="text-[11px] text-blue-700">
                Your review will be badged as a verified OOU student purchase on {order.providerName}'s profile.
              </p>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center py-2 space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              Rate your experience with {order.providerName}
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-700 block">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Outstanding & Flawless' :
               rating === 4 ? '⭐⭐⭐⭐ Great Work & Fast Delivery' :
               rating === 3 ? '⭐⭐⭐ Average Quality' :
               rating === 2 ? '⭐⭐ Below Expectations' : '⭐ Poor Service'}
            </span>
          </div>

          {/* Review Headline */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Headline / Summary
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Delivered on time with stunning design quality!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 font-medium"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Detailed Feedback *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell other students what you liked about their work, responsiveness, attitude, and turnaround..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 leading-relaxed font-normal"
              required
            />
          </div>

          {/* Highlight Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              Highlight Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#061A4F] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Submit Verified Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
