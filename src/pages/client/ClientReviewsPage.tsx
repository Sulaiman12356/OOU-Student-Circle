import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { UserProfile, ReviewItem } from '../../types';
import { Star, MessageSquare, Briefcase, ThumbsUp, Calendar, User } from 'lucide-react';

interface ClientReviewsPageProps {
  currentUser: UserProfile;
  onNavigate: (path: string) => void;
}

export const ClientReviewsPage: React.FC<ClientReviewsPageProps> = ({ currentUser, onNavigate }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(DataStore.getReviews());

  // Filter reviews where client is the reviewer
  const reviewsLeft = reviews.filter(r => r.reviewerId === currentUser.id);

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Reviews & Feedback</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review history, performance feedback, and ratings you have submitted for verified OOU student freelancers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Reviews Submitted</div>
          <div className="text-2xl font-extrabold text-[#061A4F]">{reviewsLeft.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Average Score Given</div>
          <div className="text-2xl font-extrabold text-emerald-700 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            <span>
              {reviewsLeft.length > 0
                ? (reviewsLeft.reduce((sum, r) => sum + r.rating, 0) / reviewsLeft.length).toFixed(1)
                : '5.0'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Student Collaborators</div>
          <div className="text-2xl font-extrabold text-blue-600">
            {new Set(reviewsLeft.map(r => r.recipientId)).size}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviewsLeft.length > 0 ? (
          reviewsLeft.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Reviewed Freelancer</div>
                  <h3 className="font-bold text-sm text-[#061A4F]">{r.recipientName || 'OOU Student'}</h3>
                  <div className="text-[11px] text-slate-500 font-medium">{r.jobTitle || 'Freelance Project Delivery'}</div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating ? 'text-[#F5B400] fill-[#F5B400]' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{r.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{r.comment}"
              </p>

              <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                <span>Submitted on {new Date(r.createdAt).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                  Verified Job Milestone
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-slate-800">No Reviews Left Yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Once an OOU student finishes a contract milestone for your project, you'll be able to leave feedback and ratings here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
