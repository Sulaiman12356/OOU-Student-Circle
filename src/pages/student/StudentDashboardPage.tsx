import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { formatBudget, getServicePrice } from '../../types';
import { 
  Wallet, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  PlusCircle, 
  Briefcase, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const studentServices = currentUser ? DataStore.getServicesByStudent(currentUser.id) : [];
  const myProposals = currentUser ? DataStore.getProposalsByStudent(currentUser.id) : [];
  const openJobs = DataStore.getJobs().filter(j => j.status === 'open').slice(0, 3);
  const myReviews = currentUser ? DataStore.getReviewsForUser(currentUser.id) : [];

  const activeProposals = myProposals.filter(p => p.status === 'pending');
  const acceptedProposals = myProposals.filter(p => p.status === 'accepted');

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#F5B400]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-extrabold uppercase">
                Student Workspace
              </span>
              {currentUser?.isVerified ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified OOU Student
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Verification Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentUser?.department} ({currentUser?.level}) • {currentUser?.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/student/services/new')}
              className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Service</span>
            </button>
            <button
              onClick={() => onNavigate('/student/jobs')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification prompt if unverified */}
      {!currentUser?.isVerified && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#F5B400] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold">Get Verified with your OOU Matriculation Number</div>
              <div className="text-[11px] text-amber-700">Verified student profiles receive 4x more client hire requests and unlock higher payout limits.</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/student/profile')}
            className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] flex-shrink-0"
          >
            Submit ID Details
          </button>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            ₦{(currentUser?.totalEarnings || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Available for withdrawal: ₦{(currentUser?.totalEarnings || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">My Services</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {studentServices.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Published on OOU Marketplace
          </div>
        </div>

        {/* Active Proposals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Proposals Sent</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {myProposals.length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            {acceptedProposals.length} Accepted Contracts
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <Star className="w-4 h-4 fill-[#F5B400]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F] flex items-center gap-1.5">
            <span>{currentUser?.rating ? currentUser.rating.toFixed(1) : '0.0'}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Based on {currentUser?.reviewsCount || myReviews.length || 0} client reviews
          </div>
        </div>

      </div>

      {/* Main Grid: My Services & Recommended Open Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: My Services */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">My Published Services</h2>
            <button
              onClick={() => onNavigate('/student/services')}
              className="text-xs font-bold text-[#061A4F] hover:underline"
            >
              Manage All
            </button>
          </div>

          {studentServices.length > 0 ? (
            <div className="space-y-3">
              {studentServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={service.coverImage || service.coverPhoto || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80'}
                      alt={service.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#061A4F] truncate">{service.title}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Category: {service.category} • Starts at ₦{getServicePrice(service).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                        <span className="text-[10px] text-slate-400">★ {(service.rating || 5.0).toFixed(1)} ({service.reviewsCount || 0})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('/student/services')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-[#061A4F] hover:text-white text-[#061A4F] font-bold text-xs rounded-lg transition flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Services Published Yet</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Create your first service listing to showcase your skills to campus clients.
              </p>
              <button
                onClick={() => onNavigate('/student/services/new')}
                className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
              >
                Create First Service
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Open Campus Jobs available for bidding */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">Latest Open Client Jobs</h2>
            <button
              onClick={() => onNavigate('/student/jobs')}
              className="text-xs font-bold text-[#061A4F] hover:underline"
            >
              View All Jobs
            </button>
          </div>

          <div className="space-y-3">
            {openJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#061A4F] line-clamp-1">{job.title}</h4>
                    <div className="text-[10px] text-slate-500">
                      Posted by {job.clientName} • {job.location}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex-shrink-0">
                    {formatBudget(job.budget)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {job.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{job.proposalsCount} proposals submitted</span>
                  <button
                    onClick={() => onNavigate('/student/jobs')}
                    className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                  >
                    <span>Apply / Bid</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
