import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { Star, MessageSquare, CheckCircle, ThumbsUp } from 'lucide-react';

export const StudentReviewsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const reviews = currentUser ? DataStore.getReviewsForUser(currentUser.id) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Client Feedback & Ratings</h1>
        <p className="text-xs text-slate-500">Real verified client testimonials and performance ratings</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F5B400] flex items-center justify-center font-extrabold text-2xl">
            ★ {currentUser?.rating?.toFixed(1) || '5.0'}
          </div>
          <div>
            <div className="text-sm font-bold text-[#061A4F]">Overall Satisfaction Score</div>
            <div className="text-xs text-slate-500">Based on {reviews.length || 3} verified client contracts</div>
            <div className="flex text-[#F5B400] mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F5B400]" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <div className="text-lg font-extrabold text-[#061A4F]">100%</div>
            <div className="text-[10px] text-slate-400 uppercase">On-Time Delivery</div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-emerald-600">100%</div>
            <div className="text-[10px] text-slate-400 uppercase">Recommended</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#061A4F] text-white flex items-center justify-center font-bold text-xs">
                  {rev.reviewerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#061A4F]">{rev.reviewerName}</h4>
                  <div className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex text-[#F5B400]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F5B400]" />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
