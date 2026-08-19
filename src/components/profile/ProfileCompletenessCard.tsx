import React from 'react';
import { CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile, ServiceItem } from '../../types';

interface ProfileCompletenessCardProps {
  user: UserProfile;
  servicesCount: number;
  onNavigateToSection?: (sectionId: string) => void;
}

export interface CompletenessItem {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
  hint: string;
}

export const ProfileCompletenessCard: React.FC<ProfileCompletenessCardProps> = ({
  user,
  servicesCount,
  onNavigateToSection
}) => {
  const items: CompletenessItem[] = [
    {
      id: 'photo',
      label: 'Profile Photo',
      completed: Boolean(user.profilePhoto && user.profilePhoto.trim().length > 0),
      weight: 15,
      hint: 'Add a clear headshot or avatar'
    },
    {
      id: 'bio',
      label: 'Professional Bio',
      completed: Boolean(user.shortBio && user.shortBio.trim().length >= 20),
      weight: 15,
      hint: 'Describe your skills and background'
    },
    {
      id: 'campus',
      label: 'Campus & Location',
      completed: Boolean(user.location && user.location.trim().length > 0),
      weight: 15,
      hint: 'Specify your OOU campus'
    },
    {
      id: 'department',
      label: 'Department & Faculty',
      completed: Boolean(user.department && user.faculty),
      weight: 15,
      hint: 'Enter your faculty and course of study'
    },
    {
      id: 'skills',
      label: 'Skills (Min. 3)',
      completed: Boolean(user.skills && user.skills.length >= 3),
      weight: 15,
      hint: 'Add at least 3 skills'
    },
    {
      id: 'portfolio',
      label: 'Portfolio (Min. 1)',
      completed: Boolean(user.portfolio && user.portfolio.length >= 1),
      weight: 15,
      hint: 'Showcase at least one past project'
    },
    {
      id: 'service',
      label: 'Published Service',
      completed: servicesCount > 0,
      weight: 10,
      hint: 'List a service for clients to hire'
    }
  ];

  const totalScore = items.reduce((acc, item) => item.completed ? acc + item.weight : acc, 0);
  const completedCount = items.filter(i => i.completed).length;

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-emerald-700';
    if (score >= 50) return 'bg-[#F5B400] text-amber-800';
    return 'bg-blue-600 text-blue-700';
  };

  return (
    <div id="profile-completeness-card" className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#061A4F]" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#061A4F]">
              Profile Completeness: <span className="text-[#061A4F]">{totalScore}%</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {completedCount} of {items.length} milestones complete. A complete profile gets 4x more client views and connection requests.
          </p>
        </div>

        <span className={`px-3 py-1 text-xs font-black rounded-full self-start sm:self-auto ${
          totalScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {totalScore >= 80 ? '🚀 High Visibility' : '⚡ Profile in Progress'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            totalScore >= 80 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
              : 'bg-gradient-to-r from-[#F5B400] to-amber-500'
          }`}
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onNavigateToSection && onNavigateToSection(item.id)}
            className={`p-2.5 rounded-2xl border transition text-left flex items-start gap-2.5 cursor-pointer ${
              item.completed 
                ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-800' 
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${item.completed ? 'text-emerald-950 font-black' : 'text-slate-700'}`}>
                {item.label}
              </p>
              <p className="text-[10px] text-slate-500 truncate leading-tight">
                {item.completed ? 'Completed' : item.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
